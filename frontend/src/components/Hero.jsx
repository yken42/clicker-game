import React, { useState, useEffect, useRef } from "react";
import "../styles/Hero.css";
import "../styles/Scoreboard.css";
import { useStore, getStoreState } from "../context/store";
import { getSocket } from "../utils/socket";
import { getCookie } from "../utils/cookies";
import { API_URL } from "../config.js";
import axios from "axios";

export const Hero = () => {
  const { clicks, increment, setClicks } = useStore();
  const [popups, setPopups] = useState([]);
  const [scoreboard, setScoreboard] = useState([]);
  const [userId, setUserId] = useState(null);
  const updateTimerRef = useRef(null);

  // Get userId from token and load user's saved score
  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Ensure userId is a string for comparison
        setUserId(payload.id.toString());
        
        // Load user's saved score from database
        loadUserScore();
      } catch (error) {
        console.error("Error parsing token:", error);
      }
    }
  }, []);

  const loadUserScore = async () => {
    try {
      const token = getCookie("token");
      if (!token) return;

      const response = await axios.get(
        `${API_URL}/api/user/score`,
        {
          headers: {
            authorization: token,
          },
        }
      );
      
      if (response.status === 200 && response.data.score !== undefined) {
        setClicks(response.data.score);
      }
    } catch (error) {
      console.error("Error loading user score:", error);
    }
  };

  // Set up socket listener for scoreboard updates and periodic refresh
  useEffect(() => {
    const socket = getSocket();
    
    const handleScoreboardUpdate = (data) => {
      setScoreboard(data);
    };

    if (socket) {
      socket.on("scoreboard-update", handleScoreboardUpdate);
    }

    // Fetch initial scoreboard
    fetchScoreboard();

    // Set up interval to fetch scoreboard every 5 seconds
    const scoreboardInterval = setInterval(() => {
      fetchScoreboard();
    }, 5000);

    return () => {
      if (socket) {
        socket.off("scoreboard-update", handleScoreboardUpdate);
      }
      clearInterval(scoreboardInterval);
    };
  }, []);

  // Batch update score every 5 seconds from global state
  useEffect(() => {
    if (!userId) return;

    // Update immediately on mount if user has clicks
    if (clicks > 0) {
      updateScore(clicks);
    }

    // Set up interval that reads from global state every 5 seconds
    // The interval reads the latest clicks from global state, not from closure
    updateTimerRef.current = setInterval(() => {
      // Get the latest clicks value from the store directly
      const currentClicks = getStoreState().clicks;
      
      if (currentClicks > 0) {
        updateScore(currentClicks);
      }
    }, 5000);

    return () => {
      // Save score on unmount before clearing interval
      const finalClicks = getStoreState().clicks;
      if (finalClicks > 0) {
        updateScore(finalClicks);
      }
      
      if (updateTimerRef.current) {
        clearInterval(updateTimerRef.current);
        updateTimerRef.current = null;
      }
    };
  }, [userId]); // Only depend on userId, not clicks - interval reads from global state

  const fetchScoreboard = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user/scoreboard`);
      if (response.status === 200) {
        setScoreboard(response.data);
      }
    } catch (error) {
      console.error("Error fetching scoreboard:", error);
    }
  };

  const updateScore = async (score) => {
    try {
      const token = getCookie("token");
      if (!token) return;

      await axios.post(
        `${API_URL}/api/user/score`,
        { clicks: score },
        {
          headers: {
            authorization: token,
          },
        }
      );
    } catch (error) {
      console.error("Error updating score:", error.response?.data || error.message || error);
    }
  };

  const handleClick = () => {
    // Check for critical click (5% chance)
    const isCritical = Math.random() < 0.05;
    const points = isCritical ? 2 : 1;
    
    increment(points);

    // Generate random angle in radians (0 to 2π)
    const angle = Math.random() * Math.PI * 2;
    // Calculate x and y offsets (distance of ~150px to ensure it's outside button)
    const distance = 150;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    // Generate random rotation for tilt (-15 to 15 degrees)
    const rotation = (Math.random() - 0.5) * 30;

    // Create a new popup with unique ID, random direction, random tilt, and critical status
    const popupId = Date.now() + Math.random();
    setPopups((prev) => [...prev, { id: popupId, x, y, rotation, isCritical, points }]);

    // Remove popup after animation completes (1 second)
    setTimeout(() => {
      setPopups((prev) => prev.filter((popup) => popup.id !== popupId));
    }, 1000);
  };

  return (
    <div style={{ display: "flex", gap: "40px", padding: "20px", maxWidth: "1200px", margin: "0 auto", flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start" }}>
      <div className="hero-button-container">
        <div className="click-counter-container">
          <p>{clicks}</p>
        </div>

        <div className="button-wrapper">
          <button onClick={handleClick}>
            <span className="shadow"></span>
            <span className="edge"></span>
            <span className="front text"></span>
          </button>
          {popups.map((popup) => (
            <span
              key={popup.id}
              className={`click-popup ${popup.isCritical ? 'critical' : ''}`}
              style={{
                "--popup-x": `${popup.x}px`,
                "--popup-y": `${popup.y}px`,
                "--popup-rotation": `${popup.rotation}deg`,
              }}
            >
              +{popup.points}
            </span>
          ))}
        </div>
      </div>

      <div className="scoreboard-container">
        <h2 className="scoreboard-title">Leaderboard</h2>
        {scoreboard.length > 0 ? (
          <ul className="scoreboard-list">
            {scoreboard.map((entry) => (
              <li
                key={entry.userId}
                className={`scoreboard-item ${entry.userId === userId ? 'own-score' : ''}`}
              >
                <span className="scoreboard-rank">#{entry.rank}</span>
                <span className="scoreboard-name">{entry.displayName}</span>
                <span className="scoreboard-score">{entry.score.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="scoreboard-empty">No scores yet. Start clicking!</div>
        )}
      </div>
    </div>
  );
};

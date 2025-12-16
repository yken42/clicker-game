import React, { useState } from "react";
import "../styles/Hero.css";

export const Hero = () => {
  const [clickCounter, setClickCounter] = useState(0);
  const [popups, setPopups] = useState([]);

  const handleClick = () => {
    // Check for critical click (5% chance)
    const isCritical = Math.random() < 0.05;
    const points = isCritical ? 2 : 1;
    
    setClickCounter(clickCounter + points);

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
    <>
      <div className="hero-button-container">
        <div className="click-counter-container">
          <p>{clickCounter}</p>
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
    </>
  );
};

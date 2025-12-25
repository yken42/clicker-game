import React from "react";
import "../styles/Navbar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getCookie, removeCookie } from "../utils/cookies";
import { disconnectSocket } from "../utils/socket";
import { useStore } from "../context/store";
import { API_URL } from "../config.js";

export const Navbar = () => {
  const isLoggedIn = getCookie("token");
  const navigate = useNavigate();
  const { resetClicks } = useStore();

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/user/logout`);
      if (response.status === 200) {
        // Clear global state before disconnecting
        resetClicks();
        // Disconnect socket before removing token
        disconnectSocket();
        removeCookie("token");
        navigate("/login");
      }
    } catch (error) {
      // Even if logout API fails, clear state, disconnect socket and clear token
      resetClicks();
      disconnectSocket();
      removeCookie("token");
      navigate("/login");
    }
  };
  return (
    <nav className="navbar" aria-label="Primary">
      <div className="navbar-inner">
        <a className="navbar-brand" href="/">
          Clicker Game
        </a>

        <ul className="navbar-list">
          {isLoggedIn ? (
            <li className="navbar-item">
              <a className="navbar-link" onClick={handleLogout}>
                Logout
              </a>
            </li>
          ) : (
            <>
              <li className="navbar-item">
                <a className="navbar-link" href="/login">
                  Login
                </a>
              </li>
              <li className="navbar-item">
                <a className="navbar-link navbar-link--cta" href="/signup">
                  Sign up
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

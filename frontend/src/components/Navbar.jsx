import React from "react";
import "../styles/Navbar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getCookie, removeCookie } from "../utils/cookies";

export const Navbar = () => {
  const isLoggedIn = getCookie("token");
  const navigate = useNavigate();

  const handleLogout = async () => {
    const response = await axios.post("http://localhost:3000/api/user/logout");
    if (response.status === 200) {
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
          <li className="navbar-item">
            <a className="navbar-link" href="/scoreboard">
              Scoreboard
            </a>
          </li>
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

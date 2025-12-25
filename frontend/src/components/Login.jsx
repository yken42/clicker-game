import React, { useState } from "react";
import "../styles/Login.css";
import axios from "axios";  
import { useNavigate } from "react-router-dom";
import { setCookie } from "../utils/cookies";
import { connectSocket } from "../utils/socket";
import { useStore } from "../context/store";
import { API_URL } from "../config.js";


export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { resetClicks } = useStore();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/user/login`, { email, password });
      if (response.status === 201) {
        // Clear global state before logging in to ensure fresh start
        resetClicks();
        setCookie("token", response.data.token);
        // Connect socket after successful login
        connectSocket();
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

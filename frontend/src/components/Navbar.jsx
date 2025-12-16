import React from 'react'
import '../styles/Navbar.css'
export const Navbar = () => {
  return (
    <nav className="navbar">
        <ul className="navbar-list">
            <li className="navbar-item"><a href="/scoreboard">Scoreboard</a></li>
            <li className="navbar-item"><a href="/login">Login</a></li>
            <li className="navbar-item"><a href="/signup">Sign up</a></li>
        </ul>
    </nav>
  )
}
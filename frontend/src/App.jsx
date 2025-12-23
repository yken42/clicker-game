import "./App.css";
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layout/MainLayout.jsx";
import { Hero } from "./components/Hero.jsx";
import { Login } from "./components/Login.jsx";
import { Signup } from "./components/Signup.jsx";
import { getSocket, connectSocket } from "./utils/socket";
import { getCookie } from "./utils/cookies";


function App() {
  useEffect(() => {
    // Connect socket if user is logged in (e.g., on page refresh)
    const token = getCookie("token");
    if (token) {
      connectSocket();
    }

    // Set up socket listeners
    const socket = getSocket();
    if (!socket) {
      return; // No socket connection if not logged in
    }
    
  socket.on("connect", () => {
    console.log("Connected to server");
  });
    
  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });

  socket.on("welcome", (message) => {
      console.log("Welcome message:", message);
  });

    // Cleanup: remove event listeners (but don't disconnect socket)
    return () => {
      if (socket) {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("welcome");
      }
    };
  }, []);

  return (
    <>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </MainLayout>
      </Router>
    </>
  );
}

export default App;

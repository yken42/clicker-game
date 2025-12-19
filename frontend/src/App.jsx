import "./App.css";
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layout/MainLayout.jsx";
import { Hero } from "./components/Hero.jsx";
import { Login } from "./components/Login.jsx";
import { Signup } from "./components/Signup.jsx";
import { getSocket } from "./utils/socket";


function App() {
  useEffect(() => {
    // Get singleton socket instance (reuses existing connection)
    const socket = getSocket();
    
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
    // Socket will be reused if component remounts
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("welcome");
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

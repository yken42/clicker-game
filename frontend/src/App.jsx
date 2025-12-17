import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layout/MainLayout.jsx";
import { Hero } from "./components/Hero.jsx";
import { Login } from "./components/Login.jsx";
import { Signup } from "./components/Signup.jsx";
function App() {
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

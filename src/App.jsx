import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import VideoPlayer from "./components/VideoPlayer";
import AOS from "aos";
import "aos/dist/aos.css";
import "./App.css";

function App() {
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleLogin = (name) => {
    setUserName(name);
    localStorage.setItem("userName", name);
  };

  const handleLogout = () => {
    setUserName("");
    localStorage.removeItem("userName");
  };

  // If not logged in, protect routes
  if (!userName) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage userName={userName} onLogout={handleLogout} />} />
          <Route path="/category/:categoryName" element={<CategoryPage userName={userName} onLogout={handleLogout} />} />
          <Route path="/video/:videoId" element={<VideoPlayer userName={userName} onLogout={handleLogout} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
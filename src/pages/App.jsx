import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import VideoPlayer from "./components/VideoPlayer";
import AOS from "aos";
import "aos/dist/aos.css";

function App() {
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const handleLogin = (name) => {
    setUserName(name);
    localStorage.setItem("userName", name);
  };

  const handleLogout = () => {
    setUserName("");
    localStorage.removeItem("userName");
  };

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    return userName ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Login Route */}
          <Route 
            path="/login" 
            element={
              userName ? (
                <Navigate to="/" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <HomePage 
                  userName={userName} 
                  onLogout={handleLogout} 
                />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/category/:categoryName" 
            element={
              <ProtectedRoute>
                <CategoryPage 
                  userName={userName}
                  onLogout={handleLogout}
                />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/video/:videoId" 
            element={
              <ProtectedRoute>
                <VideoPlayer 
                  userName={userName}
                  onLogout={handleLogout}
                />
              </ProtectedRoute>
            } 
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
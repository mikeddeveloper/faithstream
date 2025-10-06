import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import "./Login.css";

function Login({ onLogin }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    AOS.init({ 
      duration: 1200,
      once: true,
      offset: 100
    });

    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      
      if (hour < 12) setGreeting("Good Morning 🌅");
      else if (hour < 18) setGreeting("Good Afternoon ☀️");
      else setGreeting("Good Evening 🌙");
      
      setCurrentTime(`${hour % 12 || 12}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !password) return alert("Please enter both name and password");

    setLoading(true);

    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const existingUser = querySnapshot.docs.find(
        (doc) =>
          doc.data().name.toLowerCase() === name.toLowerCase() &&
          doc.data().password === password
      );

      if (existingUser) {
        localStorage.setItem("userName", name);
        onLogin(name);
      } else {
        await addDoc(collection(db, "users"), { name, password });
        localStorage.setItem("userName", name);
        onLogin(name);
      }
    } catch (error) {
      console.error("❌ Error saving user:", error);
      alert("Error signing in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Animated Background Elements */}
      <div className="bg-shapes">
        <div className="shape shape-1" data-aos="fade-down-right" data-aos-delay="200"></div>
        <div className="shape shape-2" data-aos="fade-up-left" data-aos-delay="400"></div>
        <div className="shape shape-3" data-aos="fade-up-right" data-aos-delay="600"></div>
        <div className="shape shape-4" data-aos="fade-down-left" data-aos-delay="800"></div>
      </div>

      <div className="login-content">
        {/* Header Section */}
        <header className="login-header" data-aos="fade-down" data-aos-delay="300">
          <div className="logo" data-aos="zoom-in" data-aos-delay="500">
            ⛪ FaithStream
          </div>
          <div className="time-display" data-aos="fade-left" data-aos-delay="700">
            {currentTime}
          </div>
        </header>

        {/* Main Login Box */}
        <div className="login-center">
          <div className="login-card" data-aos="zoom-in" data-aos-delay="400">
            <div className="card-header" data-aos="fade-up" data-aos-delay="600">
              <div className="welcome-icon" data-aos="bounce-in" data-aos-delay="800">
                ✨
              </div>
              <h1 data-aos="fade-up" data-aos-delay="700">{greeting}</h1>
              <p data-aos="fade-up" data-aos-delay="800">Welcome to your spiritual journey</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-group" data-aos="fade-right" data-aos-delay="900">
                <div className="input-icon">👤</div>
                <input
                  type="text"
                  placeholder="Enter your name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="login-input"
                />
              </div>

              <div className="input-group" data-aos="fade-left" data-aos-delay="1000">
                <div className="input-icon">🔒</div>
                <input
                  type="password"
                  placeholder="Enter your password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="login-btn"
                data-aos="zoom-in" 
                data-aos-delay="1100"
              >
                <span className="btn-content">
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      Signing In...
                    </>
                  ) : (
                    <>
                      Continue Your Journey 
                      <span className="btn-arrow">🚀</span>
                    </>
                  )}
                </span>
              </button>
            </form>

            <div className="login-footer" data-aos="fade-up" data-aos-delay="1200">
              <p>Stream faith, spread hope ✨</p>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="floating-elements">
          <div className="floating-icon" data-aos="float" data-aos-delay="1000">🎬</div>
          <div className="floating-icon" data-aos="float" data-aos-delay="1200">🙏</div>
          <div className="floating-icon" data-aos="float" data-aos-delay="1400">🌟</div>
        </div>
      </div>
    </div>
  );
}

export default Login;
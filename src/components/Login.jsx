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
      duration: 1000,
      once: true,
      offset: 100
    });

    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      
      if (hour < 12) setGreeting("Good Morning");
      else if (hour < 18) setGreeting("Good Afternoon");
      else setGreeting("Good Evening");
      
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
      console.error("Error saving user:", error);
      alert("Error signing in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Background with subtle gradient */}
      <div className="background-overlay"></div>
      
      {/* Header */}
      <header className="login-header" data-aos="fade-down">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">⛪</div>
            <span className="logo-text">FaithStream</span>
          </div>
          <div className="time-display">
            <span className="time-icon">🕒</span>
            {currentTime}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="login-main">
        <div className="login-wrapper">
          {/* Left Side - Branding */}
          <div className="brand-section" data-aos="fade-right">
            <div className="brand-content">
              <h1 className="brand-title">
                Stream <span className="accent-text">Faith</span>
                <br />
                Spread <span className="accent-text">Hope</span>
              </h1>
              <p className="brand-subtitle">
                Access inspiring Christian content that transforms lives and strengthens faith journeys.
              </p>
              <div className="feature-list">
                <div className="feature-item">
                  <span className="feature-icon">🎬</span>
                  <span>Biblical Movies & Series</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🎵</span>
                  <span>Worship & Music</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📚</span>
                  <span>Teaching & Documentaries</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="form-section" data-aos="fade-left" data-aos-delay="200">
            <div className="form-container">
              <div className="form-header">
                <h2 className="form-greeting">{greeting}</h2>
                <p className="form-welcome">Welcome back to your spiritual sanctuary</p>
              </div>

              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group" data-aos="fade-up" data-aos-delay="300">
                  <label htmlFor="name" className="form-label">Your Name</label>
                  <div className="input-container">
                    <input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-input"
                      required
                    />
                    <div className="input-icon"></div>
                  </div>
                </div>

                <div className="form-group" data-aos="fade-up" data-aos-delay="400">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="input-container">
                    <input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-input"
                      required
                    />
                    <div className="input-icon"></div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="submit-btn"
                  data-aos="fade-up" 
                  data-aos-delay="500"
                >
                  <span className="btn-content">
                    {loading ? (
                      <>
                        <div className="spinner"></div>
                        Authenticating...
                      </>
                    ) : (
                      <>
                        <span className="btn-text">Enter FaithStream</span>
                        <span className="btn-arrow">→</span>
                      </>
                    )}
                  </span>
                </button>
              </form>

              <div className="form-footer" data-aos="fade-up" data-aos-delay="600">
                <p className="security-note">
                  🔒 Your spiritual journey is secure with us
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="login-footer">
        <div className="footer-content">
          <p>&copy; 2025 FaithStream. Elevating faith through digital media.</p>
        </div>
      </footer>
    </div>
  );
}

export default Login;
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

  useEffect(() => {
    AOS.init({ duration: 1000 });
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning 🌞");
    else if (hour < 18) setGreeting("Good Afternoon ☀️");
    else setGreeting("Good Evening 🌙");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !password) return alert("Please enter both name and password");

    setLoading(true);

    try {
      // Check if user already exists
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
        // Save new user
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
    <div className="login-container" data-aos="fade-in">
      <div className="login-box" data-aos="zoom-in">
        <h1>{greeting}</h1>
        <p>Welcome to <b>FaithStream</b> 🎥</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter your password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Continue ➡️"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

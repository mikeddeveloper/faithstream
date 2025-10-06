import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import "./Welcome.css";

function Welcome({ onContinue }) {
  const [name, setName] = useState("");
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
    if (!name) return alert("Please enter your name");

    try {
      await addDoc(collection(db, "users"), { name });
      localStorage.setItem("userName", name);
      onContinue(name);
    } catch (error) {
      console.error("Error saving name:", error);
    }
  };

  return (
    <div className="welcome-container" data-aos="fade-in">
      <div className="welcome-box" data-aos="zoom-in">
        <h1>{greeting}</h1>
        <p>Please enter your name to continue</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit">Continue ➡️</button>
        </form>
      </div>
    </div>
  );
}

export default Welcome;

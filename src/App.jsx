import React, { useState, useEffect } from "react";
import Welcome from "./components/Welcome";
import AOS from "aos";
import "aos/dist/aos.css";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

function Main({ userName }) {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1 data-aos="fade-up">Welcome back, {userName}! 👋</h1>
    </div>
  );
}

function App() {
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
  const [showWelcome, setShowWelcome] = useState(!userName);

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const handleContinue = (name) => {
    setUserName(name);
    setShowWelcome(false);
  };

  return <div>{showWelcome ? <Welcome onContinue={handleContinue} /> : <Main userName={userName} />}</div>;
}

export default App;

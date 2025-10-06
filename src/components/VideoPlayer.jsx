import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

function VideoPlayer({ userName, onLogout }) {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const video = location.state?.video;

  if (!video) {
    return (
      <div className="video-page">
        <div className="container">
          <h2>Video not found</h2>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="video-page">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
            <h1>Now Playing</h1>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="video-player">
            <iframe
              src={video.url}
              title={video.title}
              allowFullScreen
              className="video-iframe"
            ></iframe>
          </div>
          <div className="video-info">
            <h2>{video.title}</h2>
            <p className="author">{video.pastor}</p>
            <p className="description">{video.description}</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default VideoPlayer;
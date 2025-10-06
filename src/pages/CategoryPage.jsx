import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

function CategoryPage({ userName, onLogout }) {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  const allVideos = {
    "biblical-movies": [
      {
        id: 1,
        title: "The Chosen - Season 1",
        url: "https://www.youtube.com/embed/6QkC5_6xrAo",
        pastor: "The Chosen",
        description: "The groundbreaking series about the life of Jesus."
      },
      {
        id: 2,
        title: "Jesus Film",
        url: "https://www.youtube.com/embed/11FQQv81hDw", 
        pastor: "Jesus Film Project",
        description: "The most translated film in history."
      },
      {
        id: 3,
        title: "The Chosen - Season 1",
        url: "https://www.youtube.com/embed/6QkC5_6xrAo",
        pastor: "The Chosen",
        description: "The groundbreaking series about the life of Jesus."
      },
      {
        id: 4,
        title: "Jesus Film",
        url: "https://www.youtube.com/embed/11FQQv81hDw", 
        pastor: "Jesus Film Project",
        description: "The most translated film in history."
      }
    ],
    "worship": [
      {
        id: 1,
        title: "What a Beautiful Name",
        url: "https://www.youtube.com/embed/nQWFzMvCfLE",
        pastor: "Hillsong Worship",
        description: "Powerful worship anthem."
      }
    ],
    "documentaries": [
      {
        id: 1,
        title: "The Case for Christ",
        url: "https://www.youtube.com/embed/6-On6dU2U0",
        pastor: "Pure Flix",
        description: "Evidence for Jesus investigation."
      }
    ],
    "christian-living": [
      {
        id: 1,
        title: "How to Study the Bible",
        url: "https://www.youtube.com/embed/nKqWNZ3AN-c",
        pastor: "Bible Project",
        description: "Study methods for God's Word."
      }
    ],
    "christian-anime": [
      {
        id: 1,
        title: "Superbook - Christmas",
        url: "https://www.youtube.com/embed/6kqsdG2dT_c",
        pastor: "Superbook",
        description: "Animated Christmas story."
      }
    ]
  };

  const formattedName = categoryName.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const videos = allVideos[categoryName] || [];

  const handleVideoClick = (video) => {
    navigate(`/video/${video.id}`, { state: { video } });
  };

  return (
    
    <div className="category-page">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="back-btn">← Back to Home</Link>
            <h1>{formattedName}</h1>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="videos-grid">
            {videos.map(video => (
              <div key={video.id} className="video-card" onClick={() => handleVideoClick(video)}>
                <div className="video-thumbnail">
                  <iframe src={video.url} title={video.title} allowFullScreen></iframe>
                </div>
                <div className="video-details">
                  <h3>{video.title}</h3>
                  <p>{video.pastor}</p>
                  <p className="description">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default CategoryPage;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage({ userName, onLogout }) {
  const [selectedCategory, setSelectedCategory] = useState("Biblical Movies");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 6; // Show 6 videos per page
  const navigate = useNavigate();

  const categories = [
    { name: "Biblical Movies", icon: "🎬", color: "#667eea" },
    { name: "Worship", icon: "🎵", color: "#ff6b6b" },
    { name: "Documentaries", icon: "📚", color: "#4ecdc4" },
    { name: "Christian Living", icon: "🙏", color: "#ffd93d" },
    { name: "Christian Anime", icon: "🌟", color: "#6c5ce7" }
  ];

  // Expanded video database
  const allVideos = {
    "Biblical Movies": [
      { id: 1, title: "Olukoya - Chapter 1", url: "https://www.youtube.com/embed/AAqm0j1Nqoo", description: "In this chapter, Olatunde continues his spiritual journey of faith, obedience, and surrender to God’s will. As prophecies unfold and trials deepen, the cost of divine calling becomes clear, but so does God’s redeeming power." },
      { id: 2, title: " Olukoya - Chapter 2", url: "https://www.youtube.com/embed/mjRX4mMbLI8", description: "" },
      { id: 3, title: "UNDERSEIGE", url: "https://www.youtube.com/embed/11FQQv81hDw",   },
      { id: 4, title: "PRAEY", url: "https://www.youtube.com/embed/hsG4HU6cgWY",  description: "Experience a thrilling tale of faith, courage, and the supernatural. When four young doctors face an unseen force in a remote village. Are you ready to confront the unknown? Its a faith-base mo" },
      { id: 5, title: "Risen", url: "https://www.youtube.com/embed/7TxD3cxUQcc",  description: "Roman soldier investigates Jesus' resurrection." },
      { id: 6, title: "The Nativity Story", url: "https://www.youtube.com/embed/sFav5yMqfnY",  description: "The story of Jesus' birth." },
      { id: 7, title: "Son of God", url: "https://www.youtube.com/embed/MhiH0ah-3qw",  description: "Comprehensive story of Jesus' life." },
      { id: 8, title: "The Gospel of John", url: "https://www.youtube.com/embed/eMuQb0_j7GY",  description: "Word-for-word adaptation of John's Gospel." },
      { id: 9, title: "Matthew", url: "https://www.youtube.com/embed/QIoUmnSkOXE",  description: "Complete Gospel of Matthew." },
      { id: 10, title: "Magdalena", url: "https://www.youtube.com/embed/JAPOtjg_5Us", description: "Jesus' ministry through women's eyes." },
      { id: 11, title: "The Story of Jesus for Children", url: "https://www.youtube.com/embed/F8IPzpcuPGs", description: "Animated version for kids." },
      { id: 12, title: "Beyond the Gates", url: "https://www.youtube.com/embed/RBY9sfQCRvI", description: "Rwandan genocide story of faith." },
      { id: 11, title: "The Story of Jesus for Children", url: "https://www.youtube.com/embed/F8IPzpcuPGs", description: "Animated version for kids." },
      { id: 12, title: "Beyond the Gates", url: "https://www.youtube.com/embed/RBY9sfQCRvI", description: "Rwandan genocide story of faith." }
    
    ],
    "Worship": [
      { id: 1, title: "What a Beautiful Name", url: "https://www.youtube.com/embed//LJA_g-_xlCs", pastor: "Hillsong Worship", description: "Powerful worship anthem." },
      { id: 2, title: "Goodness of God", url: "https://www.youtube.com/embed/t-wG29TxkEc", pastor: "Bethel Music", description: "Celebrating God's unwavering goodness." },
      { id: 3, title: "Way Maker", url: "https://www.youtube.com/embed/5taka1Ftu-E", pastor: "Sinach", description: "God as our way maker." },
      { id: 4, title: "Reckless Love", url: "https://www.youtube.com/embed/fem4tFkwUEU", pastor: "Cory Asbury", description: "God's overwhelming, reckless love." },
      { id: 5, title: "Great Are You Lord", url: "https://www.youtube.com/embed//a276pMl4udQ", pastor: "All Sons & Daughters", description: "Powerful declaration of God's greatness." },
      { id: 6, title: "O Come to the Altar", url: "https://www.youtube.com/embed/4N-T2OzVNIU", pastor: "Elevation Worship", description: "Invitation to encounter God." },
      { id: 7, title: "King of Kings", url: "https://www.youtube.com/embed/X8ElWoN0HBE", pastor: "Hillsong Worship", description: "Majestic worship song." },
      { id: 8, title: "Build My Life", url: "https://www.youtube.com/embed/Dak86UT5G_E", pastor: "Pat Barrett", description: "Surrendering our lives to God." },
      { id: 9, title: "Graves Into Gardens", url: "https://www.youtube.com/embed/u3K0QnG0uR8", pastor: "Elevation Worship", description: "God's transformative power." },
      { id: 10, title: "The Blessing", url: "https://www.youtube.com/embed//wP1SYyKp7vU", pastor: "Kari Jobe", description: "Powerful blessing over families." }
    ],
    "Documentaries": [
      { id: 1, title: "The Case for Christ", url: "https://www.youtube.com/embed/17Kq9BsM0jU", pastor: "Pure Flix", description: "Evidence for Jesus investigation." },
      { id: 2, title: "Patterns of Evidence: Exodus", url: "https://www.youtube.com/embed/H6zJOEzVi3A", pastor: "Thinking Man Films", description: "Archaeological evidence for Exodus." },
      { id: 3, title: "The Star of Bethlehem", url: "https://www.youtube.com/embed/jfdgT8LsoW8", pastor: "Stephen McEveety", description: "Scientific look at the Christmas star." },
      { id: 4, title: "God's Not Dead", url: "https://www.youtube.com/embed/B-ePCiUgD0Y", pastor: "Pure Flix", description: "College student defends his faith." },
      { id: 5, title: "The Principle", url: "https://www.youtube.com/embed/jfdgT8LsoW8", pastor: "Rick DeLano", description: "Scientific evidence for God." },
      { id: 6, title: "Genesis: Paradise Lost", url: "https://www.youtube.com/embed/U0u3-2CGOMQ", pastor: "Creation Today", description: "Defense of biblical creation." },
      { id: 7, title: "The God Who Speaks", url: "https://www.youtube.com/embed/i_eJqsnPknM", pastor: "American Bible Society", description: "Power of God's Word." },
      { id: 8, title: "Finger of God", url: "https://www.youtube.com/embed/5HMicy0JD-E", pastor: "Darren Wilson", description: "Documentary on modern miracles." }
    ],
    "Christian Living": [
      { id: 1, title: "How to Study the Bible", url: "https://www.youtube.com/embed/8GX4l0iAlcw", pastor: "Bible Project", description: "Study methods for God's Word." },
      { id: 2, title: "Prayer That Changes Things", url: "https://www.youtube.com/embed//cOhMuI69Gp8", pastor: "Joseph Prince", description: "Understanding prayer power." },
      { id: 3, title: "Finding Your Purpose", url: "https://www.youtube.com/embed/tJVSG-lgITw", pastor: "Rick Warren", description: "Discovering God's plan for you." },
      { id: 4, title: "Financial Freedom", url: "https://www.youtube.com/embed/oGkQ-lm39Tc", pastor: "Dave Ramsey", description: "Biblical principles for finances." },
      { id: 5, title: "Marriage God's Way", url: "https://www.youtube.com/embed/TerYDCsP1ZA", pastor: "Focus on the Family", description: "Building strong Christian marriages." },
      { id: 6, title: "Parenting with Purpose", url: "https://www.youtube.com/embed/JvbmRofy_aA", pastor: "Dennis and Barbara Rainey", description: "Raising children in faith." },
      { id: 7, title: "Overcoming Anxiety", url: "https://www.youtube.com/embed/DZFJ8iGDGIk", pastor: "Joyce Meyer", description: "Biblical approach to anxiety." },
      { id: 8, title: "Spiritual Disciplines", url: "https://www.youtube.com/embed/X5mRnO_t9Ec", pastor: "John Piper", description: "Growing through spiritual practices." }
    ],
    "Christian Anime": [
      { id: 1, title: "Superbook - The First Christmas", url: "https://www.youtube.com/embed/4dzjD5FxJPg", pastor: "Superbook", description: "Animated Christmas story." },
      { id: 2, title: "The Beginner's Bible", url: "https://www.youtube.com/embed/UhuSolM_zZg", pastor: "Beginner's Bible", description: "Simple animated Bible stories." },
      { id: 3, title: "Animated Stories from the Bible", url: "https://www.youtube.com/embed/UhuSolM_zZg", pastor: "Nest Entertainment", description: "Classic Bible stories animated." },
      { id: 4, title: "The Story of Jesus Animation", url: "https://www.youtube.com/embed/Nt4kCgt_Kj4", pastor: "Christian Anime Studios", description: "Jesus' life in animation." },
      { id: 5, title: "Noah's Ark Adventure", url: "https://www.youtube.com/embed/V6QYoWEmXLI", pastor: "Genesis Animation", description: "Noah's story for children." },
      { id: 6, title: "David and Goliath", url: "https://www.youtube.com/embed/32_Izk21ktw", pastor: "BibleToons", description: "Classic underdog story." },
      { id: 7, title: "Joseph: King of Dreams", url: "https://www.youtube.com/embed/qBSTCBSlf9Q", pastor: "DreamWorks", description: "Joseph's journey to Egypt." },
      { id: 8, title: "The Prince of Egypt", url: "https://www.youtube.com/embed/Ty3vrOoWtNM", pastor: "DreamWorks", description: "Moses' epic story." }
    ]
  };

  const featuredVideos = {
    "Biblical Movies": allVideos["Biblical Movies"][0],
    "Worship": allVideos["Worship"][0],
    "Documentaries": allVideos["Documentaries"][0],
    "Christian Living": allVideos["Christian Living"][0],
    "Christian Anime": allVideos["Christian Anime"][0]
  };

  // Pagination logic
  const currentVideos = allVideos[selectedCategory] || [];
  const totalPages = Math.ceil(currentVideos.length / videosPerPage);
  
  // Get current page videos
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideosPage = currentVideos.slice(indexOfFirstVideo, indexOfLastVideo);

  const handleExploreCategory = () => {
    const categorySlug = selectedCategory.toLowerCase().replace(/\s+/g, '-');
    navigate(`/category/${categorySlug}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`);
      setSearchQuery("");
      setShowSearch(false);
    }
  };

  const handleVideoClick = (video) => {
    navigate(`/video/${video.id}`, { state: { video } });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentVideo = featuredVideos[selectedCategory];

  return (
    <div className="app">
      {/* Header (same as before) */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">⛪ FaithStream</div>
            
            <div className="header-actions">
              <div className={`search-container ${showSearch ? 'active' : ''}`}>
                <form onSubmit={handleSearch} className="search-form">
                  <input
                    type="text"
                    placeholder="Search videos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  <button type="submit" className="search-submit">
                    🔍
                  </button>
                </form>
              </div>
              
              <button 
                className="search-toggle"
                onClick={() => setShowSearch(!showSearch)}
              >
                🔍
              </button>

              <div className="user-info">
                <span>Welcome, {userName}</span>
                <button onClick={onLogout} className="logout-btn">Logout</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Stream Faith, Spread Hope</h1>
            <p>Discover {currentVideos.length}+ inspiring Christian videos</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories">
        <div className="container">
          <h2>Choose Category</h2>
          <div className="category-grid">
            {categories.map(category => (
              <div
                key={category.name}
                className={`category-card ${selectedCategory === category.name ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory(category.name);
                  setCurrentPage(1); // Reset to first page when category changes
                }}
              >
                <div className="category-icon">{category.icon}</div>
                <h3>{category.name}</h3>
                <span className="video-count">{allVideos[category.name]?.length || 0} videos</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Video */}
      <section className="featured">
        <div className="container">
          <h2>Featured in {selectedCategory}</h2>
          <div className="featured-content">
            <div className="video-container">
              <iframe
                src={currentVideo.url}
                title={currentVideo.title}
                allowFullScreen
              ></iframe>
            </div>
            <div className="video-info">
              <h3>{currentVideo.title}</h3>
              <p className="author">{currentVideo.pastor}</p>
              <p className="description">{currentVideo.description}</p>
              <button onClick={handleExploreCategory} className="explore-btn">
                Explore All {selectedCategory} Videos →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Video Grid with Pagination */}
      <section className="recent-videos">
        <div className="container">
          <div className="section-header">
            <h2>Recent Videos in {selectedCategory}</h2>
            <span className="page-info">
              Page {currentPage} of {totalPages} • Showing {currentVideosPage.length} of {currentVideos.length} videos
            </span>
          </div>
          
          <div className="videos-grid">
            {currentVideosPage.map(video => (
              <div 
                key={video.id} 
                className="video-card"
                onClick={() => handleVideoClick(video)}
              >
                <div className="video-thumbnail">
                  <iframe
                    src={video.url}
                    title={video.title}
                    allowFullScreen
                  ></iframe>
                  <div className="video-overlay">
                    <div className="play-indicator">▶</div>
                  </div>
                </div>
                <div className="video-details">
                  <h3>{video.title}</h3>
                  <p className="author">{video.pastor}</p>
                  <p className="description">{video.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>
              
              <div className="page-numbers">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <button 
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 FaithStream. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
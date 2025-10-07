import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function HomePage({ userName, onLogout }) {
  const [selectedCategory, setSelectedCategory] = useState("Biblical Movies");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const videosPerPage = 6;
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
      { id: 1, title: "Olukoya - Chapter 1", url: "https://www.youtube.com/embed/AAqm0j1Nqoo", pastor: "Mount Zion Films", description: "In this chapter, Olatunde continues his spiritual journey of faith, obedience, and surrender to God's will. As prophecies unfold and trials deepen, the cost of divine calling becomes clear, but so does God's redeeming power." },
      { id: 2, title: "Olukoya - Chapter 2", url: "https://www.youtube.com/embed/mjRX4mMbLI8", pastor: "Mount Zion Films", description: "The journey continues with deeper challenges and greater revelations of God's power." },
      { id: 3, title: "UNDERSEIGE", url: "https://www.youtube.com/embed/11FQQv81hDw", pastor: "Christian Cinema", description: "A powerful story of spiritual warfare and divine protection." },
      { id: 4, title: "PRAEY", url: "https://www.youtube.com/embed/hsG4HU6cgWY", pastor: "Faith Productions", description: "Experience a thrilling tale of faith, courage, and the supernatural. When four young doctors face an unseen force in a remote village. Are you ready to confront the unknown? Its a faith-base movie" },
      { id: 5, title: "Enoch", url: "https://www.youtube.com/embed/7TxD3cxUQcc", pastor: "Mount Zion Films", description: "A MOVIE BASED ON THE TRUE LIFE STORY OF Pastor EA Adeboye" },
      { id: 6, title: "AYABA", url: "https://www.youtube.com/embed/sFav5yMqfnY", pastor: "Royal Productions", description: "An orphaned maiden rises to become queen, but finds her crown is a cage. Watch the story of Ayaba, the legendary queen who risked everything for her people" },
      { id: 7, title: "BLACK COLLAR 2", url: "https://www.youtube.com/embed/MhiH0ah-3qw", pastor: "Christian Cinema", description: "Continuing the story of faith and redemption in modern ministry" },
      { id: 8, title: "MY PRIVATE LINE TO GOD", url: "https://www.youtube.com/embed/eMuQb0_j7GY", pastor: "Faith Films", description: "A story about personal communication with God through prayer" },
      { id: 9, title: "PROPHET SUDDENLY 1", url: "https://www.youtube.com/embed/QIoUmnSkOXE", pastor: "Mount Zion Films", description: "Unexpected prophecies and divine interventions" },
      { id: 10, title: "WAITING WAR", url: "https://www.youtube.com/embed/JAPOtjg_5Us", pastor: "Family Films", description: "WAITING WARS explores a couple's long journey to parenthood, facing emotional and spiritual challenges. Their faith is tested as they navigate various options and seek guidance. The film portrays their struggles and the support they receive along the way." },
      { id: 11, title: "LET GO LET GOD", url: "https://www.youtube.com/embed/F8IPzpcuPGs", pastor: "Christian Cinema", description: "Starring Clifton Powell, Let Go and Let God follows two people from vastly different worlds whose lives are rocked after experiencing sudden deaths in their family. They question God as a result, but find the faith they're looking for on an unexpected path" },
      { id: 12, title: "TA'AVAH", url: "https://www.youtube.com/embed/RBY9sfQCRvI", pastor: "GACEM TV", description: "TA'AVAH – SAVE THE TEENS is a thought-provoking gospel movie from GACEM TV, telling the story of a father's weakness, a daughter's tears, and God's mercy that restores broken hearts." },
    ],
    "Worship": [
      { id: 1, title: "NAGODE", url: "https://www.youtube.com/embed/LJA_g-_xlCs", pastor: "DUNSIN OYEKAN", description: "Powerful worship song expressing gratitude to God" },
      { id: 2, title: "WORSHIP MEDLEY", url: "https://www.youtube.com/embed/t-wG29TxkEc", pastor: "SIMUSOLA AGBEBEI", description: "Beautiful medley of worship songs" },
      { id: 3, title: "YAHWEH SABAOTH", url: "https://www.youtube.com/embed/5taka1Ftu-E", pastor: "NATHANEIL BASSEY", description: "Worship song celebrating God as the Lord of Hosts" },
      { id: 4, title: "NO ME WITHOUT YOU", url: "https://www.youtube.com/embed/fem4tFkwUEU", pastor: "DUNSIN OYEKAN", description: "Heartfelt song about dependence on God" },
      { id: 5, title: "B'OLA", url: "https://www.youtube.com/embed/a276pMl4udQ", pastor: "SUNMISOLA AGBEBI", description: "Inspirational worship music" },
      { id: 6, title: "FATHER OF SPIRIT", url: "https://www.youtube.com/embed/4N-T2OzVNIU", pastor: "THEOPHILUS SUNDAY", description: "Worship song honoring God the Father" },
      { id: 7, title: "DEEPER EXPERIENCE CHANT", url: "https://www.youtube.com/embed/X8ElWoN0HBE", pastor: "ESTHER JONATHAN", description: "Deep spiritual worship experience" },
      { id: 8, title: "KOSEUNTI", url: "https://www.youtube.com/embed/Dak86UT5G_E", pastor: "SUNMISOLA AGBEBI", description: "Beautiful worship rendition" },
      { id: 9, title: "HAGIAZO", url: "https://www.youtube.com/embed/u3K0QnG0uR8", pastor: "DUNSIN OYEKAN", description: "Powerful worship anthem" },
      { id: 10, title: "EMPEROR OF THE UNIVERSE", url: "https://www.youtube.com/embed/wP1SYyKp7vU", pastor: "DUNSIN OYEKAN FT THEOPHILUS SUNDAY", description: "Majestic worship collaboration" }
    ],
    "Documentaries": [
      { id: 1, title: "Sifting The Evidence I", url: "https://www.youtube.com/embed/17Kq9BsM0jU", pastor: "Biblical Research", description: "Examining archaeological evidence for biblical events" },
      { id: 2, title: "Sifting The Evidence II: Exodus", url: "https://www.youtube.com/embed/H6zJOEzVi3A", pastor: "Biblical Research", description: "Exploring evidence for the Exodus story" },
      { id: 3, title: "OutPouring of the Holyspirit south korea", url: "https://www.youtube.com/embed/jfdgT8LsoW8", pastor: "Global Missions", description: "Documentary about spiritual revival in South Korea" },
      { id: 4, title: "Christian Nationalism", url: "https://www.youtube.com/embed/B-ePCiUgD0Y", pastor: "Theological Studies", description: "Examining the relationship between Christianity and nationalism" },
      { id: 5, title: "Jesus The Historical Facts", url: "https://www.youtube.com/embed/uXw2zYZ1wxk", pastor: "Historical Research", description: "Historical evidence for the life of Jesus" },
      { id: 6, title: "Evolution vs God", url: "https://www.youtube.com/embed/U0u3-2CGOMQ", pastor: "Apologetics Ministry", description: "Examining the evolution vs creation debate" },
      { id: 7, title: "Who Was King Herod", url: "https://www.youtube.com/embed/i_eJqsnPknM", pastor: "Biblical History", description: "Historical documentary about King Herod" },
      { id: 8, title: "Unmasking the fearless the jewish queen", url: "https://www.youtube.com/embed/5HMicy0JD-E", pastor: "Historical Research", description: "Story of Esther, the Jewish queen" }
    ],
    "Christian Living": [
      { id: 1, title: "How God saved me from Addiction", url: "https://www.youtube.com/embed/8GX4l0iAlcw", pastor: "Pastor Femi Lazarus", description: "Powerful testimony of deliverance from addiction" },
      { id: 2, title: "The God Of Restoration", url: "https://www.youtube.com/embed/cOhMuI69Gp8", pastor: "Pastor Femi Lazarus", description: "Teaching about God's restoring power" },
      { id: 3, title: "WE WERE MARRIED FOR ONLY FOUR MONTHS, I ALMOST GOT USED FOR RITUALS.", url: "https://www.youtube.com/embed/tJVSG-lgITw", pastor: "Pastor Femi Lazarus", description: "Testimony of divine protection in marriage" },
      { id: 4, title: "Finally Found Love", url: "https://www.youtube.com/embed/oGkQ-lm39Tc", pastor: "Pastor Femi Lazarus", description: "Story of finding love God's way" },
      { id: 5, title: "The Life Style Wasting Many", url: "https://www.youtube.com/embed/TerYDCsP1ZA", pastor: "Pastor Femi Lazarus", description: "Warning about destructive lifestyles" },
      { id: 6, title: "What is Afro Gospel", url: "https://www.youtube.com/embed/JvbmRofy_aA", pastor: "Pastor Femi Lazarus", description: "Exploring African gospel music and culture" },
      { id: 7, title: "What is Story", url: "https://www.youtube.com/embed/DZFJ8iGDGIk", pastor: "Pastor Femi Lazarus", description: "Understanding the power of storytelling in faith" },
      { id: 8, title: "Victory at Last", url: "https://www.youtube.com/embed/X5mRnO_t9Ec", pastor: "Pastor Femi Lazarus", description: "Testimony of overcoming challenges through faith" }
    ],
    "Christian Anime": [
      { id: 1, title: "Superbook - In the Beginning", url: "https://www.youtube.com/embed/4dzjD5FxJPg", pastor: "Superbook", description: "Animated story of creation from Genesis" },
      { id: 2, title: "The Test I", url: "https://www.youtube.com/embed/UhuSolM_zZg", pastor: "Christian Anime", description: "Animated story of faith testing" },
      { id: 3, title: "The Test II", url: "https://www.youtube.com/embed/UhuSolM_zZg", pastor: "Christian Anime", description: "Continuation of the faith testing story" },
      { id: 4, title: "Let My People go", url: "https://www.youtube.com/embed/Nt4kCgt_Kj4", pastor: "Superbook", description: "Animated story of Moses and the Exodus" },
      { id: 5, title: "The Ten Commandement", url: "https://www.youtube.com/embed/V6QYoWEmXLI", pastor: "Christian Anime", description: "Story of Moses receiving the Ten Commandments" },
      { id: 6, title: "The Giant Adventure", url: "https://www.youtube.com/embed/32_Izk21ktw", pastor: "Superbook", description: "David and Goliath animated story" },
      { id: 7, title: "ROAR", url: "https://www.youtube.com/embed/qBSTCBSlf9Q", pastor: "Christian Anime", description: "Animated story of courage and faith" },
      { id: 8, title: "The First Christmas", url: "https://www.youtube.com/embed/Ty3vrOoWtNM", pastor: "Superbook", description: "Animated nativity story" }
    ]
  };

  const featuredVideos = {
    "Biblical Movies": allVideos["Biblical Movies"][0],
    "Worship": allVideos["Worship"][0],
    "Documentaries": allVideos["Documentaries"][0],
    "Christian Living": allVideos["Christian Living"][0],
    "Christian Anime": allVideos["Christian Anime"][0]
  };

  // Search functionality
  const performSearch = (query) => {
    if (!query.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const lowerCaseQuery = query.toLowerCase().trim();
    
    const results = [];
    
    // Search through all categories
    Object.keys(allVideos).forEach(category => {
      allVideos[category].forEach(video => {
        if (
          video.title.toLowerCase().includes(lowerCaseQuery) ||
          (video.pastor && video.pastor.toLowerCase().includes(lowerCaseQuery)) ||
          (video.description && video.description.toLowerCase().includes(lowerCaseQuery))
        ) {
          results.push({
            ...video,
            category: category
          });
        }
      });
    });

    setSearchResults(results);
  };

  // Handle search input changes with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Get videos to display
  const getVideosToDisplay = () => {
    if (isSearching && searchQuery.trim()) {
      return searchResults;
    }
    return allVideos[selectedCategory] || [];
  };

  // Pagination logic
  const videosToDisplay = getVideosToDisplay();
  const totalPages = Math.ceil(videosToDisplay.length / videosPerPage);
  
  // Get current page videos
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideosPage = videosToDisplay.slice(indexOfFirstVideo, indexOfLastVideo);

  const handleExploreCategory = () => {
    const categorySlug = selectedCategory.toLowerCase().replace(/\s+/g, '-');
    navigate(`/category/${categorySlug}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    }
  };

  const handleVideoClick = (video) => {
    navigate(`/video/${video.id}`, { state: { video } });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (categoryName) => {
    setSelectedCategory(categoryName);
    setCurrentPage(1);
    setIsSearching(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const currentVideo = featuredVideos[selectedCategory];

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">⛪ FaithStream</div>
            
            <div className="header-actions">
              <div className={`search-container ${showSearch ? 'active' : ''}`}>
                <form onSubmit={handleSearch} className="search-form">
                  <input
                    type="text"
                    placeholder="Search videos, pastors, topics..."
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
            <p>
              {isSearching && searchQuery.trim() 
                ? `Found ${searchResults.length} results for "${searchQuery}"` 
                : `Discover ${videosToDisplay.length}+ inspiring Christian videos`
              }
            </p>
          </div>
        </div>
      </section>

      {/* Categories - Hidden when searching */}
      {!isSearching && (
        <section className="categories">
          <div className="container">
            <h2>Choose Category</h2>
            <div className="category-grid">
              {categories.map(category => (
                <div
                  key={category.name}
                  className={`category-card ${selectedCategory === category.name ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(category.name)}
                >
                  <div className="category-icon">{category.icon}</div>
                  <h3>{category.name}</h3>
                  <span className="video-count">{allVideos[category.name]?.length || 0} videos</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Video - Hidden when searching */}
      {!isSearching && (
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
      )}

      {/* Video Grid with Pagination */}
      <section className="recent-videos">
        <div className="container">
          <div className="section-header">
            <h2>
              {isSearching && searchQuery.trim() 
                ? `Search Results for "${searchQuery}"` 
                : `Recent Videos in ${selectedCategory}`
              }
            </h2>
            <span className="page-info">
              Page {currentPage} of {totalPages} • Showing {currentVideosPage.length} of {videosToDisplay.length} videos
            </span>
          </div>
          
          {videosToDisplay.length === 0 ? (
            <div className="no-results">
              <h3>No videos found</h3>
              <p>
                {isSearching && searchQuery.trim() 
                  ? `Try searching with different keywords or browse categories.` 
                  : `There are no videos available in this category.`
                }
              </p>
            </div>
          ) : (
            <>
              <div className="videos-grid">
                {currentVideosPage.map(video => (
                  <div 
                    key={`${video.category}-${video.id}`} 
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
                      {isSearching && (
                        <span className="category-tag">{video.category}</span>
                      )}
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
            </>
          )}
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 FaithStream. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
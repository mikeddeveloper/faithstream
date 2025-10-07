import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

function VideoPlayer({ userName, onLogout }) {
  const { videoId: urlVideoId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const iframeRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const [currentVideo, setCurrentVideo] = useState(location.state?.video);
  const [nextVideo, setNextVideo] = useState(null);
  const [showNextButton, setShowNextButton] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [extractedVideoId, setExtractedVideoId] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progressSaved, setProgressSaved] = useState(false);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [savedProgress, setSavedProgress] = useState(null);

  // Save progress to Firebase
  const saveProgress = async (videoId, currentTime, duration, videoData) => {
    if (!userName || !videoId) return;
    
    try {
      const progressRef = doc(db, "userProgress", userName);
      const progressDoc = await getDoc(progressRef);
      
      const progressData = {
        videoId,
        currentTime,
        duration,
        timestamp: new Date(),
        videoTitle: videoData.title,
        videoUrl: videoData.url,
        pastor: videoData.pastor,
        percentage: duration > 0 ? (currentTime / duration) * 100 : 0
      };

      if (progressDoc.exists()) {
        // Update existing progress
        await setDoc(progressRef, {
          [videoId]: progressData,
          lastUpdated: new Date()
        }, { merge: true });
      } else {
        // Create new progress document
        await setDoc(progressRef, {
          [videoId]: progressData,
          lastUpdated: new Date()
        });
      }
      
      setProgressSaved(true);
      setTimeout(() => setProgressSaved(false), 2000);
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  // Load progress from Firebase
  const loadProgress = async (videoId) => {
    if (!userName || !videoId) return null;
    
    try {
      const progressRef = doc(db, "userProgress", userName);
      const progressDoc = await getDoc(progressRef);
      
      if (progressDoc.exists()) {
        const progressData = progressDoc.data();
        return progressData[videoId] || null;
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    }
    
    return null;
  };

  // Robust YouTube video ID extraction
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    
    try {
      const patterns = [
        /(?:youtube\.com\/embed\/)([^&?\/]+)/,
        /(?:youtu\.be\/)([^&?\/]+)/,
        /(?:youtube\.com\/watch\?v=)([^&?\/]+)/,
        /(?:youtube\.com\/v\/)([^&?\/]+)/
      ];

      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
          return match[1];
        }
      }

      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube') || urlObj.hostname.includes('youtu.be')) {
        if (urlObj.hostname === 'youtu.be') {
          return urlObj.pathname.slice(1);
        }
        return urlObj.searchParams.get('v');
      }

      return null;
    } catch (error) {
      console.error("Error extracting video ID:", error);
      return null;
    }
  };

  // Format time for display
  const formatTime = (seconds) => {
    if (!seconds || seconds === 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle manual progress save
  const handleManualSave = () => {
    if (currentVideo && extractedVideoId && currentTime > 0) {
      saveProgress(extractedVideoId, currentTime, duration, currentVideo);
    }
  };

  // Handle resume from saved position
  const handleResume = () => {
    if (savedProgress && savedProgress.currentTime > 0) {
      setCurrentTime(savedProgress.currentTime);
      // Note: Actual seeking in YouTube requires YouTube API implementation
      setShowResumePrompt(false);
      alert(`Video will resume from ${formatTime(savedProgress.currentTime)}. The seek will happen when the video loads.`);
    }
  };

  // Handle start over
  const handleStartOver = () => {
    setCurrentTime(0);
    setShowResumePrompt(false);
    // Clear saved progress for this video
    if (extractedVideoId && userName) {
      saveProgress(extractedVideoId, 0, duration, currentVideo);
    }
  };

  // Initialize video with progress tracking
  useEffect(() => {
    const initializeVideo = async () => {
      if (!currentVideo) {
        const video = location.state?.video;
        if (video) {
          setCurrentVideo(video);
          findNextVideo(video);
          const videoId = getYouTubeVideoId(video.url);
          setExtractedVideoId(videoId);

          // Load saved progress
          if (videoId && userName) {
            const savedProgressData = await loadProgress(videoId);
            if (savedProgressData && savedProgressData.currentTime > 0) {
              setSavedProgress(savedProgressData);
              setCurrentTime(savedProgressData.currentTime);
              setDuration(savedProgressData.duration);
              
              // Show resume prompt after a short delay
              setTimeout(() => {
                setShowResumePrompt(true);
              }, 1000);
            }
          }
        } else {
          navigate('/');
        }
        return;
      }
    };

    initializeVideo();
  }, [currentVideo, navigate, location, userName]);

  // Track progress periodically
  useEffect(() => {
    if (currentVideo && extractedVideoId && userName) {
      // Clear existing interval
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }

      // Set up progress tracking every 15 seconds
      progressIntervalRef.current = setInterval(() => {
        if (currentTime > 0 && duration > 0) {
          saveProgress(extractedVideoId, currentTime, duration, currentVideo);
        }
      }, 15000);

      return () => {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      };
    }
  }, [currentTime, duration, currentVideo, extractedVideoId, userName]);

  // Save progress when component unmounts
  useEffect(() => {
    return () => {
      if (currentVideo && extractedVideoId && currentTime > 0 && userName) {
        saveProgress(extractedVideoId, currentTime, duration, currentVideo);
      }
    };
  }, [currentVideo, extractedVideoId, currentTime, duration, userName]);

  // Simulate time updates (in a real app, you'd use YouTube API)
  useEffect(() => {
    const simulateTimeUpdate = setInterval(() => {
      if (currentTime < duration) {
        setCurrentTime(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(simulateTimeUpdate);
  }, [currentTime, duration]);

  // Get working download services
  const getDownloadServices = (videoId, format) => {
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const encodedUrl = encodeURIComponent(youtubeUrl);
    
    const services = {
      mp4: [
        {
          name: "SaveFrom.net",
          url: `https://en.savefrom.net/1-youtube-video-downloader/?url=${encodedUrl}`,
          reliability: "High"
        },
        {
          name: "Y2Mate",
          url: `https://www.y2mate.com/youtube/${videoId}`,
          reliability: "Medium"
        },
        {
          name: "OnlineVideoConverter",
          url: `https://www.onlinevideoconverter.com/youtube-converter?url=${encodedUrl}`,
          reliability: "High"
        }
      ],
      mp3: [
        {
          name: "YTMP3",
          url: `https://ytmp3.cc/en13/`,
          reliability: "Medium"
        },
        {
          name: "OnlineVideoConverter",
          url: `https://www.onlinevideoconverter.com/youtube-converter?url=${encodedUrl}`,
          reliability: "High"
        },
        {
          name: "Y2Mate",
          url: `https://www.y2mate.com/youtube/${videoId}`,
          reliability: "Medium"
        }
      ]
    };

    return services[format] || [];
  };

  // Handle download
  const handleDownload = async (format) => {
    setDownloadLoading(true);
    
    try {
      const videoId = getYouTubeVideoId(currentVideo.url);
      
      if (!videoId) {
        alert("❌ Could not extract video ID from this URL. Please use the manual method.");
        return;
      }

      const services = getDownloadServices(videoId, format);
      
      if (services.length > 0) {
        const bestService = services.find(service => service.reliability === "High") || services[0];
        window.open(bestService.url, '_blank', 'noopener,noreferrer');
        
        await copyDownloadInstructionsToClipboard(videoId, format, services);
      } else {
        await copyDownloadInstructionsToClipboard(videoId, format, []);
      }
      
    } catch (error) {
      console.error("Download error:", error);
      alert("Download preparation failed. Please try the manual method.");
    } finally {
      setDownloadLoading(false);
      setShowDownloadOptions(false);
    }
  };

  // Copy comprehensive download instructions
  const copyDownloadInstructionsToClipboard = async (videoId, format, services) => {
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    let servicesList = "No specific services available. Search for 'YouTube to MP4 converter' online.";
    if (services.length > 0) {
      servicesList = services.map(service => 
        `• ${service.name} (${service.reliability} reliability)`
      ).join('\n');
    }
    
    const downloadInstructions = `
📥 DOWNLOAD INSTRUCTIONS for "${currentVideo.title}"

🎬 YouTube Video: ${youtubeUrl}
📁 Preferred Format: ${format.toUpperCase()}
🔑 Video ID: ${videoId}

🏪 RECOMMENDED DOWNLOAD SITES:
${servicesList}

🔧 STEP-BY-STEP GUIDE:
1. Visit one of the recommended sites above
2. Paste this URL: ${youtubeUrl}
3. Select ${format.toUpperCase()} format
4. Choose quality (360p, 720p, 1080p)
5. Click download
6. Save the file to your device

💡 TIPS:
• Use SaveFrom.net for reliable downloads
• If one site doesn't work, try another
• Download during off-peak hours for faster speeds
• Make sure you have enough storage space

⚠️ LEGAL NOTICE:
Please respect copyright laws. Only download content you have permission to use.
Support content creators by watching on official platforms when possible.

Generated by FaithStream App
    `;

    try {
      await navigator.clipboard.writeText(downloadInstructions);
      alert("✅ Download instructions copied to clipboard! \n\nA download site has also been opened in a new tab.");
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = downloadInstructions;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert("✅ Download instructions copied! A download site has been opened.");
    }
  };

  // Get all videos as a flat array
  const getAllVideos = () => {
    const allVideos = {
      "Biblical Movies": [
        { id: 1, title: "Olukoya - Chapter 1", url: "https://www.youtube.com/embed/AAqm0j1Nqoo", pastor: "Mount Zion Films", description: "In this chapter, Olatunde continues his spiritual journey..." },
        { id: 2, title: "Olukoya - Chapter 2", url: "https://www.youtube.com/embed/mjRX4mMbLI8", pastor: "Mount Zion Films", description: "The journey continues with deeper challenges..." },
      ],
    };

    const allVideosList = [];
    Object.keys(allVideos).forEach(category => {
      allVideos[category].forEach(video => {
        allVideosList.push({
          ...video,
          category: category
        });
      });
    });
    return allVideosList;
  };

  // Find the next video
  const findNextVideo = (currentVideo) => {
    const allVideosList = getAllVideos();
    const currentIndex = allVideosList.findIndex(v => 
      v.id === currentVideo.id && v.category === currentVideo.category
    );
    
    if (currentIndex !== -1 && currentIndex < allVideosList.length - 1) {
      setNextVideo(allVideosList[currentIndex + 1]);
    } else {
      setNextVideo(null);
    }
  };

  // Handle download button click
  const handleDownloadClick = () => {
    const videoId = getYouTubeVideoId(currentVideo.url);
    setExtractedVideoId(videoId);
    setShowDownloadOptions(true);
  };

  // Handle video end
  const handleVideoEnd = () => {
    setShowNextButton(true);
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          playNextVideo();
          return 5;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Play next video
  const playNextVideo = () => {
    if (nextVideo) {
      setCurrentVideo(nextVideo);
      setShowNextButton(false);
      setCountdown(5);
      findNextVideo(nextVideo);
      window.history.pushState({}, '', `/video/${nextVideo.id}`);
    }
  };

  // Skip to next video manually
  const handleSkipNext = () => {
    playNextVideo();
  };

  // Stay on current video
  const handleStay = () => {
    setShowNextButton(false);
    setCountdown(5);
  };

  // YouTube message listener
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data === "ended" || event.data.event === "ended") {
        handleVideoEnd();
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [currentVideo, navigate, location]);

  if (!currentVideo) {
    return (
      <div className="video-page">
        <div className="container">
          <div className="error-state">
            <h2>Video not found</h2>
            <p>The video you're looking for doesn't exist.</p>
            <button className="back-btn" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const youtubeVideoId = extractedVideoId;
  const downloadServices = youtubeVideoId ? {
    mp4: getDownloadServices(youtubeVideoId, 'mp4'),
    mp3: getDownloadServices(youtubeVideoId, 'mp3')
  } : { mp4: [], mp3: [] };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="video-page">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <button className="back-btn" onClick={() => navigate(-1)}>
              ← Back
            </button>
            <h1 className="video-title">Now Playing</h1>
            <div className="user-menu">
              <button 
                className="save-progress-btn"
                onClick={handleManualSave}
                title="Save current progress"
                disabled={!userName}
              >
                {progressSaved ? "✅" : "💾"}
              </button>
              <button 
                className="download-btn"
                onClick={handleDownloadClick}
                disabled={downloadLoading}
              >
                {downloadLoading ? "⏳" : "📥"} Download
              </button>
              <span className="username">{userName}</span>
              <button className="logout-btn" onClick={onLogout}>Logout</button>
            </div>
          </div>
        </div>
      </header>

      <main className="player-main">
        <div className="container">
          {/* Progress Tracking Section */}
          {userName && (
            <div className="progress-section">
              <div className="progress-header">
                <span className="progress-text">
                  Your Progress: {formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : 'Loading...'}
                </span>
                <span className="progress-percentage">
                  {Math.round(progressPercentage)}% watched
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="progress-note">
                <small>Progress automatically saved every 15 seconds</small>
              </div>
            </div>
          )}

          {/* Resume Prompt */}
          {showResumePrompt && savedProgress && (
            <div className="resume-prompt">
              <div className="resume-content">
                <h3>🎬 Continue Watching?</h3>
                <p>
                  We found your previous progress from {formatTime(savedProgress.currentTime)}.
                  Would you like to resume from where you left off?
                </p>
                <div className="resume-actions">
                  <button className="resume-btn" onClick={handleResume}>
                    ✅ Resume from {formatTime(savedProgress.currentTime)}
                  </button>
                  <button className="start-over-btn" onClick={handleStartOver}>
                    🔄 Start Over
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="video-container">
            <iframe
              ref={iframeRef}
              src={`${currentVideo.url}?autoplay=1&rel=0${savedProgress ? `&start=${Math.floor(savedProgress.currentTime)}` : ''}`}
              title={currentVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="video-iframe"
            ></iframe>
          </div>
          
          {/* Download Options Modal */}
          {showDownloadOptions && (
            <div className="download-modal">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>Download Options</h3>
                  <button 
                    className="close-btn"
                    onClick={() => setShowDownloadOptions(false)}
                  >
                    ×
                  </button>
                </div>
                
                <div className="video-info-card">
                  <h4>{currentVideo.title}</h4>
                  {youtubeVideoId ? (
                    <>
                      <p className="video-id">YouTube ID: {youtubeVideoId}</p>
                      <p className="video-url">
                        URL: https://youtube.com/watch?v={youtubeVideoId}
                      </p>
                    </>
                  ) : (
                    <p className="video-error">⚠️ Could not extract video ID</p>
                  )}
                </div>

                <div className="download-options">
                  <div className="download-option">
                    <h4>📹 MP4 Video</h4>
                    <p>High quality video file</p>
                    <div className="service-info">
                      {downloadServices.mp4.length > 0 ? (
                        downloadServices.mp4.map((service, index) => (
                          <span key={index} className={`service-tag ${service.reliability.toLowerCase()}`}>
                            {service.name} ({service.reliability})
                          </span>
                        ))
                      ) : (
                        <span className="service-tag unknown">Search online</span>
                      )}
                    </div>
                    <button 
                      className="option-btn mp4-btn"
                      onClick={() => handleDownload('mp4')}
                      disabled={downloadLoading || !youtubeVideoId}
                    >
                      {downloadLoading ? "Opening..." : "Download MP4"}
                    </button>
                  </div>
                  
                  <div className="download-option">
                    <h4>🎵 MP3 Audio</h4>
                    <p>Audio only version</p>
                    <div className="service-info">
                      {downloadServices.mp3.length > 0 ? (
                        downloadServices.mp3.map((service, index) => (
                          <span key={index} className={`service-tag ${service.reliability.toLowerCase()}`}>
                            {service.name} ({service.reliability})
                          </span>
                        ))
                      ) : (
                        <span className="service-tag unknown">Search online</span>
                      )}
                    </div>
                    <button 
                      className="option-btn mp3-btn"
                      onClick={() => handleDownload('mp3')}
                      disabled={downloadLoading || !youtubeVideoId}
                    >
                      {downloadLoading ? "Opening..." : "Download MP3"}
                    </button>
                  </div>
                  
                  <div className="download-option">
                    <h4>🔗 Quick Method</h4>
                    <p>Copy & open manually</p>
                    <button 
                      className="option-btn manual-btn"
                      onClick={() => {
                        if (youtubeVideoId) {
                          const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeVideoId}`;
                          navigator.clipboard.writeText(youtubeUrl);
                          window.open('https://en.savefrom.net/', '_blank');
                          alert("✅ YouTube URL copied! SaveFrom.net opened in new tab.");
                        } else {
                          alert("❌ No video ID available for this URL.");
                        }
                      }}
                      disabled={!youtubeVideoId}
                    >
                      Copy URL + Open SaveFrom
                    </button>
                  </div>
                </div>

                <div className="download-instructions">
                  <h5>💡 How This Works:</h5>
                  <ol>
                    <li>Click your preferred format above</li>
                    <li>We'll open a reliable download site in a new tab</li>
                    <li>Complete the download process on their site</li>
                    <li>Instructions are also copied to your clipboard</li>
                  </ol>
                </div>
                
                <div className="download-disclaimer">
                  <p>⚠️ <strong>Important:</strong> Only download content you have permission to use. Respect copyright laws.</p>
                </div>
              </div>
            </div>
          )}

          {/* Next Video Prompt */}
          {showNextButton && nextVideo && (
            <div className="next-video-prompt">
              <div className="prompt-content">
                <h3>Next Video Starting Soon</h3>
                <p>Up next: <strong>{nextVideo.title}</strong></p>
                <div className="prompt-actions">
                  <button className="skip-btn" onClick={handleSkipNext}>
                    Play Now ({countdown})
                  </button>
                  <button className="stay-btn" onClick={handleStay}>
                    Stay on This Video
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="video-details">
            <div className="video-header">
              <h2 className="info-title">{currentVideo.title}</h2>
              <button 
                className="download-btn-small"
                onClick={handleDownloadClick}
                disabled={downloadLoading}
                title="Download options"
              >
                {downloadLoading ? "⏳" : "📥"}
              </button>
            </div>
            <p className="video-author">{currentVideo.pastor}</p>
            <p className="video-description">{currentVideo.description}</p>
            
            {nextVideo && !showNextButton && (
              <div className="next-preview">
                <h4>Next: {nextVideo.title}</h4>
                <p className="next-author">{nextVideo.pastor}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default VideoPlayer;
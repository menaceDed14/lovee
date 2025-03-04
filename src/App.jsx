import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef, lazy, Suspense } from 'react';
import './App.css';

// Add these animation variants before the App function
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1.5,
      when: "beforeChildren",
      staggerChildren: 0.2
    }
  }
};

function App() {
  const [imagesLoaded, setImagesLoaded] = useState(true); // Change default to true
  const [hasBlownCandles, setHasBlownCandles] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const confettiCanvasRef = useRef(null);
  const controls = useAnimation();
  const audioRef = useRef(null);
  const micRef = useRef(null);

  // Update the scroll handler to account for nav height
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      const navHeight = document.querySelector('.birthday-nav').offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  // For the random pictures of her
  const images = Array.from({ length: 33 }, (_, i) => ({
    id: i + 1,
    src: `/img/bibang (${i + 1}).jpeg`,
    caption: `Photo ${i + 1}`,
    rotation: Math.random() * 10 - 5
  }));

  // Timeline events with actual images
  const timelineEvents = [
    {
      id: 1,
      date: "March 2024",
      title: "When We First Met",
      description: "The beginning of our beautiful story. I still remember how nervous I was talking to you for the first time.",
      image: "/img/bibang (1).jpeg"
    },
    {
      id: 2,
      date: "March-September 2024",
      title: "Getting to Know You",
      description: "Every moment spent together made me fall deeper. Those late night conversations and spontaneous adventures.",
      image: "/img/bibang (7).jpeg"
    },
    {
      id: 3,
      date: "October 2024",
      title: "It's Official! 💑",
      description: "The day we decided to make it official. I've never been happier than when you said yes.",
      image: "/img/bibang (33).jpeg"
    },
    {
      id: 4,
      date: "October 2024 - Present",
      title: "Our Journey Together",
      description: "Creating beautiful memories every day. Each moment with you feels like a blessing.",
      image: "/img/bibang (15).jpeg"
    },
    {
      id: 5,
      date: "Today",
      title: "Happy Birthday!",
      description: "Celebrating you and all the joy you bring to my life. Here's to many more birthdays together!",
      image: "/img/bibang (21).jpeg"
    }
  ];

  // For balloon animations
  const balloonColors = ['#ff4d8d', '#ff69b4', '#ff8fcf', '#ffb6c1', '#ffc0cb'];
  const balloons = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    color: balloonColors[i % balloonColors.length],
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 10,
    duration: 15 + Math.random() * 10
  }));

  useEffect(() => {
    // Remove the setTimeout and simplify the loading logic
    controls.start("visible");
    
    // Show welcome message after a short delay
    const messageTimer = setTimeout(() => {
      setShowMessage(true);
    }, 1000);

    return () => clearTimeout(messageTimer);
  }, [controls]);

  // Preload images
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = images.map((image) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = image.src;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error('Error loading images:', error);
        setImagesLoaded(true); // Still set to true to show content even if some images fail
      }
    };

    preloadImages();
  }, []);

  const handleImageClick = (img) => {
    setSelectedImage(img);
    setShowHearts(true);
    setTimeout(() => setShowHearts(false), 1000);
  };

  const closeImageView = () => {
    setSelectedImage(null);
  };

  return (
    <div className="container" style={{ overflowY: 'auto', height: 'auto', minHeight: '100vh' }}>
      {/* Navigation */}
      <nav className="birthday-nav">
        <ul>
          <li><a href="#intro" onClick={(e) => handleNavClick(e, 'intro')}>Home</a></li>
          <li><a href="#message" onClick={(e) => handleNavClick(e, 'message')}>Birthday Message</a></li>
          <li><a href="#gallery" onClick={(e) => handleNavClick(e, 'gallery')}>Gallery</a></li>
          <li><a href="#timeline" onClick={(e) => handleNavClick(e, 'timeline')}>Our Story</a></li>
        </ul>
      </nav>

      {/* Home Section */}
      <section id="intro" className="home-section">
        <div className="home-overlay"></div>
        <motion.div 
          className="home-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div 
            className="title-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h1 className="main-title">
              <span className="title-line">Happy Birthday</span>
              <span className="title-accent">My Beautiful Angel</span>
            </h1>
          </motion.div>
          
          <motion.div 
            className="name-wrapper"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="name-decoration left"></div>
            <h2 className="name-display">
              <span className="name-prefix">to my dearest</span>
              <span className="name-highlight">Love</span>
            </h2>
            <div className="name-decoration right"></div>
          </motion.div>
          
          <motion.div 
            className="message-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            <p className="love-message">
              <span className="message-line">Every moment with you is a gift,</span>
              <span className="message-line">every smile you share lights up my world.</span>
              <span className="message-line">Today, we celebrate the most precious person in my life.</span>
            </p>
          </motion.div>
          
          <motion.a 
            href="#message" 
            className="home-button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="button-text">Begin Our Journey</span>
            <span className="button-icon">✨</span>
          </motion.a>
        </motion.div>
      </section>

      {/* Message Section */}
      <section id="message" className="message-section">
        <h2 className="section-title">Birthday Message</h2>
        
        <div className="message-content">
          <div className="message-header">
            <span className="message-decoration left">✦</span>
            <h2 className="message-title">Happy Birthday, My Love!</h2>
            <span className="message-decoration right">✦</span>
          </div>
          
          <div className="birthday-message">
            <div className="message-paragraph">
              <span className="message-highlight">Dearest Love,</span>
              <p className="message-text">
                On your special day, I want to take a moment to tell you how much you mean to me. 
                Your smile brightens my darkest days, and your love gives me strength I never knew I had.
              </p>
            </div>
            
            <div className="message-divider">
              <span className="divider-heart">❤️</span>
            </div>
            
            <div className="message-paragraph">
              <p className="message-text">
                Every moment with you is a treasure, and I'm so grateful for all the memories we've created together.
                You are the most amazing person I know - kind, beautiful, and with a heart of gold.
              </p>
            </div>
            
            <div className="message-divider">
              <span className="divider-star">✨</span>
            </div>
            
            <div className="message-paragraph">
              <p className="message-text">
                I hope this birthday brings you all the joy and happiness you deserve.
                I promise to be by your side, celebrating many more birthdays together.
              </p>
            </div>
            
            <div className="message-signature">
              <p className="signature-text">With all my love,</p>
              <p className="signature-name">Forever Yours</p>
              <span className="signature-heart">💝</span>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="gallery-section">
        <h2 className="section-title">ako palangga</h2>        
        <div className="image-grid">
          {images.map((img) => (
            <div 
              key={img.id}
              className="polaroid"
              style={{ '--rotation': `${img.rotation}deg` }}
              onClick={() => handleImageClick(img)}
            >
              <img src={img.src} alt={img.caption} />
              <div className="polaroid-caption">{img.caption}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="timeline-section">
        <h2 className="section-title">Our Story So Far</h2>        
        <div className="timeline">
          {timelineEvents.map((event) => (
            <div key={event.id} className="timeline-event">
              <span className="timeline-date">{event.date}</span>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              {event.image && <img src={event.image} alt={event.title} className="timeline-image" />}
            </div>
          ))}
          <div style={{ clear: 'both', display: 'table', content: '""' }}></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="birthday-footer">
        <div className="footer-content">
          <div className="footer-message">
            Happy Birthday, My Love! ❤️
          </div>
          <p className="footer-submessage">
            Thank you for being the most amazing person in my life.
            Every moment with you is a gift I cherish deeply.
          </p>
          <a 
            href="#intro" 
            className="back-to-top"
            onClick={(e) => handleNavClick(e, 'intro')}
          >
            <span>↑</span> Back to Top
          </a>
        </div>
        <div className="footer-hearts">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="footer-heart"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${4 + Math.random() * 2}s`
              }}
            >
              ❤️
            </span>
          ))}
        </div>
      </footer>

      {/* Fullscreen Image View */}
      <AnimatePresence>
        {selectedImage && (
          <div 
            className="formal-image-view"
            onClick={closeImageView}
            style={{ position: 'fixed', overflow: 'hidden' }}
          >
            <div 
              className="formal-image-container"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="formal-image-header">
                <h3>Photo {selectedImage.id} of {images.length}</h3>
                <button className="formal-close-button" onClick={closeImageView}>
                  <span>×</span>
                </button>
              </div>
              <div className="formal-image-wrapper">
                <img 
                  src={selectedImage.src} 
                  alt={`Photo ${selectedImage.id}`}
                />
              </div>
              <div className="formal-image-footer">
                <p>{selectedImage.caption || "Beautiful memories we've shared together"}</p>
                <div className="formal-image-navigation">
                  <button 
                    className="nav-button prev-button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      const prevId = selectedImage.id > 1 ? selectedImage.id - 1 : images.length;
                      const prevImage = images.find(img => img.id === prevId);
                      setSelectedImage(prevImage);
                    }}
                  >
                    <span className="nav-icon">❮</span> Previous
                  </button>
                  <div className="image-counter">{selectedImage.id} / {images.length}</div>
                  <button 
                    className="nav-button next-button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      const nextId = selectedImage.id < images.length ? selectedImage.id + 1 : 1;
                      const nextImage = images.find(img => img.id === nextId);
                      setSelectedImage(nextImage);
                    }}
                  >
                    Next <span className="nav-icon">❯</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Welcome Message */}
      <AnimatePresence>
        {showMessage && (
          <motion.div 
            className="welcome-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="welcome-content"
              initial={{ scale: 0.8, y: 30, opacity: 0 }}
              animate={{ 
                scale: 1, 
                y: 0, 
                opacity: 1,
                transition: {
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }
              }}
              exit={{ 
                scale: 0.8,
                opacity: 0,
                transition: { duration: 0.3 }
              }}
            >
              <motion.h3
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                hi boktam
              </motion.h3>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                jejemon pero bahala na ahhahaha tuploka na lang
              </motion.p>
              <motion.button 
                onClick={() => setShowMessage(false)}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Let's Celebrate!
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Hearts */}
      {showHearts && (
        <div className="floating-hearts">
          {Array.from({ length: 30 }).map((_, i) => (
            <div 
              key={i} 
              className="heart"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                fontSize: `${1 + Math.random() * 2}rem`
              }}
            >
              {['❤️', '💕', '💖', '💗', '💘', '💓'][Math.floor(Math.random() * 6)]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;

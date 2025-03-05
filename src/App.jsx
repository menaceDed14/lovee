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

// Replace the existing timelineVariants with these new variants
const timelineLeftVariants = {
  hidden: { 
    x: -100,
    opacity: 0
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 15,
      duration: 1
    }
  }
};

const timelineRightVariants = {
  hidden: { 
    x: 100,
    opacity: 0
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 15,
      duration: 1
    }
  }
};

const timelineContentVariants = {
  hidden: { 
    y: 20,
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.8
    }
  }
};

// Add these nav animation variants after the other variants
const navVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      staggerChildren: 0.1
    }
  }
};

const navItemVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
};

function App() {
  const [imagesLoaded, setImagesLoaded] = useState(false);
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
      description: "We were classmates in Environmental Science, hahaha! That was our first face-to-face class, and you were the first one in the room. Luckily, we ended up as group mates for our reporting, which made everything even more exciting. Then, during our second meeting, when it was time to present, you borrowed my laptop to study because you hadn’t prepared, hahaha! The entire month of March, every Saturday, was both challenging and exciting because it was the day I got to see you. No matter how hectic things were, those moments made everything worthwhile.",
      image: "/img/crisnie.jpg"
    },
    {
      id: 2,
      date: "March-September 2024",
      title: "Getting to Know You",
      description: "Every moment we spent together deepened my feelings for you—those late-night conversations and spontaneous adventures became memories I will always cherish. We both understood that spending time together and dating back then was not the right thing to do, and we both know why. Yet, despite the challenges and hardships, our love endured and led us to where we are today. It was not an easy journey, and it came with its share of pain, but in the end, it was all worth it. Now, I sincerely hope that we have overcome the past and can finally embrace a future filled with happiness, love, and unwavering commitment. May we continue to build a strong and lasting relationship, cherishing every moment and growing together for years to come.",
      image: "/img/crisnie1.jpg"
    },
    {
      id: 3,
      date: "October 18, 2024",
      title: "It's Official! 💑",
      description: "The day you said yes and made our relationship official was one of the happiest moments of my life. I could hardly believe it—we were finally together. For months, we had already been acting as a couple, but hearing you affirm it made everything feel truly real. It was a moment of joy and certainty that I will always treasure.",
      image: "/img/crisnie2.jpeg"
    },
    {
      id: 4,
      date: "October 2024 - Present",
      title: "Our Journey Together",
      description: "Each moment with you is a blessing, and every day we create beautiful memories together. Our journey hasn’t been easy—we’ve had our fair share of disagreements, from small, petty arguments to challenges that tested our patience, understanding, and love for each other. There were times when we struggled to see eye to eye, moments when our differences felt too great to overcome, and days when we questioned whether we were strong enough to keep going. But despite the misunderstandings, the frustrations, and the hardships, we always found our way back to each other. We chose to listen, to compromise, and to grow—not just as individuals but as partners. No relationship is perfect, and we are no exception, but what makes ours special is that we never stop trying. We keep learning, we keep fighting, and we keep choosing each other, no matter how difficult things get. And I hope that no matter what lies ahead, we will continue to hold on, to fight for what we have, and to cherish every moment—until there is nothing left to fight for, and all that remains is the love we have built together.",
      image: "/img/crisnie3.jpeg"
    },
    {
      id: 5,
      date: "March 1, 2025",
      title: "Happy Birthday!",
      description: "Today, I celebrate you and the incredible joy you bring into my life. Your presence has been a blessing, and I am grateful for every moment we share. As we mark this special day, I look forward to celebrating many more birthdays together, creating lasting memories filled with love and happiness. Happy birthday! Never stop learning, growing, and chasing your dream of becoming a lawyer. Your determination and passion inspire me, and I have no doubt that you will achieve everything you set your heart on. No matter what challenges come your way, I will always be here to support you, encourage you, and stand by your side. I love you!",
      image: "/img/bibang (28).jpeg"
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
      <motion.nav 
        className="birthday-nav"
        initial="hidden"
        animate="visible"
        variants={navVariants}
      >
        <div className="nav-container">
          <motion.ul className="nav-links">
            {[
              { href: '#intro', text: 'Home' },
              { href: '#message', text: 'Birthday Message' },
              { href: '#gallery', text: 'Gallery' },
              { href: '#timeline', text: 'Our Story' }
            ].map((link, index) => (
              <motion.li 
                key={link.href}
                variants={navItemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a 
                  href={link.href} 
                  onClick={(e) => handleNavClick(e, link.href.substring(1))}
                  className="nav-link"
                >
                  {link.text}
                </a>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </motion.nav>

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
              <span className="title-accent">Arnie Lou Gabuya</span>
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
              <span className="name-prefix">to my dearest palangga</span>
              <span className="name-highlight">bibang</span>
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
              <span className="message-line">Cringe kaayo love ahhahahah,</span>
              <span className="message-line">Pero inani najud ko ka buang saimo huhu goodness,</span>
              <span className="message-line">Wala ko kabalo asa mag start haha basaha nlang lageeee hahahah.</span>
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
            <span className="button-text">Tuploka ni bok</span>
            <span className="button-icon">✨</span>
          </motion.a>
        </motion.div>
      </section>

      {/* Message Section */}
      <section id="message" className="message-section">
        <h2 className="section-title">Ge chatgpt ra nako ni ha, char!</h2>
        
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
              On your special day, I just want to take a moment to express how much you truly mean to me. 
              This is our first birthday together, and I wish I could make it as extraordinary as you deserve. 
              I’m sorry if I can’t do as much as I’d like, but please know that my love, appreciation, and gratitude for you are endless. 
              No matter what, I hope this day brings you happiness, because you deserve nothing less.
              </p>
            </div>
            
            <div className="message-divider">
              <span className="divider-heart">❤️</span>
            </div>
            
            <div className="message-paragraph">
              <p className="message-text">
              Every moment with you is a cherished treasure, and I am deeply grateful for the memories we have created together. 
              Our first trip to Davao was truly unforgettable, and I appreciated every experience we shared. 
              I am also thankful for the safe journey we had—it made our adventure even more meaningful. 
              One of my favorite moments was the early mornings on the bus, with the gentle sound of rain creating a serene atmosphere. 
              Yet, what made it most comforting was having you by my side. 
              Traveling with you is a joy, and I look forward to many more journeys together.
              </p>
            </div>
            
            <div className="message-divider">
              <span className="divider-star">✨</span>
            </div>
            
            <div className="message-paragraph">
              <p className="message-text">
              I hope this birthday brings you all the joy, love, and happiness you truly deserve. 
              You are an incredible person, and I feel so blessed to share this special day with you. 
              From the moment we started hanging out and dating, I’ve come to deeply appreciate your whole existence—you bring so much light and warmth into my life. 
              Beyond that, you have taught me valuable lessons that have helped me grow, not just in our relationship but also as a person. 
              Your kindness, strength, and perspective inspire me every day. No matter what, 
              I will always be on your side, supporting you, cheering you on, and cherishing every moment we share. 
              I look forward to celebrating many more birthdays together, creating beautiful memories, and growing side by side.
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
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 0.8 
          }}
        >
          Our Story So Far
        </motion.h2>        
        <div className="timeline">
          {timelineEvents.map((event, index) => (
            <motion.div 
              key={event.id} 
              className={`timeline-event ${index % 2 === 0 ? 'left' : 'right'}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={index % 2 === 0 ? timelineLeftVariants : timelineRightVariants}
              custom={index}
            >
              <motion.div
                className="timeline-content"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={timelineContentVariants}
                transition={{ 
                  delay: 0.2,
                  staggerChildren: 0.1 
                }}
              >
                <motion.span 
                  className="timeline-date"
                  variants={timelineContentVariants}
                >
                  {event.date}
                </motion.span>
                <motion.h3
                  variants={timelineContentVariants}
                >
                  {event.title}
                </motion.h3>
                <motion.p
                  variants={timelineContentVariants}
                >
                  {event.description}
                </motion.p>
                {event.image && (
                  <motion.img 
                    src={event.image} 
                    alt={event.title} 
                    className="timeline-image"
                    variants={timelineContentVariants}
                    whileHover={{ 
                      scale: 1.05,
                      transition: { 
                        type: "spring",
                        stiffness: 300,
                        damping: 20 
                      }
                    }}
                  />
                )}
              </motion.div>
            </motion.div>
          ))}
          <div style={{ clear: 'both', display: 'table', content: '""' }}></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="birthday-footer">
        <div className="footer-content">
          <div className="footer-message">
            Thank You, Love
          </div>
          <p className="footer-submessage">
            I love you always akoa palangga ha mwua
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
                jejemon love huhu pwede mag bisaya nlang? hahaa love u
              </motion.p>
              <motion.button 
                onClick={() => setShowMessage(false)}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start
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

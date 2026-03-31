import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { 
  FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaArrowDown, 
  FaCode, FaReact, FaNodeJs, FaPython, FaDatabase, FaStar,
  FaBriefcase, FaUsers, FaRocket
} from 'react-icons/fa';
import './Hero.css';
import profileImage from '../../assets/images/IMAGE.png';

const Hero = () => {
  const [typedText, setTypedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const roles = [
    'Full Stack Developer',
    'React Specialist',
    'Node.js Expert',
    'UI/UX Enthusiast',
    'Problem Solver'
  ];

  // const techStack = [
  //   { name: 'React', icon: FaReact, color: '#61DAFB' },
  //   { name: 'Node.js', icon: FaNodeJs, color: '#339933' },
  //   { name: 'JavaScript', icon: FaCode, color: '#F7DF1E' },
  //   { name: 'TypeScript', icon: FaCode, color: '#3178C6' },
  //   { name: 'Python', icon: FaPython, color: '#3776AB' },
  //   { name: 'MongoDB', icon: FaDatabase, color: '#47A248' }
  // ];

  // Typing animation effect
  useEffect(() => {
    const currentRole = roles[textIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentRole.length) {
          setTypedText(currentRole.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (charIndex > 0) {
          setTypedText(currentRole.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          setIsDeleting(false);
          setTextIndex((textIndex + 1) % roles.length);
        }
      }
    }, isDeleting ? 50 : 100);
    
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex]);

  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const downloadCV = () => {
    const link = document.createElement('a');
    link.href = '/path-to-your-cv.pdf';
    link.download = 'Haymanot-CV.pdf';
    link.click();
  };

  return (
    <section id="home" className="hero-page">
      <div className="hero-container">
        <div className="hero-content">
          {/* Left Side - Text Content */}
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* <motion.div 
              className="hero-greeting"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="greeting-text">Welcome to my portfolio</span>
              <div className="greeting-line"></div>
            </motion.div> */}
            
            <h1 className="hero-title">
              Hi, I'm <span className="highlight">Haymanot</span>
            </h1>
            
            <h2 className="hero-subtitle">
              <span className="typed-text">{typedText}</span>
              <span className="cursor">|</span>
            </h2>
            
            <p className="hero-description">
              I create modern, responsive web applications using React, Node.js, 
              and cutting-edge technologies. Passionate about building scalable 
              solutions and exceptional user experiences.
            </p>
            
            <div className="hero-stats">
              <div className="stat">
                <FaBriefcase className="stat-icon" />
                <div className="stat-info">
                  <span className="stat-number">1+</span>
                  <span className="stat-label">Years Experience</span>
                </div>
              </div>
              <div className="stat">
                <FaCode className="stat-icon" />
                <div className="stat-info">
                  <span className="stat-number">5+</span>
                  <span className="stat-label">Projects</span>
                </div>
              </div>
              <div className="stat">
                <FaUsers className="stat-icon" />
                <div className="stat-info">
                  <span className="stat-number">2+</span>
                  <span className="stat-label">Clients</span>
                </div>
              </div>
              <div className="stat">
                <FaRocket className="stat-icon" />
                <div className="stat-info">
                  <span className="stat-number">10+</span>
                  <span className="stat-label">Technologies</span>
                </div>
              </div>
            </div>
            
            <div className="hero-buttons">
              <motion.button 
                className="btn primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToProjects}
              >
                View Projects
                <FaArrowDown className="btn-icon" />
              </motion.button>
              <motion.button 
                className="btn secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadCV}
              >
                Download CV
              </motion.button>
            </div>
    
          </motion.div>
          
          {/* Right Side - Profile Image */}
          <motion.div
            className="hero-image"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="image-wrapper">
              <div className="image-placeholder">
                <img 
                  src={profileImage}
                  alt="Haymanot"
                  className="profile-image"
                />
              </div>
              {/* <div className="experience-badge">
                <FaStar className="badge-icon" />
                <div className="badge-text">
                  <span className="years">1+</span>
                  <span className="label">Years Experience</span>
                </div>
              </div> */}
            </div>
          </motion.div>
        </div>

        {/* Tech Stack Floating Items */}
        {/* <div className="tech-stack">
          {techStack.map((tech, index) => {
            const Icon = tech.icon;
            return (
              <motion.div
                key={tech.name}
                className="tech-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -10, scale: 1.05 }}
              >
                <Icon style={{ color: tech.color }} />
                <span>{tech.name}</span>
              </motion.div>
            );
          })}
        </div> */}

        {/* Scroll Indicator */}
        {/* <motion.div 
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          whileHover={{ y: 5 }}
          onClick={scrollToProjects}
        >
          <span>Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <FaArrowDown />
          </motion.div>
        </motion.div> */}
      </div>
    </section>
  );
};

export default Hero;
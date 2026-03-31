import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import './About.css';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const stats = [
    { number: '5+', label: 'Years Experience' },
    { number: '50+', label: 'Projects Completed' },
    { number: '25+', label: 'Happy Clients' },
    { number: '15+', label: 'Technologies' }
  ];

  const interests = [
    { icon: '💻', name: 'Open Source' },
    { icon: '📱', name: 'Mobile Apps' },
    { icon: '🎨', name: 'UI/UX Design' },
    { icon: '🚀', name: 'Performance' },
    { icon: '🔒', name: 'Security' },
    { icon: '☁️', name: 'Cloud Tech' }
  ];

  const certifications = [
    { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services' },
    { name: 'Meta Backend Developer Professional', issuer: 'Meta' },
    { name: 'Google Project Management Certificate', issuer: 'Google' }
  ];

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section id="about" className="about-page">
          <motion.div
            className="about-container"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Header Section */}
            <motion.div className="about-header" variants={itemVariants}>
              <h2 className="section-title">About Me</h2>
              <p className="section-subtitle">
                Passionate developer crafting digital experiences that make a difference
              </p>
            </motion.div>

            <div className="about-content">
              {/* Main Content */}
              <div className="about-main">
                <motion.div className="bio-section" variants={itemVariants}>
                  <h3>My Journey</h3>
                  <p>
                    I'm a passionate Full Stack Developer with over 5 years of experience 
                    creating digital solutions that solve real-world problems. My journey 
                    began with curiosity about how websites work, and it has evolved into 
                    a career dedicated to building innovative, user-centered applications.
                  </p>
                  <p>
                    I believe in writing clean, maintainable code and creating experiences 
                    that are not only functional but also delightful to use. Every project 
                    is an opportunity to learn, grow, and push the boundaries of what's possible.
                  </p>
                  <p>
                    When I'm not coding, you'll find me exploring new technologies, 
                    contributing to open-source projects, or sharing knowledge through 
                    blog posts and tutorials. I believe in continuous learning and 
                    staying updated with industry trends.
                  </p>
                </motion.div>

                {/* Experience & Specialties */}
                <div className="details-grid">
                  <motion.div className="detail-card" variants={itemVariants}>
                    <h4>💼 Work Experience</h4>
                    <div className="experience-item">
                      <h5>Senior Full Stack Developer</h5>
                      <p className="company">Tech Corp | 2022 - Present</p>
                      <p>Lead development of multiple React applications, mentored junior developers, and implemented best practices for code quality and performance.</p>
                    </div>
                    <div className="experience-item">
                      <h5>Full Stack Developer</h5>
                      <p className="company">StartUp Inc | 2019 - 2022</p>
                      <p>Developed and maintained full-stack applications using MERN stack, implemented RESTful APIs, and optimized database queries.</p>
                    </div>
                  </motion.div>

                  <motion.div className="detail-card" variants={itemVariants}>
                    <h4>🎯 Skills & Expertise</h4>
                    <ul>
                      <li><strong>Frontend:</strong> React, Vue.js, TypeScript, TailwindCSS, Redux</li>
                      <li><strong>Backend:</strong> Node.js, Express, Python, Django</li>
                      <li><strong>Database:</strong> MongoDB, PostgreSQL, MySQL, Redis</li>
                      <li><strong>DevOps:</strong> Docker, AWS, CI/CD, Git</li>
                      <li><strong>Testing:</strong> Jest, React Testing Library, Cypress</li>
                    </ul>
                  </motion.div>
                </div>

               

                {/* Currently Learning */}
                {/* <motion.div className="learning-section" variants={itemVariants}>
                  <h4>📚 Currently Learning & Exploring</h4>
                  <div className="learning-tags">
                    <span className="learning-tag">Next.js 14</span>
                    <span className="learning-tag">GraphQL</span>
                    <span className="learning-tag">Web3 Development</span>
                    <span className="learning-tag">Machine Learning</span>
                    <span className="learning-tag">DevOps</span>
                    <span className="learning-tag">Kubernetes</span>
                  </div>
                </motion.div> */}
               </div>

              {/* Sidebar with Stats & Interests */}
              <motion.div className="about-sidebar" variants={itemVariants}>
                {/* Stats */}
                <div className="stats-grid">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      className="stat-item"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <h3>{stat.number}</h3>
                      <p>{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Certifications */}
                <div className="certifications-section">
                  <h4>📜 Certifications</h4>
                  <div className="certifications-list">
                    {certifications.map((cert, index) => (
                      <motion.div
                        key={index}
                        className="cert-item"
                        whileHover={{ x: 5 }}
                      >
                        <span className="cert-icon">🏆</span>
                        <div>
                          <h5>{cert.name}</h5>
                          <p>{cert.issuer}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div className="interests-section">
                  <h4>✨ Interests & Passions</h4>
                  <div className="interests-grid">
                    {interests.map((interest, index) => (
                      <motion.div
                        key={interest.name}
                        className="interest-item"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="interest-icon">{interest.icon}</span>
                        <span>{interest.name}</span>
                      </motion.div>
                    ))}
                  </div>
                   {/* Education */}
                   <br />

                  <br />
                <motion.div className="detail-card education-card" variants={itemVariants}>
                  <h4>🎓 Education</h4>
                  <div className="education-item">
                    <h5>Bachelor of Science in Computer Science</h5>
                    <p className="institution">University of Technology | 2015 - 2019</p>
                    <p>Graduated with honors, specialized in web development and software engineering.</p>
                  </div>
                </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Call to Action */}
            <motion.div 
              className="about-cta"
              variants={itemVariants}
            >
              <p>Interested in working together? I'd love to hear about your project!</p>
              <motion.a 
                href="/contact"
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Let's Connect
              </motion.a>
            </motion.div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default About;

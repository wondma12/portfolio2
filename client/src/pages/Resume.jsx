import React from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaBriefcase, FaGraduationCap, FaCode, FaAward, FaCertificate, FaStar } from 'react-icons/fa';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import './Resume.css';

const Resume = () => {
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

  const workExperience = [
    {
      title: 'Full Stack Developer',
      company: 'Tech Corp',
      period: '25025 - Present',
      description: 'Lead development of multiple React applications, mentored junior developers, and implemented best practices for code quality and performance.',
      achievements: [
        'Increased application performance by 40% through code optimization',
        'Led a team of 5 developers in building a large-scale e-commerce platform',
        'Implemented CI/CD pipeline reducing deployment time by 60%'
      ]
    },
    {
      title: 'Full Stack Developer',
      company: 'StartUp Inc',
      period: '2024',
      description: 'Developed and maintained full-stack applications using MERN stack, implemented RESTful APIs, and optimized database queries.',
      achievements: [
        'Built and launched 5 successful web applications',
        'Reduced API response time by 50% through database optimization',
        'Implemented real-time features using Socket.io'
      ]
    },
    {
      title: 'Web Developer',
      company: 'Web Solutions',
      period: '2024 - 2026',
      description: 'Assisted in developing client websites and maintaining existing applications.',
      achievements: [
        'Created responsive websites for 10+ clients',
        'Improved SEO rankings by 30% for client websites',
        'Implemented accessibility features meeting WCAG 2.1 standards'
      ]
    }
  ];
  
  const education = [
    {
      degree: 'Bachelor of Science in Software Engineering',
      institution: 'Injibara University',
      period: '2020 - 2026',
      description: 'specialized in web development and software engineering.',
      courses: ['Data Structures', 'Algorithms', 'Web Development', 'Database Design']
    },
    {
      degree: 'Full Stack Web Development Certificate',
      institution: 'Coding Bootcamp',
      period: '2024 - 2025',
      description: 'Intensive 12-week program focused on MERN stack development.',
      courses: ['React', 'Node.js', 'MongoDB', 'Express']
    }
  ];
  
  const skills = [
    { category: 'Frontend', items: ['React', 'Vue.js', 'TypeScript', 'TailwindCSS', 'Redux', 'Next.js'] },
    { category: 'Backend', items: ['Node.js', 'Express', 'Python', 'Django', 'RESTful APIs', 'GraphQL'] },
    { category: 'Database', items: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase'] },
    { category: 'DevOps', items: ['Docker', 'AWS', 'CI/CD', 'Git', 'Linux'] }
  ];

  const certifications = [
    { name: 'udacity Artificial Intelligence certificate', issuer: 'Amazon Web Services', date: '2026' },
    { name: 'cisco networking academy certificate', issuer: 'networking', date: '2026' },
    { name: 'E-Learning Certificate', issuer: 'Google', date: '2025' }
  ];

  const stats = [
    { value: '1+', label: 'Years Experience', icon: FaBriefcase },
    { value: '5+', label: 'Projects Completed', icon: FaCode },
    { value: '2+', label: 'Happy Clients', icon: FaStar },
    { value: '10+', label: 'Certifications', icon: FaCertificate }
  ];

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section id="resume" className="resume-page">
          <motion.div
            className="resume-container"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Header Section */}
            <motion.div className="resume-header" variants={itemVariants}>
              <div className="header-content">
                <h1 className="section-title">My Resume</h1>
                <p className="section-subtitle">
                  A comprehensive overview of my professional journey, skills, and achievements
                </p>
                <motion.button 
                  className="download-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => alert('PDF download feature coming soon!')}
                >
                  <FaDownload className="btn-icon" />
                  Download PDF Resume
                </motion.button>
              </div>
            </motion.div>

            {/* Stats Section */}
            <motion.div className="stats-section" variants={itemVariants}>
              <div className="stats-grid">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      className="stat-card"
                      whileHover={{ scale: 1.05, y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon className="stat-icon" />
                      <h3>{stat.value}</h3>
                      <p>{stat.label}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Professional Summary */}
            <motion.div className="summary-section" variants={itemVariants}>
              <h2>Professional Summary</h2>
              <p>
                Results-driven Full Stack Developer with 1+ years of experience building scalable web applications. 
                Passionate about creating elegant solutions to complex problems and delivering high-quality software. 
                Strong background in both frontend and backend technologies with a focus on performance and user experience.
              </p>
            </motion.div>

            {/* Work Experience */}
            <motion.div className="experience-section" variants={itemVariants}>
              <h2>
                <FaBriefcase className="section-icon" />
                Work Experience
              </h2>
              <div className="timeline">
                {workExperience.map((job, index) => (
                  <motion.div
                    key={index}
                    className="timeline-item"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <div>
                          <h3>{job.title}</h3>
                          <p className="company">{job.company}</p>
                        </div>
                        <span className="period">{job.period}</span>
                      </div>
                      <p className="description">{job.description}</p>
                      <ul className="achievements-list">
                        {job.achievements.map((achievement, i) => (
                          <li key={i}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Education & Certifications Grid */}
            <div className="education-certifications-grid">
              {/* Education Section */}
              <motion.div className="education-section" variants={itemVariants}>
                <h2>
                  <FaGraduationCap className="section-icon" />
                  Education
                </h2>
                <div className="education-list">
                  {education.map((edu, index) => (
                    <motion.div
                      key={index}
                      className="education-card"
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="education-header">
                        <h3>{edu.degree}</h3>
                        <span className="period">{edu.period}</span>
                      </div>
                      <p className="institution">{edu.institution}</p>
                      <p className="description">{edu.description}</p>
                      <div className="courses">
                        {edu.courses.map((course, i) => (
                          <span key={i} className="course-tag">{course}</span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Certifications Section */}
              <motion.div className="certifications-section" variants={itemVariants}>
                <h2>
                  <FaAward className="section-icon" />
                  Certifications
                </h2>
                <div className="certifications-list">
                  {certifications.map((cert, index) => (
                    <motion.div
                      key={index}
                      className="certification-card"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="cert-icon">🏆</div>
                      <div className="cert-info">
                        <h3>{cert.name}</h3>
                        <p>{cert.issuer}</p>
                        <span className="cert-date">{cert.date}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Skills Section */}
            <motion.div className="skills-section" variants={itemVariants}>
              <h2>
                <FaCode className="section-icon" />
                Technical Skills
              </h2>
              <div className="skills-grid">
                {skills.map((skillGroup, index) => (
                  <motion.div
                    key={index}
                    className="skill-category"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <h3>{skillGroup.category}</h3>
                    <div className="skill-tags">
                      {skillGroup.items.map((skill, i) => (
                        <motion.span
                          key={i}
                          className="skill-tag"
                          whileHover={{ scale: 1.05, y: -2 }}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Resume;
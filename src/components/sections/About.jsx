import React from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaLaptopCode, FaMobile, FaDatabase } from 'react-icons/fa';

const About = () => {
  const features = [
    { icon: FaCode, title: "Clean Code", description: "Writing maintainable, scalable, and well-documented code" },
    { icon: FaLaptopCode, title: "Responsive Design", description: "Creating seamless experiences across all devices" },
    { icon: FaMobile, title: "Mobile First", description: "Designing for mobile devices first, then scaling up" },
    { icon: FaDatabase, title: "Full Stack", description: "End-to-end development from frontend to backend" }
  ];

  return (
    <section id="about" className="about">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="about-header"
        >
          <h2 className="section-title">About Me</h2>
          <p className="section-subtitle">Get to know me better</p>
        </motion.div>
        
        <div className="about-content">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="about-text"
          >
            <h3>Who am I?</h3>
            <p>
              I'm a passionate Full Stack Developer with over 5 years of experience in building 
              web applications. I specialize in React, Node.js, and modern JavaScript technologies.
            </p>
            <p>
              My journey in web development started when I built my first website in college. 
              Since then, I've worked with various startups and companies, helping them bring 
              their ideas to life through code.
            </p>
            <p>
              I believe in writing clean, maintainable code and creating user experiences that 
              are both beautiful and functional. When I'm not coding, you can find me reading 
              tech blogs, contributing to open source, or exploring new technologies.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="about-features"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="feature-card">
                  <Icon className="feature-icon" />
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
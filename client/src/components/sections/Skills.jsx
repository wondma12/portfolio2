import React from 'react';
import { motion } from 'framer-motion';
import { FaReact, FaNodeJs, FaPython, FaDatabase, FaGitAlt, FaAws } from 'react-icons/fa';
import { SiTypescript, SiTailwindcss, SiMongodb, SiExpress } from 'react-icons/si';
import './Skills.css';

const Skills = () => {
  const skills = [
    { name: 'React', icon: FaReact, color: '#61DAFB', level: 90 },
    { name: 'Node.js', icon: FaNodeJs, color: '#339933', level: 85 },
    { name: 'TypeScript', icon: SiTypescript, color: '#3178C6', level: 80 },
    { name: 'Python', icon: FaPython, color: '#3776AB', level: 75 },
    { name: 'MongoDB', icon: SiMongodb, color: '#47A248', level: 85 },
    { name: 'Express', icon: SiExpress, color: '#000000', level: 85 },
    { name: 'TailwindCSS', icon: SiTailwindcss, color: '#06B6D4', level: 90 },
    { name: 'Git', icon: FaGitAlt, color: '#F05032', level: 85 },
    { name: 'AWS', icon: FaAws, color: '#FF9900', level: 70 },
    { name: 'MySQL', icon: FaDatabase, color: '#4479A1', level: 80 }
  ];

  return (
    <section id="skills" className="skills-page">
      <div className="skills-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="skills-header"
        >
          <h2 className="section-title">Skills & Technologies</h2>
          <p className="section-subtitle">Technologies I work with</p>
        </motion.div>
        
        <div className="skills-grid">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="skill-card"
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Icon className="skill-icon" style={{ color: skill.color }} />
                <h3 className="skill-name">{skill.name}</h3>
                <div className="skill-bar">
                  <motion.div
                    className="skill-progress"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    viewport={{ once: true }}
                    style={{ backgroundColor: skill.color }}
                  />
                </div>
                <span className="skill-percentage">{skill.level}%</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
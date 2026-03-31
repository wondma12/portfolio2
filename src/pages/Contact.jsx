import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../services/api';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormMessage({ type: '', text: '' });

    try {
      await api.post('/contact', formData);
      setFormMessage({ 
        type: 'success', 
        text: 'Message sent successfully! I\'ll get back to you soon.' 
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      toast.success('Message sent successfully!');
    } catch (error) {
      setFormMessage({ 
        type: 'error', 
        text: 'Failed to send message. Please try again or contact me directly via email.' 
      });
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: '📧',
      title: 'Email',
      info: 'haymanotwondmagegn3@gmail.com',
      link: 'mailto:haymanotwondmagegn3@gmail.com', // Fixed: changed from 'haym:' to 'mailto:'
      color: '#18b8c8'
    },
    {
      icon: '📱',
      title: 'Phone',
      info: '+251 31 486 967',
      link: 'tel:+25131486967',
      color: '#0fa69c'
    },
    {
      icon: '📍',
      title: 'Location',
      info: 'Ethiopia, Addis Ababa',
      link: '#',
      color: '#18b8c8'
    },
    {
      icon: '⏰',
      title: 'Working Hours',
      info: 'Mon-Fri: 9AM - 6PM, Sat: 10AM - 4PM',
      link: '#',
      color: '#0fa69c'
    }
  ];

  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/wondma12', icon: <FaGithub />, color: '#333' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/haymanot-wondmagegn-b57502300/', icon: <FaLinkedin />, color: '#0077b5' },
    { name: 'Twitter', url: 'https://x.com/HWondmageg23368', icon: <FaTwitter />, color: '#1da1f2' }
  ];

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section id="contact" className="contact-page">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Get In Touch</h2>
            <p className="section-subtitle">
              Ready to bring your ideas to life? Let's start a conversation.
            </p>
          </motion.div>
          
          <div className="contact-container">
            {/* Contact Information Side */}
            <motion.div
              className="contact-info"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3>Let's Connect</h3>
              <p>
                I'm always open to discussing new opportunities, interesting projects, 
                or just having a friendly chat about technology and development.
              </p>
              
              <div className="contact-methods">
                {contactMethods.map((method, index) => (
                  <motion.a
                    key={method.title}
                    href={method.link}
                    className="contact-method"
                    whileHover={{ x: 10 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="method-icon" style={{ background: `linear-gradient(135deg, ${method.color}, ${method.color}cc)` }}>
                      {method.icon}
                    </div>
                    <div className="method-info">
                      <h4>{method.title}</h4>
                      <p>{method.info}</p>
                    </div>
                  </motion.a>
                ))}
              </div>

              <div className="social-section">
                <h4>Follow Me</h4>
                <div className="social-links">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    >
                      {social.icon}
                      {social.name}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Form Side */}
            <motion.form
              onSubmit={handleSubmit}
              className="contact-form"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {formMessage.text && (
                <div className={`form-message ${formMessage.type}`}>
                  {formMessage.text}
                </div>
              )}

              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder=" "
                  required
                />
                <label>Your Name</label>
              </div>
              
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder=" "
                  required
                />
                <label>Your Email</label>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder=" "
                  required
                />
                <label>Subject</label>
              </div>
              
              <div className="form-group">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder=" "
                  rows="5"
                  required
                />
                <label>Your Message</label>
              </div>
              
              <motion.button
                type="submit"
                className="btn primary"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading-spinner"></span>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </motion.button>
            </motion.form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
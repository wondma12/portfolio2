import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaStar, FaQuoteLeft, FaQuoteRight, FaArrowLeft, FaArrowRight, FaUser } from 'react-icons/fa';
import './Testimonials.css';

const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
    
    const testimonials = [
        {
            id: 1,
            name: 'Sarah Johnson',
            position: 'CEO, TechStart',
            content: 'John is an exceptional developer who delivered our project ahead of schedule. His attention to detail and problem-solving skills are outstanding. Working with him was a game-changer for our business.',
            rating: 5,
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
        },
        {
            id: 2,
            name: 'Michael Chen',
            position: 'Product Manager, InnovateCo',
            content: 'Working with John was a pleasure from start to finish. He brought innovative ideas to the table and implemented them flawlessly. His technical expertise and dedication to quality are truly impressive.',
            rating: 5,
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
        },
        {
            id: 3,
            name: 'Emily Rodriguez',
            position: 'Founder, CreativeStudio',
            content: "John's technical expertise and communication skills are top-notch. He truly understands the client's needs and delivers exceptional results that exceed expectations every single time.",
            rating: 5,
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
        },
        // {
        //     id: 4,
        //     name: 'David Thompson',
        //     position: 'CTO, FutureTech',
        //     content: 'One of the most skilled developers I have ever worked with. John consistently delivers high-quality code and solves complex problems with elegant solutions.',
        //     rating: 5,
        //     avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
        // }
    ];

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6
            }
        }
    };

    return (
        <section id="testimonials" className="testimonials-page" ref={sectionRef}>
            <div className="testimonials-container">
                <motion.div 
                    className="testimonials-header"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="section-title">What Clients Say</h2>
                    <p className="section-subtitle">
                        Don't just take my word for it - here's what my clients have to say about working with me
                    </p>
                </motion.div>

                {/* Desktop Grid View */}
                <div className="testimonials-grid">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            className="testimonial-card"
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -8 }}
                        >
                            <div className="testimonial-quote">
                                <FaQuoteLeft className="quote-icon-left" />
                                <p className="testimonial-content">"{testimonial.content}"</p>
                                <FaQuoteRight className="quote-icon-right" />
                            </div>
                            
                            <div className="testimonial-rating">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <FaStar key={i} className="star-icon" />
                                ))}
                            </div>
                            
                            <div className="testimonial-author">
                                <div className="author-avatar">
                                    <img src={testimonial.avatar} alt={testimonial.name} />
                                </div>
                                <div className="author-info">
                                    <h4>{testimonial.name}</h4>
                                    <p>{testimonial.position}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile Carousel View */}
                <div className="testimonials-carousel">
                    <motion.div 
                        className="carousel-container"
                        key={currentIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="testimonial-card featured">
                            <div className="testimonial-quote">
                                <FaQuoteLeft className="quote-icon-left" />
                                <p className="testimonial-content">"{testimonials[currentIndex].content}"</p>
                                <FaQuoteRight className="quote-icon-right" />
                            </div>
                            
                            <div className="testimonial-rating">
                                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                    <FaStar key={i} className="star-icon" />
                                ))}
                            </div>
                            
                            <div className="testimonial-author">
                                <div className="author-avatar">
                                    <img src={testimonials[currentIndex].avatar} alt={testimonials[currentIndex].name} />
                                </div>
                                <div className="author-info">
                                    <h4>{testimonials[currentIndex].name}</h4>
                                    <p>{testimonials[currentIndex].position}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    
                    <div className="carousel-controls">
                        <button className="carousel-btn" onClick={prevTestimonial}>
                            <FaArrowLeft />
                        </button>
                        <div className="carousel-dots">
                            {testimonials.map((_, idx) => (
                                <button
                                    key={idx}
                                    className={`dot ${currentIndex === idx ? 'active' : ''}`}
                                    onClick={() => setCurrentIndex(idx)}
                                />
                            ))}
                        </div>
                        <button className="carousel-btn" onClick={nextTestimonial}>
                            <FaArrowRight />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
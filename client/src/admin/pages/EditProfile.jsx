import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
    FaUser, FaBriefcase, FaBiohazard, FaImage, FaFileAlt, 
    FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaPhone, 
    FaMapMarkerAlt, FaSave, FaSpinner, FaUserCircle, FaGlobe,
    FaCheckCircle, FaEdit, FaCamera, FaLink, FaUsers
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../../services/api';
import './EditProfile.css';

const EditProfile = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();

    const watchedFields = watch();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/profile');
            const profile = response.data.data;
            setValue('name', profile?.name || '');
            setValue('title', profile?.title || '');
            setValue('bio', profile?.bio || '');
            setValue('avatar_url', profile?.avatar_url || '');
            setValue('resume_url', profile?.resume_url || '');
            setValue('github_url', profile?.github_url || '');
            setValue('linkedin_url', profile?.linkedin_url || '');
            setValue('twitter_url', profile?.twitter_url || '');
            setValue('email', profile?.email || '');
            setValue('phone', profile?.phone || '');
            setValue('location', profile?.location || '');
            
            if (profile?.avatar_url) {
                setProfileImage(profile.avatar_url);
            }
        } catch (error) {
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        setSaving(true);
        try {
            await api.put('/profile', data);
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    if (loading) {
        return (
            <div className="profile-loading">
                <div className="loading-spinner"></div>
                <p>Loading your profile...</p>
            </div>
        );
    }

    return (
        <div className="edit-profile">
            <div className="profile-container">
                {/* Header */}
                <motion.div 
                    className="profile-header"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="header-info">
                        <h1 className="profile-title">Edit Profile</h1>
                        <p className="profile-subtitle">Update your personal information and professional details</p>
                    </div>
                </motion.div>

                {/* Profile Preview Card */}
                <motion.div 
                    className="profile-preview"
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="preview-card">
                        <div className="preview-avatar">
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" />
                            ) : (
                                <div className="avatar-placeholder">
                                    <FaUserCircle />
                                </div>
                            )}
                            <div className="avatar-overlay">
                                <FaCamera />
                            </div>
                        </div>
                        <div className="preview-info">
                            <h2>{watchedFields.name || 'Your Name'}</h2>
                            <p>{watchedFields.title || 'Your Title'}</p>
                            <div className="preview-location">
                                <FaMapMarkerAlt />
                                <span>{watchedFields.location || 'Your Location'}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Profile Form */}
                <motion.div 
                    className="profile-form-container"
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.1 }}
                >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Basic Information Section */}
                        <div className="form-section">
                            <div className="section-header">
                                <FaUser className="section-icon" />
                                <h3>Basic Information</h3>
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    {/* <label>
                                        <FaUser className="input-icon" />
                                        Full Name
                                    </label> */}
                                    <input
                                        {...register('name')}
                                        placeholder="Enter your full name"
                                        className="form-input"
                                    />
                                </div>
                                
                                <div className="form-group">
                                    {/* <label>
                                        <FaBriefcase className="input-icon" />
                                        Title / Position
                                    </label> */}
                                    <input
                                        {...register('title')}
                                        placeholder="e.g., Full Stack Developer"
                                        className="form-input"
                                    />
                                </div>
                                
                                <div className="form-group full-width">
                                    {/* <label>
                                        <FaBiohazard className="input-icon" />
                                        Bio
                                    </label> */}
                                    <textarea
                                        {...register('bio')}
                                        rows="4"
                                        placeholder="Tell us about yourself..."
                                        className="form-textarea"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Information Section */}
                        <div className="form-section">
                            <div className="section-header">
                                <FaEnvelope className="section-icon" />
                                <h3>Contact Information</h3>
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    {/* <label>
                                        <FaEnvelope className="input-icon" />
                                        Email Address
                                    </label> */}
                                    <input
                                        {...register('email')}
                                        type="email"
                                        placeholder="your@email.com"
                                        className="form-input"
                                    />
                                </div>
                                
                                <div className="form-group">
                                    {/* <label>
                                        <FaPhone className="input-icon" />
                                        Phone Number
                                    </label> */}
                                    <input
                                        {...register('phone')}
                                        placeholder="+1 (555) 123-4567"
                                        className="form-input"
                                    />
                                </div>
                                
                                <div className="form-group">
                                    {/* <label>
                                        <FaMapMarkerAlt className="input-icon" />
                                        Location
                                    </label> */}
                                    <input
                                        {...register('location')}
                                        placeholder="City, Country"
                                        className="form-input"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Social Media Links Section */}
                        <div className="form-section">
                            <div className="section-header">
                                <FaGlobe className="section-icon" />
                                <h3>Social Media & Links</h3>
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    {/* <label>
                                        <FaGithub className="input-icon" />
                                       
                                    </label> */}
                                    <input
                                        {...register('github_url')}
                                        placeholder="https://github.com/username"
                                        className="form-input"
                                    />
                                </div>
                                
                                <div className="form-group">
                                    {/* <label>
                                        <FaLinkedin className="input-icon" />
                                      
                                    </label> */}
                                    <input
                                        {...register('linkedin_url')}
                                        placeholder="https://linkedin.com/in/username"
                                        className="form-input"
                                    />
                                </div>
                                
                                <div className="form-group">
                                    {/* <label>
                                        <FaTwitter className="input-icon" />
                                      
                                    </label> */}
                                    <input
                                        {...register('twitter_url')}
                                        placeholder="https://twitter.com/username"
                                        className="form-input"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Media & Files Section */}
                        <div className="form-section">
                            <div className="section-header">
                                <FaImage className="section-icon" />
                                <h3>Media & Files</h3>
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    {/* <label>
                                        <FaImage className="input-icon" />
                                        Avatar URL
                                    </label> */}
                                    <input
                                        {...register('avatar_url')}
                                        placeholder="https://example.com/avatar.jpg"
                                        className="form-input"
                                        onChange={(e) => setProfileImage(e.target.value)}
                                    />
                                    <small>Profile picture URL</small>
                                </div>
                                
                                <div className="form-group">
                                    {/* <label>
                                        <FaFileAlt className="input-icon" />
                                        Resume URL
                                    </label> */}
                                    <input
                                        {...register('resume_url')}
                                        placeholder="https://example.com/resume.pdf"
                                        className="form-input"
                                    />
                                    <small>Link to your resume/CV</small>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className="save-btn"
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <FaSpinner className="spinning" />
                                        Saving Changes...
                                    </>
                                ) : (
                                    <>
                                        <FaSave />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default EditProfile;
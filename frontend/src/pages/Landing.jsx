import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Shield, Zap, Users } from 'lucide-react';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-page">
      <div className="hero-section">
        <div className="hero-content">
          <div className="badge">Next Generation Streaming</div>
          <h1 className="hero-title">
            The future of <span className="gradient-text">video content</span> is here.
          </h1>
          <p className="hero-description">
            Experience a minimalist, high-performance video platform designed for creators and viewers who demand more. No clutter, just content.
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="btn-primary-lg">Start Creating</Link>
            <Link to="/login" className="btn-secondary-lg">Sign In</Link>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="visual-container glass">
             <img src="/Users/aryanrastogi/.gemini/antigravity/brain/fd4887ed-a40f-4f0b-ab91-06ece50f100e/landing_hero_preview_1776611541731.png" alt="Platform Preview" />
             <div className="floating-card glass">
               <Zap size={20} className="accent-text" />
               <span>Lightning Fast</span>
             </div>
          </div>
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-card glass">
          <div className="feature-icon"><Play size={24} /></div>
          <h3>HD Streaming</h3>
          <p>Buttery smooth playback across all your devices with adaptive bitrate.</p>
        </div>
        <div className="feature-card glass">
          <div className="feature-icon"><Users size={24} /></div>
          <h3>Community</h3>
          <p>Build your audience with powerful engagement tools and analytics.</p>
        </div>
        <div className="feature-card glass">
          <div className="feature-icon"><Shield size={24} /></div>
          <h3>Secure & Private</h3>
          <p>Your data and content are protected by industry-leading security.</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;

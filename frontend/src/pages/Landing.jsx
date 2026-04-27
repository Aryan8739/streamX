import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Shield, Zap, Users } from 'lucide-react';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-page">
      <header className="hero-section">
        <div className="hero-content">
          <div className="badge">Next Generation Streaming</div>
          <h1 className="hero-title">
            Stream <span className="gradient-text">everything</span>, <br /> 
            anywhere.
          </h1>
          <p className="hero-description">
            Experience streamX—the minimalist, high-performance video platform designed for the modern creator. No clutter, just pure content.
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="btn-primary-lg">Get Started</Link>
            <Link to="/login" className="btn-secondary-lg">Sign In</Link>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="visual-container">
             <img src="/Users/aryanrastogi/.gemini/antigravity/brain/97776799-c7ea-4a4e-b746-c3ee10d79b24/streamx_hero_preview_1777310074885.png" alt="streamX Interface Preview" />
             <div className="floating-card">
               <Zap size={18} />
               <span>Ultra Low Latency</span>
             </div>
          </div>
        </div>
      </header>

      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon"><Play size={24} /></div>
          <h3>Seamless Playback</h3>
          <p>Adaptive bitrate streaming ensuring HD quality even on low-speed connections.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><Users size={24} /></div>
          <h3>Creator First</h3>
          <p>Advanced analytics and engagement tools built to help you grow your audience.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><Shield size={24} /></div>
          <h3>Secure by Design</h3>
          <p>End-to-end security for your content and data, powered by industry-standard protocols.</p>
        </div>
      </section>
    </div>
  );
};

export default Landing;

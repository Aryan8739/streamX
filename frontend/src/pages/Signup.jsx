import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const data = new FormData();
    data.append('username', formData.username);
    data.append('email', formData.email);
    data.append('fullName', formData.fullName);
    data.append('password', formData.password);
    if (avatar) data.append('avatar', avatar);
    if (coverImage) data.append('coverImage', coverImage);

    try {
      await register(data);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join the Stream community today</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-row">
            <div className="input-group">
              <label>Username</label>
              <input 
                type="text" 
                required 
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Full Name</label>
              <input 
                type="text" 
                required 
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              required 
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="input-row">
            <div className="input-group">
              <label>Avatar</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files[0])}
              />
            </div>
            <div className="input-group">
              <label>Cover Image (Optional)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files[0])}
              />
            </div>
          </div>
          
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="auth-footer">
          Already have an account? <Link to="/login" className="accent-link">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;

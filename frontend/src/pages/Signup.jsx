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
  const [step, setStep] = useState(1); // 1: Details, 2: OTP
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(0);
  
  const { register, sendOTP } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  React.useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendOTP(formData.email);
      toast.success('OTP sent to your email');
      setStep(2);
      setTimer(60); // Reset 60s timer
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const data = new FormData();
    data.append('username', formData.username);
    data.append('email', formData.email);
    data.append('fullName', formData.fullName);
    data.append('password', formData.password);
    data.append('otp', otp);
    if (avatar) data.append('avatar', avatar);
    if (coverImage) data.append('coverImage', coverImage);

    try {
      await register(data);
      toast.success('Account created successfully!');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join the streamX community today</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="auth-form">
            <div className="input-row">
              <div className="input-group">
                <label>Username</label>
                <input 
                  type="text" 
                  required 
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="johndoe"
                />
              </div>
              <div className="input-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  required 
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="John Doe"
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
                placeholder="john@example.com"
              />
            </div>
            
            <div className="input-group">
              <label>Password</label>
              <input 
                type="password" 
                required 
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
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
              {loading ? 'Sending OTP...' : 'Verify Email'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label>Enter OTP</label>
              <input 
                type="text" 
                required 
                maxLength="6"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setError('');
                }}
                placeholder="000000"
                className="otp-input"
              />
              <p className="otp-help">We've sent a 6-digit code to {formData.email}</p>
            </div>
            
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Verifying...' : 'Complete Registration'}
            </button>
            
            <div className="otp-actions">
              {timer > 0 ? (
                <p className="resend-timer">Resend OTP in <span>{timer}s</span></p>
              ) : (
                <button 
                  type="button" 
                  className="resend-btn" 
                  onClick={() => handleSendOTP(null)}
                  disabled={loading}
                >
                  Resend OTP
                </button>
              )}
            </div>

            <button 
              type="button" 
              className="text-btn" 
              onClick={() => setStep(1)}
              disabled={loading}
            >
              Back to Details
            </button>
          </form>
        )}
        
        <div className="auth-footer">
          Already have an account? <Link to="/login" className="accent-link">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;

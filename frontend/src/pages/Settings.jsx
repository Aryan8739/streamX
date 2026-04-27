import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import { Settings as SettingsIcon, User, Lock, Bell, Moon, Shield, Camera, Check, AlertCircle } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Profile state
  const [profileData, setProfileData] = useState({
    fullName: user?.fullname || '', // Backend uses fullname (lowercase n) in model
    email: user?.email || '',
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient.patch('/users/update-account', profileData);
      setUser(res.data);
      showMessage('success', 'Profile updated successfully!');
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return showMessage('error', 'New passwords do not match');
    }
    setLoading(true);
    try {
      await apiClient.post('/users/change-password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      showMessage('success', 'Password updated successfully!');
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Password update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('avatar', file);

    setLoading(true);
    try {
      const res = await apiClient.patch('/users/avatar', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUser(res.data);
      showMessage('success', 'Avatar updated successfully!');
    } catch (err) {
      showMessage('error', 'Failed to upload avatar');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: <User size={18} /> },
    { id: 'security', label: 'Security', icon: <Lock size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'appearance', label: 'Appearance', icon: <Moon size={18} /> },
    { id: 'privacy', label: 'Privacy', icon: <Shield size={18} /> },
  ];

  return (
    <div className="settings-container">
      <div className="page-header">
        <div className="header-icon">
          <SettingsIcon size={22} />
        </div>
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account and preferences</p>
        </div>
      </div>

      {message.text && (
        <div className={`message-banner ${message.type}`}>
          {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </div>
      )}

      <div className="settings-layout">
        <aside className="settings-sidebar glass">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`settings-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </aside>

        <main className="settings-content glass">
          {activeTab === 'account' && (
            <div className="settings-section">
              <h2>Account Information</h2>
              <div className="profile-edit">
                <div className="avatar-edit-wrapper">
                  <div className="avatar-preview">
                    <img src={user?.avatar} alt="Avatar" />
                    <label className="avatar-upload-btn" title="Change Avatar">
                      <Camera size={16} />
                      <input type="file" hidden accept="image/*" onChange={handleAvatarUpdate} />
                    </label>
                  </div>
                  <div className="username-display">
                    <h3>@{user?.username}</h3>
                    <p>Channel Member since {new Date(user?.createdAt).getFullYear()}</p>
                  </div>
                </div>

                <form onSubmit={handleProfileUpdate}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address (Cannot be changed)</label>
                    <input 
                      type="email" 
                      value={profileData.email}
                      disabled
                      readOnly
                    />
                  </div>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section">
              <h2>Security</h2>
              <form className="security-form" onSubmit={handlePasswordChange}>
                <div className="form-group">
                  <label>Current Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    required
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    required
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    required
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  />
                </div>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h2>Appearance</h2>
              <div className="appearance-settings">
                <div className="setting-item glass">
                  <div className="setting-info">
                    <h4>Dark Mode</h4>
                    <p>Use the dark theme across the application</p>
                  </div>
                  <div className="setting-control">
                    <button className="toggle-btn active">Enabled</button>
                  </div>
                </div>
                <div className="setting-item glass disabled">
                  <div className="setting-info">
                    <h4>Light Mode</h4>
                    <p>Coming in future updates</p>
                  </div>
                  <div className="setting-control">
                    <button className="toggle-btn" disabled>Unavailable</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'account' && activeTab !== 'security' && activeTab !== 'appearance' && (
            <div className="empty-section">
              <p>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} settings are being finalized.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};


export default Settings;

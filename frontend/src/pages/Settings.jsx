import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, User, Lock, Bell, Moon, Shield } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('account');

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
          <SettingsIcon size={32} />
        </div>
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account and preferences</p>
        </div>
      </div>

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
                <div className="avatar-preview">
                  <img src={user?.avatar} alt="Avatar" />
                  <button className="btn-small">Change</button>
                </div>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" defaultValue={user?.fullName} />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" defaultValue={user?.email} disabled />
                </div>
                <div className="form-group">
                  <label>Username</label>
                  <input type="text" defaultValue={user?.username} />
                </div>
                <button className="btn-primary">Save Changes</button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section">
              <h2>Security</h2>
              <div className="security-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <input type="password" placeholder="••••••••" />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input type="password" placeholder="••••••••" />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input type="password" placeholder="••••••••" />
                </div>
                <button className="btn-primary">Update Password</button>
              </div>
            </div>
          )}

          {activeTab !== 'account' && activeTab !== 'security' && (
            <div className="empty-section">
              <p>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} settings coming soon...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Settings;

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, History, ThumbsUp, PlaySquare, Clock, Users, UserCircle, Settings } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const menuItems = [
    { icon: <Home size={20} />, label: 'Home', path: '/' },
    { icon: <Users size={20} />, label: 'Subscriptions', path: '/subscriptions' },
    { icon: <PlaySquare size={20} />, label: 'Playlists', path: '/playlists' },
    { icon: <ThumbsUp size={20} />, label: 'Liked Videos', path: '/likes' },
    { icon: <History size={20} />, label: 'History', path: '/history' },
    { icon: <Clock size={20} />, label: 'Watch Later', path: '/watch-later' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        {menuItems.map((item) => (
          <NavLink 
            key={item.label} 
            to={item.path} 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span className="label">{item.label}</span>
          </NavLink>
        ))}
      </div>
      
      <div className="sidebar-divider"></div>
      
      <div className="sidebar-section">
        <h3 className="section-title">Account</h3>
        <NavLink to="/profile" className="sidebar-link">
          <UserCircle size={20} />
          <span className="label">My Channel</span>
        </NavLink>
        <NavLink to="/settings" className="sidebar-link">
          <Settings size={20} />
          <span className="label">Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;

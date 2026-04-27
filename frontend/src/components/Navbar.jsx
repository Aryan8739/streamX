import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Video, Bell, User, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { toggleSidebar, openUpload } = useUI();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?query=${searchQuery}`);
    }
  };

  return (
    <nav className="navbar glass">
      <div className="nav-left">
        {user && (
          <button className="icon-btn menu-btn" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
        )}
        <Link to="/" className="logo">
          <span className="accent-text">streamX</span>
        </Link>
      </div>

      <form className="nav-center search-bar" onSubmit={handleSearch}>
        <input 
          type="text" 
          placeholder="Search videos..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-btn">
          <Search size={18} />
        </button>
      </form>

      <div className="nav-right">
        {user ? (
          <>
            <button 
              className="icon-btn" 
              title="Upload Video"
              onClick={openUpload}
            >
              <Video size={22} />
            </button>
            <button className="icon-btn">
              <Bell size={22} />
            </button>
            <div className="user-profile">
              <Link to={`/profile/${user.username}`}>
                <img src={user.avatar} alt={user.username} className="avatar-sm" />
              </Link>
              <button 
                onClick={async () => {
                  await logout();
                  navigate('/');
                }} 
                className="logout-btn" 
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="btn-text">Login</Link>
            <Link to="/signup" className="btn-primary">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VideoDetail from './pages/VideoDetail';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { UIProvider, useUI } from './context/UIContext';
import './App.css';

function AppContent() {
  const { user, loading } = useAuth();
  const { sidebarOpen } = useUI();
  const location = useLocation();
  
  // Define paths that shouldn't show the sidebar (Login, Signup)
  const noSidebarPaths = ['/login', '/signup'];
  
  // Show sidebar only if:
  // 1. User is authenticated
  // 2. We're NOT on an explicit no-sidebar path
  // 3. The sidebar toggle state is true
  const showSidebar = user && !noSidebarPaths.includes(location.pathname) && sidebarOpen;

  if (loading) {
    return <div className="loading-screen">Loading Stream...</div>;
  }

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        {showSidebar && <Sidebar />}
        <div className={`page-wrapper ${!showSidebar ? 'full-width' : ''}`}>
          <Routes>
            <Route path="/" element={user ? <Home /> : <Landing />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/video/:videoId" element={<VideoDetail />} />
            <Route path="/profile/:username" element={<Profile />} />
            {/* Added missing sidebar routes */}
            <Route path="/subscriptions" element={<div className="placeholder">Subscriptions Coming Soon</div>} />
            <Route path="/playlists" element={<div className="placeholder">Playlists Coming Soon</div>} />
            <Route path="/likes" element={<div className="placeholder">Liked Videos Coming Soon</div>} />
            <Route path="/history" element={<div className="placeholder">History Coming Soon</div>} />
            <Route path="/watch-later" element={<div className="placeholder">Watch Later Coming Soon</div>} />
            <Route path="/settings" element={<div className="placeholder">Settings Coming Soon</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <AppContent />
      </UIProvider>
    </AuthProvider>
  );
}

export default App;

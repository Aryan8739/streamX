import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VideoDetail from './pages/VideoDetail';
import Profile from './pages/Profile';
import Playlists from './pages/Playlists';
import PlaylistDetail from './pages/PlaylistDetail';
import LikedVideos from './pages/LikedVideos';
import Subscriptions from './pages/Subscriptions';
import History from './pages/History';
import Settings from './pages/Settings';
import WatchLater from './pages/WatchLater';
import Dashboard from './pages/Dashboard';
import Community from './pages/Community';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { UIProvider, useUI } from './context/UIContext';
import { ToastProvider } from './context/ToastContext';
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
            <Route path="/playlist/:playlistId" element={<PlaylistDetail />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/likes" element={<LikedVideos />} />
            <Route path="/history" element={<History />} />
            <Route path="/watch-later" element={<WatchLater />} />
            <Route path="/settings" element={<Settings />} />
             <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/community" element={<Community />} />
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
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </UIProvider>
    </AuthProvider>
  );
}

export default App;

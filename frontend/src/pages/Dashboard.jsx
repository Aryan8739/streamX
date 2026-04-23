import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { BarChart3, Video, Users, Eye, Play, Trash2, Edit3, ToggleLeft, ToggleRight } from 'lucide-react';
import EditVideoModal from '../components/EditVideoModal';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, videosRes] = await Promise.all([
        apiClient.get('/dashboard/stats'),
        apiClient.get('/dashboard/videos')
      ]);
      setStats(statsRes.data);
      setVideos(videosRes.data || []);
    } catch (err) {
      console.error('Dashboard fetch failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteVideo = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      try {
        await apiClient.delete(`/videos/${videoId}`);
        setVideos(videos.filter(v => v._id !== videoId));
        // Refresh stats too
        const statsRes = await apiClient.get('/dashboard/stats');
        setStats(statsRes.data);
      } catch (err) {
        alert(err.message || 'Failed to delete video');
      }
    }
  };

  const handleTogglePublish = async (videoId) => {
    try {
      const res = await apiClient.patch(`/videos/toggle/publish/${videoId}`);
      setVideos(videos.map(v => v._id === videoId ? { ...v, isPublished: res.data.isPublished } : v));
    } catch (err) {
      alert(err.message || 'Failed to toggle publish status');
    }
  };

  const handleEditClick = (video) => {
    setSelectedVideo(video);
    setIsEditModalOpen(true);
  };

  if (loading) return <div className="loading-spinner">Loading Dashboard...</div>;

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div className="header-icon">
          <BarChart3 size={32} />
        </div>
        <div>
          <h1 className="page-title">Channel Dashboard</h1>
          <p className="page-subtitle">Overview of your channel's performance</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stats-card glass">
          <div className="stats-icon purple"><Eye size={24} /></div>
          <div className="stats-info">
            <span className="stats-label">Total Views</span>
            <h2 className="stats-value">{stats?.totalViews || 0}</h2>
          </div>
        </div>
        <div className="stats-card glass">
          <div className="stats-icon blue"><Users size={24} /></div>
          <div className="stats-info">
            <span className="stats-label">Subscribers</span>
            <h2 className="stats-value">{stats?.totalSubscribers || 0}</h2>
          </div>
        </div>
        <div className="stats-card glass">
          <div className="stats-icon green"><Video size={24} /></div>
          <div className="stats-info">
            <span className="stats-label">Total Videos</span>
            <h2 className="stats-value">{stats?.totalVideos || 0}</h2>
          </div>
        </div>
        <div className="stats-card glass">
          <div className="stats-icon orange"><Play size={24} /></div>
          <div className="stats-info">
            <span className="stats-label">Total Likes</span>
            <h2 className="stats-value">{stats?.totalLikes || 0}</h2>
          </div>
        </div>
      </div>

      <div className="content-section">
        <h2 className="section-title">Your Videos</h2>
        <div className="table-container glass">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Video</th>
                <th>Status</th>
                <th>Views</th>
                <th>Likes</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video) => (
                <tr key={video._id}>
                  <td>
                    <div className="video-cell">
                      <img src={video.thumbnail} alt={video.title} />
                      <span className="truncate">{video.title}</span>
                    </div>
                  </td>
                  <td>
                    <button 
                      className={`status-btn ${video.isPublished ? 'published' : 'draft'}`}
                      onClick={() => handleTogglePublish(video._id)}
                      title="Click to toggle status"
                    >
                      {video.isPublished ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                      <span>{video.isPublished ? 'Published' : 'Draft'}</span>
                    </button>
                  </td>
                  <td>{video.views}</td>
                  <td>{video.likesCount || 0}</td>
                  <td>{new Date(video.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-btns">
                      <button 
                        className="icon-btn edit" 
                        title="Edit"
                        onClick={() => handleEditClick(video)}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        className="icon-btn delete" 
                        title="Delete"
                        onClick={() => handleDeleteVideo(video._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {videos.length === 0 && <p className="empty-msg">No videos uploaded yet.</p>}
        </div>
      </div>

      <EditVideoModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        video={selectedVideo}
        onUpdate={fetchDashboardData}
      />
    </div>
  );
};


export default Dashboard;

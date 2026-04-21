import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { BarChart3, Video, Users, Eye, Play, Trash2, Edit3 } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchDashboardData();
  }, []);

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
                      <span>{video.title}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${video.isPublished ? 'published' : 'draft'}`}>
                      {video.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>{video.views}</td>
                  <td>{video.likesCount || 0}</td>
                  <td>{new Date(video.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-btns">
                      <button className="icon-btn edit" title="Edit"><Edit3 size={16} /></button>
                      <button className="icon-btn delete" title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {videos.length === 0 && <p className="empty-msg">No videos uploaded yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

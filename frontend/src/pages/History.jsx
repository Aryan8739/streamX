import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import VideoCard from '../components/VideoCard';
import { History as HistoryIcon, Trash2 } from 'lucide-react';
import './History.css';

const History = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/users/history');
        setVideos(response.data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch watch history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const clearHistory = async () => {
    // Assuming there's a clear history endpoint
    try {
      // await apiClient.delete('/users/history');
      // setVideos([]);
      alert('Clear history functionality requires backend implementation');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading-spinner">Loading History...</div>;

  return (
    <div className="history-container">
      <div className="page-header justify-between">
        <div className="header-left">
          <div className="header-icon">
            <HistoryIcon size={32} />
          </div>
          <div>
            <h1 className="page-title">Watch History</h1>
            <p className="page-subtitle">{videos.length} videos</p>
          </div>
        </div>
        <button className="btn-secondary" onClick={clearHistory}>
          <Trash2 size={18} /> Clear all history
        </button>
      </div>

      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>

      {videos.length === 0 && (
        <div className="empty-state">
          <HistoryIcon size={64} className="text-muted" />
          <h2>No history found</h2>
          <p>Videos you watch will show up here.</p>
        </div>
      )}
    </div>
  );
};

export default History;

import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import VideoCard from '../components/VideoCard';
import { History as HistoryIcon, Trash2, Search, X } from 'lucide-react';
import Skeleton from '../components/Skeleton';
import { useToast } from '../context/ToastContext';
import './History.css';

const History = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const toast = useToast();

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/users/history');
      setVideos(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    window.scrollTo(0, 0);
  }, []);

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear your entire watch history?')) {
      try {
        await apiClient.delete('/users/history');
        setVideos([]);
        toast.success('History cleared');
      } catch (err) {
        toast.error('Failed to clear history');
      }
    }
  };

  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.owner?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="history-container">
      <div className="page-header justify-between">
        <div className="header-left">
          <div className="header-icon">
            <HistoryIcon size={22} />
          </div>
          <div>
            <h1 className="page-title">Watch History</h1>
            <p className="page-subtitle">{videos.length} videos stored</p>
          </div>
        </div>
        
        {videos.length > 0 && (
          <button className="btn-clear-history" onClick={handleClearHistory}>
            <Trash2 size={18} /> Clear all
          </button>
        )}
      </div>

      <div className="history-search-bar glass">
        <Search size={20} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search your history..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button className="clear-search" onClick={() => setSearchQuery('')}>
            <X size={18} />
          </button>
        )}
      </div>

      {loading ? (
        <Skeleton type="video" count={8} />
      ) : (
        <>
          <div className="video-grid">
            {filteredVideos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>

          {filteredVideos.length === 0 && (
            <div className="empty-state">
              <HistoryIcon size={64} className="text-muted" />
              <h2>No history found</h2>
              <p>{searchQuery ? 'Try a different search term' : 'Videos you watch will show up here.'}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default History;

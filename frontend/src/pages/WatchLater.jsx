import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import VideoCard from '../components/VideoCard';
import { Clock } from 'lucide-react';
import Skeleton from '../components/Skeleton';
import './LikedVideos.css';

const WatchLater = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchLater = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/users/watch-later');
        setVideos(response.data || []);
      } catch (err) {
        console.error('Failed to fetch watch later', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchLater();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="liked-videos-container">
      <div className="page-header">
        <div className="header-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
          <Clock size={32} />
        </div>
        <div>
          <h1 className="page-title">Watch Later</h1>
          <p className="page-subtitle">{loading ? '...' : videos.length} videos bookmarked</p>
        </div>
      </div>

      {loading ? (
        <Skeleton type="video" count={8} />
      ) : (
        <>
          <div className="video-grid">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>

          {videos.length === 0 && (
            <div className="empty-state">
              <Clock size={64} className="text-muted" />
              <h2>Your Watch Later list is empty</h2>
              <p>Save videos to watch them later whenever you want.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WatchLater;

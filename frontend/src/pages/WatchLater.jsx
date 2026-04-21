import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import VideoCard from '../components/VideoCard';
import { Clock } from 'lucide-react';
import './LikedVideos.css'; // Reusing styles

const WatchLater = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mocking for now as backend might not have dedicated Watch Later
    // or it's a special playlist. For this demo, let's show empty or fetch a playlist named "Watch Later"
    const fetchWatchLater = async () => {
      try {
        setLoading(true);
        // Find playlist named "Watch Later"
        const response = await apiClient.get('/playlists/user/me'); // Assuming there's a way to get current user playlists
        const watchLater = response.data?.find(p => p.name.toLowerCase() === 'watch later');
        if (watchLater) {
          setVideos(watchLater.videos || []);
        }
      } catch (err) {
        console.error('Failed to fetch watch later', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchLater();
  }, []);

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="liked-videos-container">
      <div className="page-header">
        <div className="header-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
          <Clock size={32} />
        </div>
        <div>
          <h1 className="page-title">Watch Later</h1>
          <p className="page-subtitle">{videos.length} videos</p>
        </div>
      </div>

      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>

      {videos.length === 0 && (
        <div className="empty-state">
          <Clock size={64} className="text-muted" />
          <h2>Your Watch Later list is empty</h2>
          <p>Save videos to watch them later!</p>
        </div>
      )}
    </div>
  );
};

export default WatchLater;

import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import VideoCard from '../components/VideoCard';
import { ThumbsUp } from 'lucide-react';
import Skeleton from '../components/Skeleton';
import './LikedVideos.css';

const LikedVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/likes/videos');
        // The backend might return an array of like objects or directly videos
        // Usually it's like objects with a video field
        setVideos(response.data.map(item => item.likedVideo) || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch liked videos');
      } finally {
        setLoading(false);
      }
    };

    fetchLikedVideos();
  }, []);

  if (loading) {
    return <Skeleton type="video" count={8} />;
  }

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="liked-videos-container">
      <div className="page-header">
        <div className="header-icon">
          <ThumbsUp size={32} />
        </div>
        <div>
          <h1 className="page-title">Liked Videos</h1>
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
          <ThumbsUp size={64} className="text-muted" />
          <h2>No liked videos yet</h2>
          <p>Videos you like will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default LikedVideos;

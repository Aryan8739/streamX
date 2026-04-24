import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiClient from '../api/client';
import VideoCard from '../components/VideoCard';
import Skeleton from '../components/Skeleton';
import './Home.css';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const endpoint = query ? `/videos?query=${query}` : '/videos';
        const response = await apiClient.get(endpoint);
        setVideos(response.data.videos || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch videos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [query]);

  if (loading) {
    return <Skeleton type="video" count={8} />;
  }

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="home-container">
      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
      {videos.length === 0 && (
        <div className="empty-state">
          <h2>No videos found</h2>
          <p>Try searching for something else or upload your first video.</p>
        </div>
      )}
    </div>
  );
};

export default Home;

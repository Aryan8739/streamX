import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiClient from '../api/client';
import VideoCard from '../components/VideoCard';
import Skeleton from '../components/Skeleton';
import FilterBar from '../components/FilterBar';
import './Home.css';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  
  // Sorting state: { field, type }
  const [sort, setSort] = useState({ field: 'createdAt', type: 'desc' });

  const handleSortChange = (sortId) => {
    const [field, type] = sortId.split('-');
    setSort({ field, type });
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        let endpoint = '/videos?';
        if (query) endpoint += `query=${query}&`;
        endpoint += `sortBy=${sort.field}&sortType=${sort.type}`;
        
        const response = await apiClient.get(endpoint);
        setVideos(response.data.videos || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch videos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [query, sort]);

  if (loading) {
    return (
      <div className="home-container">
        <FilterBar activeSort={`${sort.field}-${sort.type}`} onSortChange={handleSortChange} />
        <Skeleton type="video" count={8} />
      </div>
    );
  }

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="home-container">
      <FilterBar activeSort={`${sort.field}-${sort.type}`} onSortChange={handleSortChange} />
      
      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
      
      {!loading && videos.length === 0 && (
        <div className="empty-state">
          <h2>No videos found</h2>
          <p>Try searching for something else or adjusting your filters.</p>
        </div>
      )}
    </div>
  );
};

export default Home;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ThumbsUp, MessageSquare, Share2, MoreVertical, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import './VideoDetail.css';

const VideoDetail = () => {
  const { videoId } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/videos/${videoId}`);
        setVideo(response.data);
        
        // In a real app, we'd check subscription status
        setSubscribed(false); 
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideoData();
  }, [videoId]);

  if (loading) return <div className="video-skeleton">Loading...</div>;
  if (!video) return <div className="error-message">Video not found</div>;

  return (
    <div className="video-detail-container">
      <div className="main-video-section">
        <div className="player-wrapper">
          <video 
            src={video.videoFile} 
            controls 
            autoPlay 
            className="video-player"
            poster={video.thumbnail}
          ></video>
        </div>

        <h1 className="detail-title">{video.title}</h1>
        
        <div className="detail-meta">
          <div className="channel-info">
            <Link to={`/profile/${video.owner.username}`}>
              <img src={video.owner.avatar} alt={video.owner.username} className="channel-avatar" />
            </Link>
            <div className="channel-details">
              <Link to={`/profile/${video.owner.username}`} className="channel-name">
                {video.owner.username} <CheckCircle size={14} className="verified-icon" />
              </Link>
              <span className="sub-count">1.2M subscribers</span>
            </div>
            <button className={`sub-btn ${subscribed ? 'subscribed' : ''}`}>
              {subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>

          <div className="action-buttons">
            <button className="action-btn">
              <ThumbsUp size={18} /> <span>{video.views}</span>
            </button>
            <button className="action-btn">
              <Share2 size={18} /> <span>Share</span>
            </button>
            <button className="action-btn">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        <div className="video-description glass">
          <div className="description-stats">
            <span>{video.views} views</span>
            <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
          </div>
          <p className="description-text">{video.description}</p>
        </div>

        {/* Comments section would go here */}
      </div>

      <div className="related-videos">
        <h3 className="section-title">Related Videos</h3>
        {/* Map over related videos */}
        <p className="text-muted">Coming soon...</p>
      </div>
    </div>
  );
};

export default VideoDetail;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ThumbsUp, MessageSquare, Share2, MoreVertical, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';
import AddToPlaylistModal from '../components/AddToPlaylistModal';
import { Plus as SavePlus } from 'lucide-react';
import './VideoDetail.css';

const VideoDetail = () => {
  const { videoId } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVideoData = async () => {
    try {
      setLoading(true);
      const videoRes = await apiClient.get(`/videos/${videoId}`);
      setVideo(videoRes.data);
      
      const relatedRes = await apiClient.get('/videos');
      setRelatedVideos(relatedRes.data.videos.filter(v => v._id !== videoId) || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideoData();
  }, [videoId]);

  const toggleLike = async () => {
    if (!user) return alert('Please login to like');
    try {
      await apiClient.post(`/likes/toggle/v/${videoId}`);
      setIsLiked(!isLiked);
    } catch (err) {
      console.error('Like toggle failed', err);
    }
  };

  const toggleSubscribe = async () => {
    if (!user) return alert('Please login to subscribe');
    try {
      await apiClient.post(`/subscriptions/c/${video.owner._id}`);
      setSubscribed(!subscribed);
    } catch (err) {
      console.error('Subscribe toggle failed', err);
    }
  };

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
            <button 
              className={`sub-btn ${subscribed ? 'subscribed' : ''}`}
              onClick={toggleSubscribe}
            >
              {subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>

          <div className="action-buttons">
            <button 
              className={`action-btn ${isLiked ? 'liked' : ''}`}
              onClick={toggleLike}
            >
              <ThumbsUp size={18} fill={isLiked ? "currentColor" : "none"} /> 
              <span>{video.views}</span>
            </button>
            <button className="action-btn">
              <Share2 size={18} /> <span>Share</span>
            </button>
            <button className="action-btn" onClick={() => setIsPlaylistModalOpen(true)}>
              <SavePlus size={18} /> <span>Save</span>
            </button>
            <button className="action-btn">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        <AddToPlaylistModal 
          isOpen={isPlaylistModalOpen} 
          onClose={() => setIsPlaylistModalOpen(false)} 
          videoId={videoId}
        />

        <div className="video-description glass">
          <div className="description-stats">
            <span>{video.views} views</span>
            <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
          </div>
          <p className="description-text">{video.description}</p>
        </div>

        <CommentSection videoId={videoId} />
      </div>

      <aside className="related-videos">
        <h3 className="section-title">Related Videos</h3>
        <div className="related-list">
          {relatedVideos.map((rv) => (
            <Link key={rv._id} to={`/video/${rv._id}`} className="related-card">
              <img src={rv.thumbnail} alt={rv.title} className="related-thumb" />
              <div className="related-info">
                <h4 className="related-video-title">{rv.title}</h4>
                <p className="related-channel">{rv.owner.username}</p>
                <p className="related-meta">{rv.views} views • {formatDistanceToNow(new Date(rv.createdAt))} ago</p>
              </div>
            </Link>
          ))}
          {relatedVideos.length === 0 && <p className="text-muted">No related videos</p>}
        </div>
      </aside>
    </div>
  );
};

export default VideoDetail;

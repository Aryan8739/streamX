import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ThumbsUp, MessageSquare, Share2, MoreVertical, CheckCircle, Plus, Clock, Film } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import CommentSection from '../components/CommentSection';
import AddToPlaylistModal from '../components/AddToPlaylistModal';
import Skeleton from '../components/Skeleton';
import './VideoDetail.css';

const VideoDetail = () => {
  const { videoId } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const [video, setVideo] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isWatchLater, setIsWatchLater] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true);
        const videoRes = await apiClient.get(`/videos/${videoId}`);
        setVideo(videoRes.data);
        setLikesCount(videoRes.data.likesCount || 0);
        setIsLiked(videoRes.data.isLiked || false);
        setIsWatchLater(videoRes.data.isWatchLater || false);

        // Fetch related videos (using same category or just random for now)
        const relatedRes = await apiClient.get('/videos?limit=10');
        setRelatedVideos(relatedRes.data.docs?.filter(v => v._id !== videoId) || []);


      } catch (err) {
        console.error('Fetch video failed', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
    window.scrollTo(0, 0);
  }, [videoId, user]);

  const toggleLike = async () => {
    if (!user) return toast.info('Please login to like');
    try {
      const res = await apiClient.post(`/likes/toggle/v/${videoId}`);
      setIsLiked(res.data.isLiked);
      setLikesCount(prev => res.data.isLiked ? prev + 1 : prev - 1);
    } catch (err) {
      console.error('Like toggle failed', err);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const toggleWatchLater = async () => {
    if (!user) return toast.info('Please login to use Watch Later');
    try {
      const res = await apiClient.post(`/users/watch-later/${videoId}`);
      setIsWatchLater(res.data.isWatchLater);
      toast.success(res.data.isWatchLater ? 'Added to Watch Later' : 'Removed from Watch Later');
    } catch (err) {
      toast.error('Failed to update Watch Later');
    }
    setShowMore(false);
  };

  const toggleSubscribe = async () => {
    if (!user) return toast.info('Please login to subscribe');
    try {
      await apiClient.post(`/subscriptions/c/${video.owner._id}`);
      setSubscribed(!subscribed);
      toast.success(subscribed ? 'Unsubscribed' : 'Subscribed!');
    } catch (err) {
      toast.error('Could not update subscription');
    }
  };

  if (loading) {
    return (
      <div className="video-detail-container">
        <div className="main-video-section">
          <div className="skeleton skeleton-thumbnail" style={{ aspectRatio: '16/9' }} />
          <div className="skeleton skeleton-line" style={{ marginTop: '1.5rem', height: '30px', width: '70%' }} />
          <div className="detail-meta" style={{ marginTop: '2rem' }}>
            <div className="skeleton skeleton-avatar" style={{ width: '48px', height: '48px' }} />
            <div className="skeleton-text-group">
              <div className="skeleton skeleton-line" style={{ width: '120px' }} />
              <div className="skeleton skeleton-line short" />
            </div>
          </div>
        </div>
        <aside className="related-videos">
          <Skeleton type="video" count={4} />
        </aside>
      </div>
    );
  }

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
              <span>{likesCount}</span>
            </button>
            <button className="action-btn" onClick={handleShare}>
              <Share2 size={18} /> <span>Share</span>
            </button>
            <button className="action-btn" onClick={() => setIsPlaylistModalOpen(true)}>
              <Plus size={18} /> <span>Save</span>
            </button>
            <div className="more-options-wrapper">
              <button className="action-btn" onClick={() => setShowMore(!showMore)}>
                <MoreVertical size={18} />
              </button>
              {showMore && (
                <div className="more-dropdown glass">
                  <button onClick={toggleWatchLater}>
                    <Clock size={16} /> 
                    <span>{isWatchLater ? 'Remove from Watch Later' : 'Watch Later'}</span>
                  </button>
                  <a href={video.videoFile} download target="_blank" rel="noreferrer">
                    <Film size={16} /> <span>Download Video</span>
                  </a>
                </div>
              )}
            </div>
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
              <div className="related-thumb-container">
                <img src={rv.thumbnail} alt={rv.title} className="related-thumb" />
                <span className="duration-tag">
                  {Math.floor(rv.duration / 60)}:{Math.floor(rv.duration % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <div className="related-info">
                <h4 className="related-video-title">{rv.title}</h4>
                <p className="related-channel">{rv.owner?.username}</p>
                <p className="related-meta">{rv.views} views • {formatDistanceToNow(new Date(rv.createdAt))} ago</p>
              </div>
            </Link>
          ))}
          {!loading && relatedVideos.length === 0 && <p className="text-muted">No related videos found</p>}
        </div>
      </aside>
    </div>
  );
};

export default VideoDetail;

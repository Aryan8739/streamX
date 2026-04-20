import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import './VideoCard.css';

const VideoCard = ({ video }) => {
  return (
    <div className="video-card">
      <Link to={`/video/${video._id}`} className="thumbnail-wrapper">
        <img src={video.thumbnail} alt={video.title} className="thumbnail" />
        <span className="duration">{Math.floor(video.duration / 60)}:{String(Math.floor(video.duration % 60)).padStart(2, '0')}</span>
      </Link>
      
      <div className="video-info">
        <Link to={`/profile/${video.owner?.username}`} className="owner-avatar">
          <img src={video.owner?.avatar} alt={video.owner?.username} />
        </Link>
        
        <div className="video-details">
          <Link to={`/video/${video._id}`}>
            <h3 className="video-title">{video.title}</h3>
          </Link>
          <Link to={`/profile/${video.owner?.username}`} className="owner-name">
            {video.owner?.username}
          </Link>
          <div className="video-stats">
            <span>{video.views} views</span>
            <span className="dot">•</span>
            <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;

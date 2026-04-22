import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageSquare, Repeat2, Trash2, Edit3 } from 'lucide-react';
import './TweetCard.css';

const TweetCard = ({ tweet, isOwner, onDelete, onEdit }) => {
  return (
    <div className="tweet-card glass">
      <div className="tweet-header">
        <img src={tweet.owner?.avatar} alt={tweet.owner?.username} className="tweet-avatar" />
        <div className="tweet-user-info">
          <span className="tweet-name">{tweet.owner?.fullName || tweet.owner?.username}</span>
          <span className="tweet-username">@{tweet.owner?.username}</span>
          <span className="tweet-dot">•</span>
          <span className="tweet-time">
            {tweet.createdAt ? formatDistanceToNow(new Date(tweet.createdAt)) + ' ago' : 'Just now'}
          </span>
        </div>
        {isOwner && (
          <div className="tweet-actions-owner">
            <button className="icon-btn edit" onClick={() => onEdit(tweet)} title="Edit">
              <Edit3 size={16} />
            </button>
            <button className="icon-btn delete" onClick={() => onDelete(tweet._id)} title="Delete">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
      
      <div className="tweet-content">
        <p>{tweet.content}</p>
      </div>

      <div className="tweet-footer">
        <button className="tweet-stat">
          <MessageSquare size={18} />
          <span>0</span>
        </button>
        <button className="tweet-stat">
          <Repeat2 size={18} />
          <span>0</span>
        </button>
        <button className="tweet-stat">
          <Heart size={18} />
          <span>0</span>
        </button>
      </div>
    </div>
  );
};

export default TweetCard;

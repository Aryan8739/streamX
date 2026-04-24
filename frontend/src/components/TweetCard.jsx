import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageSquare, Trash2, Edit3, CheckCircle, Send, X } from 'lucide-react';
import apiClient from '../api/client';
import './TweetCard.css';

const TweetCard = ({ tweet, isOwner, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(tweet.content);
  const [isLiked, setIsLiked] = useState(false); // Backend should ideally provide this
  const [likesCount, setLikesCount] = useState(0); // Backend should ideally provide this
  const [loading, setLoading] = useState(false);

  // Handle both owner patterns from different endpoints
  const owner = tweet.ownerDetails || tweet.owner;

  const handleEdit = async () => {
    if (!editContent.trim()) return;
    setLoading(true);
    try {
      await apiClient.patch(`/tweets/${tweet._id}`, { content: editContent });
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      alert('Failed to update tweet');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLike = async () => {
    try {
      const res = await apiClient.post(`/likes/toggle/t/${tweet._id}`);
      setIsLiked(res.data.isLiked);
      setLikesCount(prev => res.data.isLiked ? prev + 1 : prev - 1);
    } catch (err) {
      console.error('Like toggle failed', err);
    }
  };

  return (
    <div className="tweet-card glass">
      <div className="tweet-header">
        <img src={owner?.avatar} alt={owner?.username} className="tweet-avatar" />
        <div className="tweet-user-info">
          <div className="tweet-name-wrapper">
             <span className="tweet-name">{owner?.fullname || owner?.fullName || owner?.username}</span>
             <CheckCircle size={14} className="verified-icon" />
          </div>
          <span className="tweet-username">@{owner?.username}</span>
          <span className="tweet-dot">•</span>
          <span className="tweet-time">
            {tweet.createdAt ? formatDistanceToNow(new Date(tweet.createdAt)) + ' ago' : 'Just now'}
          </span>
        </div>
        {isOwner && !isEditing && (
          <div className="tweet-actions-owner">
            <button className="icon-btn edit" onClick={() => setIsEditing(true)}>
              <Edit3 size={16} />
            </button>
            <button className="icon-btn delete" onClick={() => onDelete(tweet._id)}>
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
      
      <div className="tweet-content">
        {isEditing ? (
          <div className="tweet-edit-container">
            <textarea 
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="tweet-edit-input"
              autoFocus
            />
            <div className="edit-actions">
              <button className="btn-icon-cancel" onClick={() => setIsEditing(false)} disabled={loading}>
                <X size={18} />
              </button>
              <button className="btn-icon-save" onClick={handleEdit} disabled={loading || !editContent.trim()}>
                <Send size={18} />
              </button>
            </div>
          </div>
        ) : (
          <p>{tweet.content}</p>
        )}
      </div>

      <div className="tweet-footer">
        <button className="tweet-stat">
          <MessageSquare size={18} />
          <span>0</span>
        </button>
        <button 
          className={`tweet-stat like-btn ${isLiked ? 'active' : ''}`}
          onClick={handleToggleLike}
        >
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
          <span>{likesCount}</span>
        </button>
      </div>
    </div>
  );
};

export default TweetCard;

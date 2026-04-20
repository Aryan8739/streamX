import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Send, MoreVertical, Trash2 } from 'lucide-react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import './CommentSection.css';

const CommentSection = ({ videoId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const response = await apiClient.get(`/comments/v/${videoId}`);
      setComments(response.data.docs || []);
    } catch (err) {
      console.error('Failed to fetch comments', err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await apiClient.post(`/comments/v/${videoId}`, { content: newComment });
      setNewComment('');
      fetchComments();
    } catch (err) {
      console.error('Failed to post comment', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await apiClient.delete(`/comments/c/${commentId}`);
      fetchComments();
    } catch (err) {
      console.error('Failed to delete comment', err);
    }
  };

  return (
    <div className="comments-container">
      <h3 className="comments-count">{comments.length} Comments</h3>
      
      {user && (
        <form className="comment-form" onSubmit={handleSubmit}>
          <img src={user.avatar} alt={user.username} className="user-avatar-sm" />
          <div className="input-field">
            <input 
              type="text" 
              placeholder="Add a comment..." 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit" disabled={loading || !newComment.trim()}>
              <Send size={18} />
            </button>
          </div>
        </form>
      )}

      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment._id} className="comment-item">
            <img src={comment.owner?.avatar} alt={comment.owner?.username} className="user-avatar-sm" />
            <div className="comment-content">
              <div className="comment-header">
                <span className="comment-author">@{comment.owner?.username}</span>
                <span className="comment-date">
                  {formatDistanceToNow(new Date(comment.createdAt))} ago
                </span>
              </div>
              <p className="comment-text">{comment.content}</p>
            </div>
            {user?._id === comment.owner?._id && (
              <button 
                className="delete-comment-btn"
                onClick={() => handleDelete(comment._id)}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;

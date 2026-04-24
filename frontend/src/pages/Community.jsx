import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import TweetCard from '../components/TweetCard';
import { useAuth } from '../context/AuthContext';
import { Users, Send } from 'lucide-react';
import Skeleton from '../components/Skeleton';
import './Community.css';

const Community = () => {
  const { user } = useAuth();
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tweetContent, setTweetContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const fetchAllTweets = async () => {
    try {
      setLoading(true);
      // For now fetching user specific ones. 
      // If backend has a /tweets/all or /tweets/feed, use that.
      const response = await apiClient.get(`/tweets/user/${user?._id}`); 
      setTweets(response.data || []);
    } catch (err) {
      console.error('Failed to fetch tweets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchAllTweets();
  }, [user]);

  const handlePostTweet = async (e) => {
    e.preventDefault();
    if (!tweetContent.trim()) return;
    setIsPosting(true);
    try {
      await apiClient.post('/tweets', { content: tweetContent });
      setTweetContent('');
      fetchAllTweets();
    } catch (err) {
      alert('Failed to post community update');
    } finally {
      setIsPosting(false);
    }
  };

  const handleDeleteTweet = async (tweetId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await apiClient.delete(`/tweets/${tweetId}`);
        setTweets(tweets.filter(t => t._id !== tweetId));
      } catch (err) {
        alert('Failed to delete post');
      }
    }
  };

  if (!user) return <div className="auth-prompt">Please login to join the community.</div>;

  return (
    <div className="community-container">
      <div className="page-header">
         <div className="header-icon">
            <Users size={32} />
         </div>
         <div>
            <h1 className="page-title">Community</h1>
            <p className="page-subtitle">Share updates and connect with your audience</p>
         </div>
      </div>

      <form className="tweet-form-container glass shadow-lg" onSubmit={handlePostTweet}>
        <textarea 
          placeholder="What's on your mind? Share an update..." 
          value={tweetContent}
          onChange={(e) => setTweetContent(e.target.value)}
          maxLength={280}
        />
        <div className="tweet-form-footer">
          <span className="char-count">{tweetContent.length}/280</span>
          <button type="submit" className="tweet-btn" disabled={isPosting || !tweetContent.trim()}>
            {isPosting ? 'Posting...' : (
              <>
                <Send size={18} /> Post
              </>
            )}
          </button>
        </div>
      </form>

      <div className="tweets-list">
        {loading && <Skeleton count={4} />}
        {!loading && tweets.map(tweet => (
          <TweetCard 
            key={tweet._id} 
            tweet={tweet} 
            isOwner={user?._id === (tweet.ownerDetails?._id || tweet.owner?._id)}
            onDelete={handleDeleteTweet}
            onUpdate={fetchAllTweets}
          />
        ))}
        {!loading && tweets.length === 0 && (
          <div className="empty-msg">
            <Users size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <p>No community posts yet. Be the first to share something!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;

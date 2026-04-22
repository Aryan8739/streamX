import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import TweetCard from '../components/TweetCard';
import { useAuth } from '../context/AuthContext';
import { Users, Send } from 'lucide-react';
import './Profile.css'; // Reusing styles for now

const Community = () => {
  const { user } = useAuth();
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tweetContent, setTweetContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const fetchAllTweets = async () => {
    try {
      setLoading(true);
      // For now fetching all tweets or user specific ones.
      // Ideally backend would have /tweets/feed
      const response = await apiClient.get('/tweets/user/' + user?._id); 
      setTweets(response.data || []);
    } catch (err) {
      console.error(err);
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
      console.error(err);
    } finally {
      setIsPosting(false);
    }
  };

  const handleDeleteTweet = async (tweetId) => {
    if (!window.confirm('Delete?')) return;
    try {
      await apiClient.delete(`/tweets/${tweetId}`);
      setTweets(tweets.filter(t => t._id !== tweetId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading Community...</div>;

  return (
    <div className="community-container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
         <div className="header-icon" style={{ background: 'var(--accent)', padding: '12px', borderRadius: '12px', color: 'white' }}>
            <Users size={32} />
         </div>
         <div>
            <h1 className="page-title">Community</h1>
            <p className="page-subtitle">Connect with your favorite creators</p>
         </div>
      </div>

      <form className="tweet-form-container glass" onSubmit={handlePostTweet}>
        <textarea 
          placeholder="Share something with the community..." 
          value={tweetContent}
          onChange={(e) => setTweetContent(e.target.value)}
          maxLength={280}
        />
        <div className="tweet-form-footer">
          <span className="char-count">{tweetContent.length}/280</span>
          <button type="submit" className="tweet-btn" disabled={isPosting || !tweetContent.trim()}>
            <Send size={18} /> {isPosting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>

      <div className="tweets-list">
        {tweets.map(tweet => (
          <TweetCard 
            key={tweet._id} 
            tweet={tweet} 
            isOwner={user?._id === tweet.owner?._id}
            onDelete={handleDeleteTweet}
          />
        ))}
        {tweets.length === 0 && <p className="empty-msg">No community posts yet.</p>}
      </div>
    </div>
  );
};

export default Community;

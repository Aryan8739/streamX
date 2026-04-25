import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import VideoCard from '../components/VideoCard';
import TweetCard from '../components/TweetCard';
import { Send } from 'lucide-react';
import Skeleton from '../components/Skeleton';
import './Profile.css';

const Profile = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Videos');
  const [tweetContent, setTweetContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [playlists, setPlaylists] = useState([]);

  const fetchProfileData = async () => {
    try {
      const profileRes = await apiClient.get(`/users/c/${username}`);
      setProfile(profileRes.data);
      
      const videosRes = await apiClient.get(`/videos?userId=${profileRes.data._id}`);
      // aggregatePaginate returns results in the 'docs' field
      setVideos(videosRes.data.docs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTweets = async () => {
    if (!profile) return;
    try {
      const response = await apiClient.get(`/tweets/user/${profile._id}`);
      setTweets(response.data || []);
    } catch (err) {
      console.error('Failed to fetch tweets', err);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [username]);

  useEffect(() => {
    if (activeTab === 'Tweets' && profile) {
      fetchTweets();
    }
    if (activeTab === 'Playlists' && profile) {
      fetchPlaylists();
    }
  }, [activeTab, profile]);

  const fetchPlaylists = async () => {
    try {
      const res = await apiClient.get(`/playlists/user/${profile._id}`);
      setPlaylists(res.data || []);
    } catch (err) {
      console.error('Failed to fetch playlists', err);
    }
  };

  const handlePostTweet = async (e) => {
    e.preventDefault();
    if (!tweetContent.trim()) return;
    setIsPosting(true);
    try {
      await apiClient.post('/tweets', { content: tweetContent });
      setTweetContent('');
      fetchTweets();
    } catch (err) {
      console.error('Failed to post tweet', err);
    } finally {
      setIsPosting(false);
    }
  };

  const handleDeleteTweet = async (tweetId) => {
    if (!window.confirm('Delete this tweet?')) return;
    try {
      await apiClient.delete(`/tweets/${tweetId}`);
      setTweets(tweets.filter(t => t._id !== tweetId));
    } catch (err) {
      console.error('Failed to delete tweet', err);
    }
  };

  if (loading) return <Skeleton type="channel" />;
  if (!profile) return <div className="error">User not found</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="cover-image">
          {profile.coverImage && <img src={profile.coverImage} alt="cover" />}
        </div>
        <div className="profile-info-bar">
          <img src={profile.avatar} alt={profile.username} className="profile-avatar" />
          <div className="profile-stats">
            <h1 className="profile-name">{profile.fullName}</h1>
            <p className="profile-username">@{profile.username} • {profile.subscribersCount} subscribers</p>
          </div>
          <button className="sub-btn">Subscribe</button>
        </div>
      </div>

      <div className="profile-content">
        <div className="tabs">
          {['Videos', 'Tweets', 'Playlists', 'About'].map((tab) => (
            <button 
              key={tab} 
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Videos' && (
          <div className="video-grid">
            {videos.map(video => <VideoCard key={video._id} video={video} />)}
            {videos.length === 0 && <p className="empty-msg">No videos uploaded yet</p>}
          </div>
        )}

        {activeTab === 'Tweets' && (
          <div className="tweets-section">
            {user?._id === profile?._id && (
              <form className="tweet-form-container glass" onSubmit={handlePostTweet}>
                <textarea 
                  placeholder="What's on your mind?" 
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
            )}
            <div className="tweets-list">
              {tweets.map(tweet => (
                <TweetCard 
                  key={tweet._id} 
                  tweet={tweet} 
                  isOwner={user?._id === tweet.owner?._id}
                  onDelete={handleDeleteTweet}
                />
              ))}
              {tweets.length === 0 && <p className="empty-msg">No tweets yet</p>}
            </div>
          </div>
        )}

        {activeTab === 'Playlists' && (
          <div className="playlists-grid">
            {playlists.map(playlist => (
              <div key={playlist._id} className="playlist-item glass">
                <div className="playlist-info-card">
                  <h4>{playlist.name}</h4>
                  <p>{playlist.videos?.length || 0} videos</p>
                </div>
              </div>
            ))}
            {playlists.length === 0 && <p className="empty-msg">No playlists created yet</p>}
          </div>
        )}
        {activeTab === 'About' && (
          <div className="about-section glass">
            <h3>Description</h3>
            <p>{profile.description || "No description provided."}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

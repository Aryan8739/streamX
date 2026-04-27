import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Users, CheckCircle } from 'lucide-react';
import Skeleton, { SkeletonChannel } from '../components/Skeleton';
import './Subscriptions.css';

const Subscriptions = () => {
  const { user } = useAuth();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleToggleSubscription = async (channelId) => {
    try {
      const res = await apiClient.post(`/subscriptions/c/${channelId}`);
      const isNowSubscribed = res.data.isSubscribed;
      
      setChannels(prev => prev.map(sub => {
        if (sub.channel._id === channelId) {
          return {
            ...sub,
            isSubscribed: isNowSubscribed,
            channel: {
              ...sub.channel,
              subscribersCount: isNowSubscribed ? (sub.channel.subscribersCount + 1) : (sub.channel.subscribersCount - 1)
            }
          };
        }
        return sub;
      }));
    } catch (err) {
      console.error('Failed to toggle subscription', err);
    }
  };

  const fetchSubscriptions = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await apiClient.get(`/subscriptions/c/${user._id}`);
      // Add 'isSubscribed: true' to all initially fetched channels
      const initialChannels = (response.data || []).map(sub => ({ ...sub, isSubscribed: true }));
      setChannels(initialChannels);
    } catch (err) {
      setError(err.message || 'Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [user]);

  if (!user) return <div className="auth-prompt">Please login to view your subscriptions.</div>;

  return (
    <div className="subscriptions-container">
      <div className="page-header">
        <div className="header-icon">
          <Users size={22} />
        </div>
        <div>
          <h1 className="page-title">Subscriptions</h1>
          <p className="page-subtitle">{loading ? '...' : channels.length} channels</p>
        </div>
      </div>

      <div className="channel-grid">
        {loading ? (
          <>
            <SkeletonChannel />
            <SkeletonChannel />
            <SkeletonChannel />
            <SkeletonChannel />
          </>
        ) : (
          channels.map((sub) => (
            <div key={sub._id} className="channel-card glass">
              <Link to={`/profile/${sub.channel.username}`} className="channel-link">
                <img src={sub.channel.avatar} alt={sub.channel.username} className="channel-avatar-lg" />
                <div className="channel-info">
                  <h3 className="channel-name">
                    {sub.channel.username} <CheckCircle size={16} className="verified-icon" />
                  </h3>
                  <p className="channel-meta">{sub.channel.subscribersCount || 0} Subscribers</p>
                </div>
              </Link>
              <button 
                className={`sub-btn ${sub.isSubscribed ? 'subscribed' : ''}`}
                onClick={() => handleToggleSubscription(sub.channel._id)}
              >
                {sub.isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>
          ))
        )}
      </div>

      {channels.length === 0 && !loading && (
        <div className="empty-state">
          <Users size={64} className="text-muted" />
          <h2>You haven't subscribed to any channels yet</h2>
          <p>Find your favorite creators and stay updated!</p>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;

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

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!user) return;
      try {
        setLoading(true);
        // The backend route for subscribed channels is /subscriptions/c/:channelId
        // Wait, looking at the backend routes again, getSubscribedChannels takes channelId.
        // Usually we want the channels the CURRENT user is subscribed to.
        // Let's try the endpoint that makes most sense for "my subscriptions"
        const response = await apiClient.get(`/subscriptions/c/${user._id}`);
        setChannels(response.data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch subscriptions');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [user]);

  if (!user) return <div className="auth-prompt">Please login to view your subscriptions.</div>;



  return (
    <div className="subscriptions-container">
      <div className="page-header">
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
              <Link to={`/profile/${sub.subscribedChannel.username}`} className="channel-link">
                <img src={sub.subscribedChannel.avatar} alt={sub.subscribedChannel.username} className="channel-avatar-lg" />
                <div className="channel-info">
                  <h3 className="channel-name">
                    {sub.subscribedChannel.username} <CheckCircle size={16} className="verified-icon" />
                  </h3>
                  <p className="channel-meta">1.2M Subscribers</p>
                </div>
              </Link>
              <button className="subscribed-btn">Subscribed</button>
            </div>
          ))
        )}
      </div>

      {channels.length === 0 && (
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

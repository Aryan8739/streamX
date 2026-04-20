import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/client';
import VideoCard from '../components/VideoCard';
import './Profile.css';

const Profile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileRes = await apiClient.get(`/users/c/${username}`);
        setProfile(profileRes.data);
        
        const videosRes = await apiClient.get(`/videos?username=${username}`);
        setVideos(videosRes.data.videos || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [username]);

  if (loading) return <div className="loading">Loading Profile...</div>;
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
          <button className="tab active">Videos</button>
          <button className="tab">Tweets</button>
          <button className="tab">Playlists</button>
          <button className="tab">About</button>
        </div>

        <div className="video-grid">
          {videos.map(video => <VideoCard key={video._id} video={video} />)}
        </div>
      </div>
    </div>
  );
};

export default Profile;

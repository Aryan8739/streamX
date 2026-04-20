import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderHeart, Plus, MoreVertical } from 'lucide-react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Playlists.css';

const Playlists = () => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/playlists/user/${user?._id}`);
      setPlaylists(response.data || []);
    } catch (err) {
      console.error('Failed to fetch playlists', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchPlaylists();
  }, [user]);

  if (!user) return <div className="auth-prompt">Please login to view your playlists.</div>;

  return (
    <div className="playlists-container">
      <div className="playlists-header">
        <h1 className="page-title">Library</h1>
        <button className="btn-add-playlist">
          <Plus size={20} /> New Playlist
        </button>
      </div>

      <div className="playlist-grid">
        {playlists.map((playlist) => (
          <div key={playlist._id} className="playlist-card glass">
            <Link to={`/playlist/${playlist._id}`} className="playlist-thumbnail">
              <div className="thumbnail-stack">
                <FolderHeart size={48} className="placeholder-icon" />
                <div className="video-count">
                  <span>{playlist.videos?.length || 0} videos</span>
                </div>
              </div>
            </Link>
            <div className="playlist-info">
              <div className="info-main">
                <Link to={`/playlist/${playlist._id}`}>
                  <h3 className="playlist-title">{playlist.name}</h3>
                </Link>
                <p className="playlist-desc">{playlist.description}</p>
              </div>
              <button className="icon-btn">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>
        ))}

        {playlists.length === 0 && !loading && (
          <div className="empty-state">
            <FolderHeart size={64} className="text-muted" />
            <h2>No playlists yet</h2>
            <p>Start organizing your favorite videos into playlists.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Playlists;

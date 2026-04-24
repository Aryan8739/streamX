import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderHeart, Plus, MoreVertical, Edit3, Trash2 } from 'lucide-react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import PlaylistModal from '../components/PlaylistModal';
import Skeleton from '../components/Skeleton';
import './Playlists.css';

const Playlists = () => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

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

  const handleDelete = async (playlistId) => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      try {
        await apiClient.delete(`/playlists/${playlistId}`);
        setPlaylists(playlists.filter(p => p._id !== playlistId));
      } catch (err) {
        alert('Failed to delete playlist');
      }
    }
  };

  const openEditModal = (playlist) => {
    setSelectedPlaylist(playlist);
    setIsModalOpen(true);
    setActiveMenu(null);
  };

  const openCreateModal = () => {
    setSelectedPlaylist(null);
    setIsModalOpen(true);
  };

  if (!user) return <div className="auth-prompt">Please login to view your playlists.</div>;

  return (
    <div className="playlists-container">
      <div className="playlists-header">
        <h1 className="page-title">Library</h1>
        <button className="btn-add-playlist" onClick={openCreateModal}>
          <Plus size={20} /> New Playlist
        </button>
      </div>

      <div className="playlist-grid">
        {loading ? (
          <Skeleton type="video" count={6} />
        ) : (
          playlists.map((playlist) => (
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
                  <p className="playlist-desc truncate-2">{playlist.description}</p>
                </div>
                <div className="card-actions">
                  <button 
                    className="icon-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu(activeMenu === playlist._id ? null : playlist._id);
                    }}
                  >
                    <MoreVertical size={18} />
                  </button>
                  
                  {activeMenu === playlist._id && (
                    <div className="actions-menu glass shadow-lg">
                      <button className="action-item" onClick={() => openEditModal(playlist)}>
                        <Edit3 size={16} /> Edit
                      </button>
                      <button className="action-item delete" onClick={() => handleDelete(playlist._id)}>
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {playlists.length === 0 && !loading && (
        <div className="empty-state">
          <FolderHeart size={64} className="text-muted" />
          <h2>No playlists yet</h2>
          <p>Start organizing your favorite videos into playlists.</p>
        </div>
      )}

      <PlaylistModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        playlist={selectedPlaylist}
        onUpdate={fetchPlaylists}
      />
    </div>
  );
};


export default Playlists;

import React, { useState, useEffect } from 'react';
import { X, Plus, FolderPlus } from 'lucide-react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import './AddToPlaylistModal.css';

const AddToPlaylistModal = ({ isOpen, onClose, videoId }) => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({ name: '', description: '' });

  const fetchPlaylists = async () => {
    try {
      const response = await apiClient.get(`/playlists/user/${user?._id}`);
      setPlaylists(response.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen && user) fetchPlaylists();
  }, [isOpen, user]);

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await apiClient.patch(`/playlists/add/${videoId}/${playlistId}`);
      onClose();
      alert('Added to playlist!');
    } catch (err) {
      console.error(err);
      alert('Already in playlist or failed to add');
    }
  };

  const handleCreateAndAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiClient.post('/playlists', newPlaylist);
      await handleAddToPlaylist(response.data._id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="playlist-modal glass">
        <div className="modal-header">
          <h3>Save to Playlist</h3>
          <button onClick={onClose} className="close-btn"><X size={20} /></button>
        </div>

        <div className="playlists-selection">
          {playlists.map((playlist) => (
            <button 
              key={playlist._id} 
              className="playlist-option"
              onClick={() => handleAddToPlaylist(playlist._id)}
            >
              <FolderPlus size={18} />
              <span>{playlist.name}</span>
            </button>
          ))}
        </div>

        <div className="modal-divider"></div>

        {!isCreating ? (
          <button className="btn-new-playlist" onClick={() => setIsCreating(true)}>
            <Plus size={18} /> Create new playlist
          </button>
        ) : (
          <form className="create-playlist-form" onSubmit={handleCreateAndAdd}>
            <input 
              type="text" 
              placeholder="Name" 
              required
              value={newPlaylist.name}
              onChange={(e) => setNewPlaylist({...newPlaylist, name: e.target.value})}
            />
            <textarea 
              placeholder="Description"
              value={newPlaylist.description}
              onChange={(e) => setNewPlaylist({...newPlaylist, description: e.target.value})}
            ></textarea>
            <div className="form-actions">
              <button type="button" onClick={() => setIsCreating(false)}>Cancel</button>
              <button type="submit" className="accent" disabled={loading}>Create & Add</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddToPlaylistModal;

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import apiClient from '../api/client';
import './UploadModal.css'; // Reusing modal styles

const PlaylistModal = ({ isOpen, onClose, playlist, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (playlist) {
      setFormData({
        name: playlist.name || '',
        description: playlist.description || '',
      });
    } else {
      setFormData({ name: '', description: '' });
    }
  }, [playlist, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (playlist) {
        // Update existing playlist
        await apiClient.patch(`/playlists/${playlist._id}`, formData);
      } else {
        // Create new playlist
        await apiClient.post('/playlists', formData);
      }
      onUpdate();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="upload-modal glass">
        <div className="modal-header">
          <h2>{playlist ? 'Edit Playlist' : 'New Playlist'}</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="input-group">
            <label>Title</label>
            <input 
              type="text" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. My Favorite Chill Beats"
            />
          </div>

          <div className="input-group">
            <label>Description</label>
            <textarea 
              rows="4"
              required 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What's this playlist about?"
            ></textarea>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Processing...' : (playlist ? 'Save Changes' : 'Create Playlist')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlaylistModal;

import React, { useState } from 'react';
import { X, Upload, Film, Image as ImageIcon } from 'lucide-react';
import apiClient from '../api/client';
import './UploadModal.css';

const UploadModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    if (videoFile) data.append('videoFile', videoFile);
    if (thumbnail) data.append('thumbnail', thumbnail);

    try {
      await apiClient.post('/videos', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onClose();
      window.location.reload(); // Refresh to see new video
    } catch (err) {
      setError(err.message || 'Failed to upload video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="upload-modal glass">
        <div className="modal-header">
          <h2>Upload Video</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="upload-grid">
            <div className="upload-left">
              <div className="file-input-wrapper">
                <div className="file-drop-zone">
                  <Film size={40} className="accent-text" />
                  <p>{videoFile ? videoFile.name : 'Select Video File'}</p>
                  <input 
                    type="file" 
                    accept="video/*" 
                    required 
                    onChange={(e) => setVideoFile(e.target.files[0])} 
                  />
                </div>
              </div>

              <div className="file-input-wrapper">
                <div className="file-drop-zone thumbnail-zone">
                  <ImageIcon size={32} />
                  <p>{thumbnail ? thumbnail.name : 'Select Thumbnail'}</p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    required 
                    onChange={(e) => setThumbnail(e.target.files[0])} 
                  />
                </div>
              </div>
            </div>

            <div className="upload-right">
              <div className="input-group">
                <label>Title</label>
                <input 
                  type="text" 
                  required 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter a catchy title"
                />
              </div>

              <div className="input-group">
                <label>Description</label>
                <textarea 
                  rows="5"
                  required 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What's your video about?"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Uploading...' : 'Publish Video'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;

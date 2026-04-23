import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import apiClient from '../api/client';
import './UploadModal.css';

const EditVideoModal = ({ isOpen, onClose, video, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (video) {
      setFormData({
        title: video.title || '',
        description: video.decription || video.description || '',
      });
      setPreview(video.thumbnail);
    }
  }, [video]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    if (thumbnail) data.append('thumbnail', thumbnail);

    try {
      await apiClient.patch(`/videos/${video._id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onUpdate();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update video');
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="upload-modal glass">
        <div className="modal-header">
          <h2>Edit Video</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="upload-grid">
            <div className="upload-left">
              <label className="input-label">Update Thumbnail</label>
              <div className="file-input-wrapper">
                <div className="file-drop-zone thumbnail-zone">
                  {preview ? (
                    <div className="thumbnail-preview">
                      <img src={preview} alt="preview" />
                    </div>
                  ) : (
                    <>
                      <ImageIcon size={32} className="text-muted" />
                      <p>Select Thumbnail</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleThumbnailChange} 
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
                  placeholder="Enter video title"
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
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVideoModal;

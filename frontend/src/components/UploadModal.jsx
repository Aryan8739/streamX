import React, { useState } from 'react';
import { X, Upload, Film, Image as ImageIcon } from 'lucide-react';
import apiClient from '../api/client';
import { useToast } from '../context/ToastContext';
import './UploadModal.css';

const UploadModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile || !thumbnail) return toast.info('Please select both video and thumbnail');
    
    setLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('videoFile', videoFile);
    data.append('thumbnail', thumbnail);

    try {
      const toastId = toast.loading('Syncing with Cloudinary...');
      await apiClient.post('/videos', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Your video is live!', { id: toastId });
      onClose();
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      console.error('Upload Error Details:', err);
      toast.error(err.message || 'Upload failed. Please check files.', { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && onClose()}>
      <div className="upload-modal">
        <div className="modal-header">
          <div className="header-titles">
            <h2 className="modal-title">Publish Video</h2>
            <p className="modal-subtitle">Share your content with the world</p>
          </div>
          <button className="btn-cancel" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="upload-grid">
            <div className="upload-left">
              <div className={`file-drop-zone ${videoFile ? 'has-file' : ''}`}>
                <input 
                  type="file" 
                  accept="video/*" 
                  onChange={(e) => setVideoFile(e.target.files[0])} 
                />
                <div className="drop-zone-content">
                  <Film size={28} className="icon" />
                  <span>{videoFile ? videoFile.name : 'Choose Video File'}</span>
                </div>
              </div>

              <div className={`file-drop-zone thumbnail-zone ${thumbnail ? 'has-file' : ''}`}>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setThumbnail(e.target.files[0])} 
                />
                {thumbnail ? (
                  <img src={URL.createObjectURL(thumbnail)} alt="preview" className="thumbnail-preview" />
                ) : (
                  <div className="drop-zone-content">
                    <ImageIcon size={24} className="icon" />
                    <span>Select Thumbnail</span>
                  </div>
                )}
              </div>
            </div>

            <div className="upload-right">
              <div className="input-group">
                <label>Video Title</label>
                <input 
                  type="text" 
                  required 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="The best video ever..."
                  disabled={loading}
                />
              </div>

              <div className="input-group">
                <label>Description</label>
                <textarea 
                  rows="6"
                  required 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell your viewers about your video"
                  disabled={loading}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn-publish" disabled={loading}>
              {loading ? 'Processing...' : 'Publish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;

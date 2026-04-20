import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Trash2, FolderEdit } from 'lucide-react';
import apiClient from '../api/client';
import VideoCard from '../components/VideoCard';
import './PlaylistDetail.css';

const PlaylistDetail = () => {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPlaylistDetails = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/playlists/${playlistId}`);
      setPlaylist(response.data);
    } catch (err) {
      console.error('Failed to fetch playlist details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylistDetails();
  }, [playlistId]);

  const removeVideoFromPlaylist = async (videoId) => {
    if (!window.confirm('Remove this video from playlist?')) return;
    try {
      await apiClient.patch(`/playlists/remove/${videoId}/${playlistId}`);
      fetchPlaylistDetails();
    } catch (err) {
      console.error('Failed to remove video', err);
    }
  };

  if (loading) return <div className="loading">Loading Playlist...</div>;
  if (!playlist) return <div className="error-message">Playlist not found</div>;

  return (
    <div className="playlist-detail-page">
      <div className="playlist-sidebar glass">
        <div className="playlist-metadata">
          <div className="playlist-banner">
            <img src={playlist.videos[0]?.thumbnail || 'https://via.placeholder.com/640x360'} alt="banner" />
            <div className="play-all-overlay">
              <Play fill="white" size={48} />
              <span>Play All</span>
            </div>
          </div>
          <h1 className="playlist-name">{playlist.name}</h1>
          <div className="playlist-owner">@{playlist.owner?.username}</div>
          <div className="playlist-stats">
            <span>{playlist.videos?.length} videos</span>
            <span>Created {new Date(playlist.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="playlist-description">{playlist.description}</div>
          <div className="playlist-actions">
             <button className="action-btn circle"><FolderEdit size={20} /></button>
             <button className="action-btn circle"><Trash2 size={20} /></button>
          </div>
        </div>
      </div>

      <div className="playlist-videos-list">
        {playlist.videos?.map((video, index) => (
          <div key={video._id} className="playlist-video-item">
            <span className="index">{index + 1}</span>
            <div className="video-item-card">
              <VideoCard video={video} />
              <button 
                className="remove-btn" 
                onClick={() => removeVideoFromPlaylist(video._id)}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {playlist.videos?.length === 0 && (
          <div className="empty-playlist">
            <p>This playlist has no videos yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetail;

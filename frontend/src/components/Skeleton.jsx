import React from 'react';

export const SkeletonVideoCard = () => (
  <div className="skeleton-video-card">
    <div className="skeleton skeleton-thumbnail" />
    <div className="skeleton-info">
      <div className="skeleton skeleton-avatar" />
      <div className="skeleton-text-group">
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line short" />
      </div>
    </div>
  </div>
);

export const SkeletonStatCard = () => (
  <div className="skeleton skeleton-stat-card glass" />
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="table-container glass">
    <div className="skeleton-table-header skeleton" style={{ height: '40px', marginBottom: '10px' }} />
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="skeleton-table-row skeleton" style={{ height: '60px', marginBottom: '5px', opacity: 1 - (i * 0.1) }} />
    ))}
  </div>
);

export const SkeletonChannel = () => (
  <div className="profile-container skeleton-profile">
    <div className="profile-header">
      <div className="cover-image skeleton" style={{ height: '200px' }} />
      <div className="profile-info-bar">
        <div className="skeleton skeleton-avatar" style={{ width: '120px', height: '120px', border: '4px solid var(--background)' }} />
        <div className="profile-stats">
          <div className="skeleton skeleton-line" style={{ width: '200px', height: '24px', marginBottom: '8px' }} />
          <div className="skeleton skeleton-line short" style={{ width: '120px' }} />
        </div>
      </div>
    </div>
    <div className="profile-content">
      <div className="tabs">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="skeleton" style={{ width: '80px', height: '30px', borderRadius: '20px' }} />
        ))}
      </div>
      <div className="video-grid">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <SkeletonVideoCard key={i} />
        ))}
      </div>
    </div>
  </div>
);

export const SkeletonVideoList = ({ count = 8 }) => (
  <div className="loading-grid">
    {[...Array(count)].map((_, i) => (
      <SkeletonVideoCard key={i} />
    ))}
  </div>
);

const Skeleton = ({ type, count = 1 }) => {
  if (type === 'video') return <SkeletonVideoList count={count} />;
  if (type === 'stat') return <SkeletonStatCard />;
  if (type === 'channel') return <SkeletonChannel />;
  return <div className="skeleton" style={{ width: '100%', height: '20px' }} />;
};

export default Skeleton;

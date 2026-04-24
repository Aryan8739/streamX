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
  <div className="skeleton-channel glass" style={{ height: '200px', borderRadius: '16px' }}>
    <div className="skeleton skeleton-avatar" style={{ width: '80px', height: '80px', margin: '0 auto 1rem' }} />
    <div className="skeleton skeleton-line" style={{ width: '60%', margin: '0 auto 0.5rem' }} />
    <div className="skeleton skeleton-line short" style={{ width: '40%', margin: '0 auto' }} />
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
  return <div className="skeleton" style={{ width: '100%', height: '20px' }} />;
};

export default Skeleton;

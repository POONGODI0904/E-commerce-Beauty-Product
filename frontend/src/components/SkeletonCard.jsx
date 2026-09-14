import React from 'react';

const SkeletonCard = () => {
  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        padding: '0.75rem'
      }}
    >
      <div className="skeleton" style={{ width: '100%', paddingTop: '100%', borderRadius: 'var(--radius-md)', marginBottom: '0.8rem' }} />
      <div className="skeleton" style={{ height: '14px', width: '30%', marginBottom: '0.5rem' }} />
      <div className="skeleton" style={{ height: '20px', width: '85%', marginBottom: '0.8rem' }} />
      <div className="skeleton" style={{ height: '16px', width: '40%', marginBottom: '1rem' }} />
      <div className="skeleton" style={{ height: '36px', width: '100%', borderRadius: 'var(--radius-md)' }} />
    </div>
  );
};

export default SkeletonCard;

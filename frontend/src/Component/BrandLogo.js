import React from 'react';

function BrandLogo({ size = 28, fontSize = '1.5rem', style = {} }) {
  return (
    <div className="d-flex align-items-center" style={{ gap: 8, ...style }}>
      <span role="img" aria-label="restaurant" style={{ fontSize: size, color: 'var(--d-primary)' }}>🍽️</span>
      <span style={{
        fontWeight: 'bold',
        fontSize,
        color: 'var(--d-primary)',
        letterSpacing: 1,
        position: 'relative',
        lineHeight: 1.1
      }}>
        RestroBoard
        <span style={{
          display: 'block',
          height: '3px',
          width: '60%',
          background: 'var(--d-accent)',
          borderRadius: '2px',
          position: 'absolute',
          left: 0,
          bottom: '-6px',
          opacity: 0.7
        }}></span>
      </span>
    </div>
  );
}

export default BrandLogo; 
import React from 'react';
import './Style/spinner.css';

const Spinner = () => {
  return (
    <div className="x_spinner-overlay">
      <div className="x_progress-dots">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default Spinner;

import React from 'react';
import '../Style/x_app.css'; // Ensure this path is correct

const CustomSelect = () => {
  return (
    <div className="x_select-wrapper">
      <select className="x_custom-select form-control" defaultValue="">
        <option value="" disabled>
          Select organizer...
        </option>
        <option value="caltech">California Institute of Technology</option>
        <option value="harvard">GSAS Open Labs At Harvard</option>
        <option value="mit">Massachusetts Institute of Technology</option>
        <option value="uchicago">University of Chicago</option>
      </select>
    </div>
  );
};

export default CustomSelect;

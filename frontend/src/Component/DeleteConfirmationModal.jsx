import React from 'react';
import '../Style/Z_table.css';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="Z_deleteConf_overlay" onClick={onClose}>
      <div className="Z_deleteConf_modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="Z_deleteConf_title">Confirm Deletion</h3>
        <p className="Z_delete_conf_message">
          Are you sure you want to delete <strong>{itemName}</strong>? This action cannot be undone.
        </p>
        <div className="col-12 d-flex justify-content-center x_btn_main" style={{ marginTop: '2rem' }}>
          <button type="button" className="btn btn-secondary mx-2" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary mx-2" onClick={onConfirm}>
            Delete
          </button>
        </div>
        {/* <div className="Z_deleteConf_actions">
          <button onClick={onClose} className="Z_deleteConf_btn Z_deleteConf_btn--cancel">
            Cancel
          </button>
          <button onClick={onConfirm} className="Z_deleteConf_btn Z_deleteConf_btn--delete">
            Delete
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default DeleteConfirmationModal; 
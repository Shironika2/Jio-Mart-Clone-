import React from 'react';
import type { SignOutConfirmationProps} from "../../types";



const SignOutConfirmation: React.FC<SignOutConfirmationProps> = ({
  onConfirmSignOut,
  onCancelSignOut,
  isOpen,
}) => {
  if (!isOpen) return null; // Don't render if closed

  return (
    <div
      className="modal show"
      style={{
        display: 'block',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1050,
        width: '90%',
        maxWidth: '400px',
      }}
      tabIndex={-1}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Sign Out?</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onCancelSignOut}
            ></button>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to sign out?</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancelSignOut}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onConfirmSignOut}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignOutConfirmation;

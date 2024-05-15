import React from "react";
import "./Modal.css";

export const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? "open" : ""}`}>
      <div className="modal-content">
        <button onClick={onClose} className="modal-close-btn">
          Luk
        </button>
        <div className="modal-header">Employee Details</div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

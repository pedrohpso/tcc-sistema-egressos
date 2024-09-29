import React from 'react';
import './Modal.css';
import { IoCloseOutline } from 'react-icons/io5';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  isOpen: boolean;
}


const Modal: React.FC<ModalProps> = ({ children, onClose, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          <IoCloseOutline size={24} onClick={onClose} color='#00420c' />
        {children}
      </div>
    </div>
  );
};

export default Modal;

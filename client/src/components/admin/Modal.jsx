import { FiX } from 'react-icons/fi';
import './Modal.css';

const Modal = ({ title, onClose, children, wide }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className={`modal ${wide ? 'modal--wide' : ''}`} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
      <div className="modal__header">
        <h3>{title}</h3>
        <button aria-label="Close" onClick={onClose}><FiX size={20} /></button>
      </div>
      <div className="modal__body">{children}</div>
    </div>
  </div>
);

export default Modal;

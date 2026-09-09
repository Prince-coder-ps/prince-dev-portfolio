import Modal from './Modal';

const ConfirmDialog = ({ title = 'Are you sure?', message, onConfirm, onCancel, confirmLabel = 'Delete' }) => (
  <Modal title={title} onClose={onCancel}>
    <p style={{ color: 'var(--color-ink-soft)', marginBottom: '1.2rem' }}>{message}</p>
    <div className="admin-form__actions">
      <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
      <button
        className="btn btn-primary"
        style={{ background: 'var(--color-danger)' }}
        onClick={onConfirm}
      >
        {confirmLabel}
      </button>
    </div>
  </Modal>
);

export default ConfirmDialog;

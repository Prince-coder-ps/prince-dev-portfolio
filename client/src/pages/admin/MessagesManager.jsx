import { useState } from 'react';
import toast from 'react-hot-toast';
import useContent from '../../hooks/useContent';
import { getMessages, updateMessage, deleteMessage } from '../../services/content';
import { apiErrorMessage } from '../../services/api';
import AsyncState from '../../components/AsyncState';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const MessagesManager = () => {
  const { data, loading, error, refetch } = useContent(getMessages);
  const messages = data?.messages || [];
  const unreadCount = data?.unreadCount || 0;

  const [viewing, setViewing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const openMessage = async (m) => {
    setViewing(m);
    if (!m.read) {
      try {
        await updateMessage(m._id, { read: true });
        refetch();
      } catch {
        // non-critical
      }
    }
  };

  const toggleRead = async (m) => {
    try {
      await updateMessage(m._id, { read: !m.read });
      refetch();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMessage(toDelete._id);
      toast.success('Message deleted.');
      setToDelete(null);
      setViewing(null);
      refetch();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>Messages {unreadCount > 0 && <span className="pill pill--on">{unreadCount} unread</span>}</h1>
      </div>

      <AsyncState loading={loading} error={error} isEmpty={!loading && !error && messages.length === 0} emptyMessage="No messages yet.">
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Subject</th><th>Date</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m._id} style={{ fontWeight: m.read ? 400 : 600 }}>
                  <td>{m.name}</td>
                  <td>{m.email}</td>
                  <td>{m.subject || '—'}</td>
                  <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td><span className={`pill ${m.read ? 'pill--off' : 'pill--on'}`}>{m.read ? 'Read' : 'Unread'}</span></td>
                  <td>
                    <div className="data-table-actions">
                      <button onClick={() => openMessage(m)}>View</button>
                      <button onClick={() => toggleRead(m)}>{m.read ? 'Mark unread' : 'Mark read'}</button>
                      <button className="danger" onClick={() => setToDelete(m)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AsyncState>

      {viewing && (
        <Modal title={`Message from ${viewing.name}`} onClose={() => setViewing(null)}>
          <p><strong>Email:</strong> {viewing.email}</p>
          {viewing.phone && <p><strong>Phone:</strong> {viewing.phone}</p>}
          {viewing.subject && <p><strong>Subject:</strong> {viewing.subject}</p>}
          <p><strong>Sent:</strong> {new Date(viewing.createdAt).toLocaleString()}</p>
          <p style={{ marginTop: '1rem', whiteSpace: 'pre-wrap', color: 'var(--color-ink-soft)' }}>{viewing.message}</p>
          <div className="admin-form__actions">
            <button className="btn btn-outline" onClick={() => setToDelete(viewing)}>Delete</button>
            <a className="btn btn-primary" href={`mailto:${viewing.email}`}>Reply by Email</a>
          </div>
        </Modal>
      )}

      {toDelete && (
        <ConfirmDialog
          message={`Delete message from "${toDelete.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
};

export default MessagesManager;

import { useState } from 'react';
import toast from 'react-hot-toast';
import useContent from '../../hooks/useContent';
import { getAllCertificationsAdmin, createCertification, updateCertification, deleteCertification } from '../../services/content';
import { apiErrorMessage } from '../../services/api';
import AsyncState from '../../components/AsyncState';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const EMPTY = { name: '', issuer: '', date: '', credentialId: '', credentialUrl: '', description: '', order: 0, visible: true };

const CertificationsManager = () => {
  const { data, loading, error, refetch } = useContent(getAllCertificationsAdmin);
  const items = data?.items || [];

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const openNew = () => { setForm(EMPTY); setEditing('new'); };
  const openEdit = (c) => { setForm(c); setEditing(c); };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, order: Number(form.order) };
      if (editing === 'new') {
        await createCertification(payload);
        toast.success('Certification added.');
      } else {
        await updateCertification(editing._id, payload);
        toast.success('Certification updated.');
      }
      setEditing(null);
      refetch();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCertification(toDelete._id);
      toast.success('Deleted.');
      setToDelete(null);
      refetch();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>Certifications</h1>
        <button className="btn btn-primary" onClick={openNew}>+ New Certification</button>
      </div>

      <AsyncState loading={loading} error={error} isEmpty={!loading && !error && items.length === 0} emptyMessage="No certifications yet.">
        <DataTable
          rows={items}
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'issuer', label: 'Issuer' },
            { key: 'date', label: 'Date' },
            { key: 'visible', label: 'Status', render: (r) => <span className={`pill ${r.visible ? 'pill--on' : 'pill--off'}`}>{r.visible ? 'Visible' : 'Hidden'}</span> },
            {
              key: 'actions', label: '', render: (r) => (
                <div className="data-table-actions">
                  <button onClick={() => openEdit(r)}>Edit</button>
                  <button className="danger" onClick={() => setToDelete(r)}>Delete</button>
                </div>
              ),
            },
          ]}
        />
      </AsyncState>

      {editing && (
        <Modal title={editing === 'new' ? 'New Certification' : `Edit: ${editing.name}`} onClose={() => setEditing(null)}>
          <form className="admin-form" onSubmit={handleSave}>
            <label>Name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>Issuer
              <input name="issuer" value={form.issuer} onChange={handleChange} required />
            </label>
            <div className="admin-form__row">
              <label>Date / year
                <input name="date" value={form.date} onChange={handleChange} />
              </label>
              <label>Credential ID
                <input name="credentialId" value={form.credentialId} onChange={handleChange} />
              </label>
            </div>
            <label>Credential URL
              <input name="credentialUrl" value={form.credentialUrl} onChange={handleChange} />
            </label>
            <label>Description
              <textarea name="description" rows={2} value={form.description} onChange={handleChange} />
            </label>
            <label className="admin-form__checkbox">
              <input type="checkbox" name="visible" checked={form.visible} onChange={handleChange} /> Visible publicly
            </label>
            <div className="admin-form__actions">
              <button type="button" className="btn btn-outline" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        </Modal>
      )}

      {toDelete && (
        <ConfirmDialog
          message={`Delete certification "${toDelete.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
};

export default CertificationsManager;

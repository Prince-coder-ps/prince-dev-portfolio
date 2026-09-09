import { useState } from 'react';
import toast from 'react-hot-toast';
import useContent from '../../hooks/useContent';
import { getAllEducationAdmin, createEducation, updateEducation, deleteEducation } from '../../services/content';
import { apiErrorMessage } from '../../services/api';
import AsyncState from '../../components/AsyncState';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const EMPTY = { degree: '', institution: '', duration: '', status: '', scoreLabel: '', description: '', order: 0, visible: true };

const EducationManager = () => {
  const { data, loading, error, refetch } = useContent(getAllEducationAdmin);
  const items = data?.items || [];

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const openNew = () => { setForm(EMPTY); setEditing('new'); };
  const openEdit = (e) => { setForm(e); setEditing(e); };

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
        await createEducation(payload);
        toast.success('Education record added.');
      } else {
        await updateEducation(editing._id, payload);
        toast.success('Education record updated.');
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
      await deleteEducation(toDelete._id);
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
        <h1>Education</h1>
        <button className="btn btn-primary" onClick={openNew}>+ New Record</button>
      </div>

      <AsyncState loading={loading} error={error} isEmpty={!loading && !error && items.length === 0} emptyMessage="No education records yet.">
        <DataTable
          rows={items}
          columns={[
            { key: 'degree', label: 'Degree' },
            { key: 'institution', label: 'Institution' },
            { key: 'scoreLabel', label: 'Score' },
            { key: 'order', label: 'Order' },
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
        <Modal title={editing === 'new' ? 'New Education Record' : `Edit: ${editing.degree}`} onClose={() => setEditing(null)}>
          <form className="admin-form" onSubmit={handleSave}>
            <label>Degree
              <input name="degree" value={form.degree} onChange={handleChange} required />
            </label>
            <label>Institution
              <input name="institution" value={form.institution} onChange={handleChange} required />
            </label>
            <div className="admin-form__row">
              <label>Duration
                <input name="duration" value={form.duration} onChange={handleChange} placeholder="e.g. 2023–2027" />
              </label>
              <label>Status
                <input name="status" value={form.status} onChange={handleChange} placeholder="e.g. Pursuing" />
              </label>
            </div>
            <label>Score / grade
              <input name="scoreLabel" value={form.scoreLabel} onChange={handleChange} placeholder="e.g. CGPA: 7.4" />
            </label>
            <label>Description
              <textarea name="description" rows={3} value={form.description} onChange={handleChange} />
            </label>
            <label>Display order
              <input type="number" name="order" value={form.order} onChange={handleChange} />
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
          message={`Delete education record "${toDelete.degree}"?`}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
};

export default EducationManager;

import { useState } from 'react';
import toast from 'react-hot-toast';
import useContent from '../../hooks/useContent';
import { getAllSkillsAdmin, createSkill, updateSkill, deleteSkill } from '../../services/content';
import { apiErrorMessage } from '../../services/api';
import AsyncState from '../../components/AsyncState';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const CATEGORIES = ['Programming', 'Frontend', 'Backend', 'Databases', 'Tools', 'Concepts'];
const EMPTY = { name: '', category: 'Frontend', proficiency: 60, order: 0, visible: true };

const SkillsManager = () => {
  const { data, loading, error, refetch } = useContent(getAllSkillsAdmin);
  const items = data?.items || [];

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const openNew = () => { setForm(EMPTY); setEditing('new'); };
  const openEdit = (s) => { setForm(s); setEditing(s); };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, proficiency: Number(form.proficiency), order: Number(form.order) };
      if (editing === 'new') {
        await createSkill(payload);
        toast.success('Skill added.');
      } else {
        await updateSkill(editing._id, payload);
        toast.success('Skill updated.');
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
      await deleteSkill(toDelete._id);
      toast.success('Skill deleted.');
      setToDelete(null);
      refetch();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>Skills</h1>
        <button className="btn btn-primary" onClick={openNew}>+ New Skill</button>
      </div>

      <AsyncState loading={loading} error={error} isEmpty={!loading && !error && items.length === 0} emptyMessage="No skills yet.">
        <DataTable
          rows={items}
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'category', label: 'Category' },
            { key: 'proficiency', label: 'Proficiency', render: (r) => `${r.proficiency}%` },
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
        <Modal title={editing === 'new' ? 'New Skill' : `Edit: ${editing.name}`} onClose={() => setEditing(null)}>
          <form className="admin-form" onSubmit={handleSave}>
            <label>Name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>Category
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label>Proficiency (0–100)
              <input type="number" min="0" max="100" name="proficiency" value={form.proficiency} onChange={handleChange} />
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
          message={`Delete skill "${toDelete.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
};

export default SkillsManager;

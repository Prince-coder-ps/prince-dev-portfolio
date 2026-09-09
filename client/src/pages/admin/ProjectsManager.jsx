import { useState } from 'react';
import toast from 'react-hot-toast';
import useContent from '../../hooks/useContent';
import {
  getAllProjectsAdmin, createProject, updateProject, deleteProject, uploadProjectThumbnail,
} from '../../services/content';
import { apiErrorMessage } from '../../services/api';
import AsyncState from '../../components/AsyncState';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import '../../components/admin/DataTable.css';

const EMPTY = {
  title: '', slug: '', shortDescription: '', detailedDescription: '', problem: '', solution: '',
  technologies: '', features: '', githubUrl: '', liveUrl: '', category: 'Full Stack',
  featured: false, published: true, order: 0, year: '',
};

const ProjectsManager = () => {
  const { data, loading, error, refetch } = useContent(getAllProjectsAdmin);
  const projects = data?.items || [];

  const [editing, setEditing] = useState(null); // project object or 'new' or null
  const [form, setForm] = useState(EMPTY);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const openNew = () => { setForm(EMPTY); setThumbnailFile(null); setEditing('new'); };
  const openEdit = (p) => {
    setForm({
      ...p,
      technologies: (p.technologies || []).join(', '),
      features: (p.features || []).join('\n'),
    });
    setThumbnailFile(null);
    setEditing(p);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        technologies: form.technologies.split(',').map((t) => t.trim()).filter(Boolean),
        features: form.features.split('\n').map((t) => t.trim()).filter(Boolean),
      };

      let saved;
      if (editing === 'new') {
        saved = await createProject(payload);
        toast.success('Project created.');
      } else {
        saved = await updateProject(editing._id, payload);
        toast.success('Project updated.');
      }

      if (thumbnailFile) {
        await uploadProjectThumbnail(saved.project._id, thumbnailFile);
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
      await deleteProject(toDelete._id);
      toast.success('Project deleted.');
      setToDelete(null);
      refetch();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>Projects</h1>
        <button className="btn btn-primary" onClick={openNew}>+ New Project</button>
      </div>

      <AsyncState loading={loading} error={error} isEmpty={!loading && !error && projects.length === 0} emptyMessage="No projects yet.">
        <DataTable
          rows={projects}
          columns={[
            { key: 'title', label: 'Title' },
            { key: 'category', label: 'Category' },
            { key: 'order', label: 'Order' },
            { key: 'published', label: 'Status', render: (r) => <span className={`pill ${r.published ? 'pill--on' : 'pill--off'}`}>{r.published ? 'Published' : 'Hidden'}</span> },
            { key: 'featured', label: 'Featured', render: (r) => (r.featured ? 'Yes' : '—') },
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
        <Modal title={editing === 'new' ? 'New Project' : `Edit: ${editing.title}`} onClose={() => setEditing(null)} wide>
          <form className="admin-form" onSubmit={handleSave}>
            <label>Title
              <input name="title" value={form.title} onChange={handleChange} required />
            </label>
            <label>Slug (URL path, optional — auto-generated from title if left blank)
              <input name="slug" value={form.slug} onChange={handleChange} placeholder="e.g. saarthix" />
            </label>
            <label>Short description
              <textarea name="shortDescription" rows={2} value={form.shortDescription} onChange={handleChange} required />
            </label>
            <label>Detailed description
              <textarea name="detailedDescription" rows={3} value={form.detailedDescription} onChange={handleChange} />
            </label>
            <div className="admin-form__row">
              <label>Problem
                <textarea name="problem" rows={2} value={form.problem} onChange={handleChange} />
              </label>
              <label>Solution
                <textarea name="solution" rows={2} value={form.solution} onChange={handleChange} />
              </label>
            </div>
            <label>Features (one per line)
              <textarea name="features" rows={4} value={form.features} onChange={handleChange} />
            </label>
            <label>Technologies (comma-separated)
              <input name="technologies" value={form.technologies} onChange={handleChange} placeholder="React.js, Node.js, MongoDB" />
            </label>
            <div className="admin-form__row">
              <label>GitHub URL
                <input name="githubUrl" value={form.githubUrl} onChange={handleChange} />
              </label>
              <label>Live URL
                <input name="liveUrl" value={form.liveUrl} onChange={handleChange} />
              </label>
            </div>
            <div className="admin-form__row">
              <label>Category
                <select name="category" value={form.category} onChange={handleChange}>
                  <option>MERN Stack</option>
                  <option>Full Stack</option>
                  <option>Frontend</option>
                </select>
              </label>
              <label>Year
                <input name="year" value={form.year} onChange={handleChange} />
              </label>
            </div>
            <div className="admin-form__row">
              <label>Display order
                <input type="number" name="order" value={form.order} onChange={handleChange} />
              </label>
              <label>Thumbnail image
                <input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files[0])} />
              </label>
            </div>
            <label className="admin-form__checkbox">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} /> Featured project
            </label>
            <label className="admin-form__checkbox">
              <input type="checkbox" name="published" checked={form.published} onChange={handleChange} /> Published (visible publicly)
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
          message={`Are you sure you want to delete "${toDelete.title}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
};

export default ProjectsManager;

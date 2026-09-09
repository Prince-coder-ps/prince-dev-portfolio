import { useState } from 'react';
import toast from 'react-hot-toast';
import useContent from '../../hooks/useContent';
import { getAllGalleryAdmin, createGalleryItem, updateGalleryItem, deleteGalleryItem } from '../../services/content';
import { apiErrorMessage } from '../../services/api';
import AsyncState from '../../components/AsyncState';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import './GalleryManager.css';

const EMPTY = { title: '', description: '', category: 'General', featured: false, order: 0 };

const GalleryManager = () => {
  const { data, loading, error, refetch } = useContent(getAllGalleryAdmin);
  const items = data?.items || [];

  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please choose an image.');
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('image', file);
      await createGalleryItem(fd);
      toast.success('Gallery item added.');
      setCreating(false);
      setForm(EMPTY);
      setFile(null);
      refetch();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const toggleVisible = async (item) => {
    try {
      await updateGalleryItem(item._id, { visible: !item.visible });
      refetch();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteGalleryItem(toDelete._id);
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
        <h1>Gallery</h1>
        <button className="btn btn-primary" onClick={() => setCreating(true)}>+ Upload Image</button>
      </div>

      <AsyncState loading={loading} error={error} isEmpty={!loading && !error && items.length === 0} emptyMessage="No gallery images yet.">
        <div className="gallery-admin-grid">
          {items.map((g) => (
            <div className="gallery-admin-card" key={g._id}>
              <img src={g.image.url} alt={g.title} />
              <div>
                <strong>{g.title}</strong>
                <p>{g.category}</p>
                <div className="data-table-actions">
                  <button onClick={() => toggleVisible(g)}>{g.visible ? 'Hide' : 'Show'}</button>
                  <button className="danger" onClick={() => setToDelete(g)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AsyncState>

      {creating && (
        <Modal title="Upload Gallery Image" onClose={() => setCreating(false)}>
          <form className="admin-form" onSubmit={handleCreate}>
            <label>Title
              <input name="title" value={form.title} onChange={handleChange} required />
            </label>
            <label>Description
              <textarea name="description" rows={2} value={form.description} onChange={handleChange} />
            </label>
            <label>Category
              <input name="category" value={form.category} onChange={handleChange} />
            </label>
            <label>Image file
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} required />
            </label>
            <label className="admin-form__checkbox">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} /> Featured
            </label>
            <div className="admin-form__actions">
              <button type="button" className="btn btn-outline" onClick={() => setCreating(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Uploading…' : 'Upload'}</button>
            </div>
          </form>
        </Modal>
      )}

      {toDelete && (
        <ConfirmDialog
          message={`Delete gallery image "${toDelete.title}"?`}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
};

export default GalleryManager;

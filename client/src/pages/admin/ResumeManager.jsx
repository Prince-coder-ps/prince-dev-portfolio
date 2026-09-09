import { useState } from 'react';
import toast from 'react-hot-toast';
import useContent from '../../hooks/useContent';
import { getAllResumesAdmin, uploadResume, activateResume, deleteResume } from '../../services/content';
import { apiErrorMessage } from '../../services/api';
import AsyncState from '../../components/AsyncState';
import DataTable from '../../components/admin/DataTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const ResumeManager = () => {
  const { data, loading, error, refetch } = useContent(getAllResumesAdmin);
  const resumes = data?.resumes || [];
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please choose a PDF file.');
    setUploading(true);
    try {
      await uploadResume(file);
      toast.success('Resume uploaded and set as active.');
      setFile(null);
      refetch();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const handleActivate = async (id) => {
    try {
      await activateResume(id);
      toast.success('Resume activated.');
      refetch();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteResume(toDelete._id);
      toast.success('Resume deleted.');
      setToDelete(null);
      refetch();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>Resume</h1>
      </div>

      <form className="admin-form" onSubmit={handleUpload} style={{ maxWidth: 420, marginBottom: 'var(--space-4)' }}>
        <label>Upload new resume (PDF)
          <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
        </label>
        <button className="btn btn-primary" disabled={uploading} style={{ alignSelf: 'flex-start' }}>
          {uploading ? 'Uploading…' : 'Upload & Activate'}
        </button>
      </form>

      <AsyncState loading={loading} error={error} isEmpty={!loading && !error && resumes.length === 0} emptyMessage="No resume uploaded yet.">
        <DataTable
          rows={resumes}
          columns={[
            { key: 'originalName', label: 'File' },
            { key: 'active', label: 'Status', render: (r) => <span className={`pill ${r.active ? 'pill--on' : 'pill--off'}`}>{r.active ? 'Active' : 'Inactive'}</span> },
            { key: 'createdAt', label: 'Uploaded', render: (r) => new Date(r.createdAt).toLocaleDateString() },
            {
              key: 'actions', label: '', render: (r) => (
                <div className="data-table-actions">
                  <a href={r.fileUrl} target="_blank" rel="noreferrer"><button type="button">View</button></a>
                  {!r.active && <button onClick={() => handleActivate(r._id)}>Activate</button>}
                  <button className="danger" onClick={() => setToDelete(r)}>Delete</button>
                </div>
              ),
            },
          ]}
        />
      </AsyncState>

      {toDelete && (
        <ConfirmDialog
          message={`Delete resume file "${toDelete.originalName}"?`}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
};

export default ResumeManager;

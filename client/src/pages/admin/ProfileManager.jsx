import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useContent from '../../hooks/useContent';
import { getProfile, updateProfile, uploadProfileImage } from '../../services/content';
import { apiErrorMessage } from '../../services/api';
import AsyncState from '../../components/AsyncState';

const ProfileManager = () => {
  const { data, loading, error, refetch } = useContent(getProfile);
  const [form, setForm] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [aboutFile, setAboutFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data?.profile) setForm(data.profile);
  }, [data]);

  if (!form) {
    return <AsyncState loading={loading} error={error} isEmpty={false} />;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, socials: { ...f.socials, [name]: value } }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
      if (profileFile) await uploadProfileImage('profile', profileFile);
      if (aboutFile) await uploadProfileImage('about', aboutFile);
      toast.success('Profile updated.');
      refetch();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>Profile</h1>
      </div>

      <form className="admin-form" onSubmit={handleSave} style={{ maxWidth: 640 }}>
        <label>Name
          <input name="name" value={form.name} onChange={handleChange} />
        </label>
        <label>Hero eyebrow
          <input name="eyebrow" value={form.eyebrow} onChange={handleChange} />
        </label>
        <label>Hero heading
          <input name="heroHeading" value={form.heroHeading} onChange={handleChange} />
        </label>
        <label>Title
          <input name="title" value={form.title} onChange={handleChange} />
        </label>
        <label>Tagline
          <input name="tagline" value={form.tagline} onChange={handleChange} />
        </label>
        <label>Hero description
          <textarea name="heroDescription" rows={3} value={form.heroDescription} onChange={handleChange} />
        </label>
        <label>About text (one paragraph per line)
          <textarea name="aboutText" rows={8} value={form.aboutText} onChange={handleChange} />
        </label>

        <div className="admin-form__row">
          <label>Email
            <input name="email" value={form.email} onChange={handleChange} />
          </label>
          <label>Phone
            <input name="phone" value={form.phone} onChange={handleChange} />
          </label>
        </div>
        <div className="admin-form__row">
          <label>Location
            <input name="location" value={form.location} onChange={handleChange} />
          </label>
          <label className="admin-form__checkbox" style={{ alignSelf: 'flex-end' }}>
            <input type="checkbox" name="openToRelocation" checked={form.openToRelocation} onChange={handleChange} /> Open to relocation
          </label>
        </div>

        <h3 style={{ marginTop: '1rem' }}>Social links</h3>
        <div className="admin-form__row">
          <label>GitHub
            <input name="github" value={form.socials?.github || ''} onChange={handleSocialChange} />
          </label>
          <label>LinkedIn
            <input name="linkedin" value={form.socials?.linkedin || ''} onChange={handleSocialChange} />
          </label>
        </div>
        <div className="admin-form__row">
          <label>Instagram
            <input name="instagram" value={form.socials?.instagram || ''} onChange={handleSocialChange} />
          </label>
          <label>Twitter
            <input name="twitter" value={form.socials?.twitter || ''} onChange={handleSocialChange} />
          </label>
        </div>

        <h3 style={{ marginTop: '1rem' }}>Images</h3>
        <div className="admin-form__row">
          <label>Hero / profile image
            <input type="file" accept="image/*" onChange={(e) => setProfileFile(e.target.files[0])} />
          </label>
          <label>About section image
            <input type="file" accept="image/*" onChange={(e) => setAboutFile(e.target.files[0])} />
          </label>
        </div>

        <div className="admin-form__actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
        </div>
      </form>
    </div>
  );
};

export default ProfileManager;

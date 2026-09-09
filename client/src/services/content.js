import api, { unwrap } from './api';

export const getProfile = () => unwrap(api.get('/profile'));
export const updateProfile = (payload) => unwrap(api.put('/profile', payload));
export const uploadProfileImage = (type, file) => {
  const form = new FormData();
  form.append('image', file);
  return unwrap(api.post(`/profile/image/${type}`, form));
};

export const getProjects = () => unwrap(api.get('/projects'));
export const getProjectBySlug = (slug) => unwrap(api.get(`/projects/slug/${slug}`));
export const getAllProjectsAdmin = () => unwrap(api.get('/projects/admin/all'));
export const createProject = (payload) => unwrap(api.post('/projects', payload));
export const updateProject = (id, payload) => unwrap(api.put(`/projects/${id}`, payload));
export const deleteProject = (id) => unwrap(api.delete(`/projects/${id}`));
export const uploadProjectThumbnail = (id, file) => {
  const form = new FormData();
  form.append('image', file);
  return unwrap(api.post(`/projects/${id}/thumbnail`, form));
};

export const getSkills = () => unwrap(api.get('/skills'));
export const getAllSkillsAdmin = () => unwrap(api.get('/skills/admin/all'));
export const createSkill = (payload) => unwrap(api.post('/skills', payload));
export const updateSkill = (id, payload) => unwrap(api.put(`/skills/${id}`, payload));
export const deleteSkill = (id) => unwrap(api.delete(`/skills/${id}`));

export const getEducation = () => unwrap(api.get('/education'));
export const getAllEducationAdmin = () => unwrap(api.get('/education/admin/all'));
export const createEducation = (payload) => unwrap(api.post('/education', payload));
export const updateEducation = (id, payload) => unwrap(api.put(`/education/${id}`, payload));
export const deleteEducation = (id) => unwrap(api.delete(`/education/${id}`));

export const getCertifications = () => unwrap(api.get('/certifications'));
export const getAllCertificationsAdmin = () => unwrap(api.get('/certifications/admin/all'));
export const createCertification = (payload) => unwrap(api.post('/certifications', payload));
export const updateCertification = (id, payload) => unwrap(api.put(`/certifications/${id}`, payload));
export const deleteCertification = (id) => unwrap(api.delete(`/certifications/${id}`));

export const getGallery = () => unwrap(api.get('/gallery'));
export const getAllGalleryAdmin = () => unwrap(api.get('/gallery/admin/all'));
export const createGalleryItem = (formData) => unwrap(api.post('/gallery', formData));
export const updateGalleryItem = (id, payload) => unwrap(api.put(`/gallery/${id}`, payload));
export const deleteGalleryItem = (id) => unwrap(api.delete(`/gallery/${id}`));

export const getActiveResume = () => unwrap(api.get('/resume'));
export const getAllResumesAdmin = () => unwrap(api.get('/resume/admin/all'));
export const uploadResume = (file) => {
  const form = new FormData();
  form.append('resume', file);
  return unwrap(api.post('/resume', form));
};
export const activateResume = (id) => unwrap(api.put(`/resume/${id}/activate`));
export const deleteResume = (id) => unwrap(api.delete(`/resume/${id}`));

export const submitContact = (payload) => unwrap(api.post('/contact', payload));
export const getMessages = () => unwrap(api.get('/contact'));
export const updateMessage = (id, payload) => unwrap(api.put(`/contact/${id}`, payload));
export const deleteMessage = (id) => unwrap(api.delete(`/contact/${id}`));

export const getDashboardStats = () => unwrap(api.get('/dashboard/stats'));

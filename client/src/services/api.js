import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // send the HTTP-only auth cookie
});

// Central place to unwrap { success, message, data } and surface errors consistently.
export const unwrap = async (promise) => {
  const res = await promise;
  return res.data.data;
};

export const apiErrorMessage = (err) =>
  err?.response?.data?.message || 'Something went wrong. Please try again.';

export default api;

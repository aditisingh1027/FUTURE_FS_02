import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

// Always log in production so we can verify the baked-in URL via browser console
console.log('[api] baseURL:', baseURL);

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (!error.response) {
      console.error('[api] Network error — no response. Base URL:', baseURL, '| Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;

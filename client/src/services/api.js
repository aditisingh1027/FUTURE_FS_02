import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

// Verify the API base URL is resolving correctly in this build
if (import.meta.env.DEV) {
  console.log('[api] baseURL:', baseURL);
}

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (!error.response) {
      // Network / CORS / unreachable server
      console.error('[api] Network error — no response. Base URL:', baseURL, '| Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;

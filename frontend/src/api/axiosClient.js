import axios from 'axios';

// Get base URL from environment or default to local backend port 8050
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8050';

const axiosClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Provide clean, human-readable error messages
    let message = 'An unexpected error occurred';
    if (error.response) {
      if (typeof error.response.data === 'string') {
        message = error.response.data;
      } else if (error.response.data?.message) {
        message = error.response.data.message;
      } else {
        message = `Server returned status ${error.response.status}`;
      }
    } else if (error.request) {
      message = 'Cannot connect to backend server. Please verify backend is running on port 8050.';
    } else {
      message = error.message;
    }
    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
export { baseURL };

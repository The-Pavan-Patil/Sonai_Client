
const getAPIBaseURL = () => {
  // For Vite (most common)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.MODE === 'production' 
      ? import.meta.env.VITE_API_BASE_URL || 'https://sonai-client.onrender.com'
      : import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000';
  }
  
  // Fallback for production
  return window.location.hostname === 'localhost' 
    ? 'http://localhost:10000/'
    : 'https://sonai-client.onrender.com/';
};

const API_CONFIG = {
  baseURL: getAPIBaseURL(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
};

export default API_CONFIG;

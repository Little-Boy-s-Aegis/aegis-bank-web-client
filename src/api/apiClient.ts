import axios from 'axios';
import { tokenStorage } from './tokenStorage';

const clearAuthState = () => {
  tokenStorage.removeItem('token');
  tokenStorage.removeItem('user');
  if (typeof window !== 'undefined') {
    window.sessionStorage.clear();
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('user');
  }
};

const isIpBanResponse = (error: any) => {
  if (!error.response || error.response.status !== 403) {
    return false;
  }
  const headerValue = error.response.headers?.['x-aegis-ip-banned'];
  const data = error.response.data;
  if (headerValue === 'true') {
    return true;
  }
  if (typeof data === 'string') {
    return data.includes('IP_BANNED') || data.toLowerCase().includes('ip address has been blocked');
  }
  return typeof data?.error === 'string' && data.error.toLowerCase().includes('ip is banned');
};

const redirectToBannedPage = () => {
  if (typeof window === 'undefined') {
    return;
  }
  clearAuthState();
  if (window.location.pathname !== '/banned') {
    window.location.replace('/banned');
  }
};

const apiClient = axios.create({
  baseURL: '/api-bank',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token if available
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = tokenStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors (like 401 unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (isIpBanResponse(error)) {
        redirectToBannedPage();
        return Promise.reject(error);
      }
      if (error.response.status === 401) {
        // Only redirect if we are not already on the login page
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          clearAuthState();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

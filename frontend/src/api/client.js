import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
apiClient.interceptors.request.use((config) => {
  console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});

// Interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Success:', response.config.url);
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    console.error('❌ API Error Details:', {
      message,
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data
    });
    return Promise.reject(error.response?.data || { message });
  }
);

export default apiClient;

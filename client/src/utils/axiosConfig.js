import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'http://localhost:5000', // backend server
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export default axiosInstance;

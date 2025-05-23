import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000', // backend server
  withCredentials: true,
});

export default instance;

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/',
  withCredentials: true // ✅ Important for session cookie
});

export default api;
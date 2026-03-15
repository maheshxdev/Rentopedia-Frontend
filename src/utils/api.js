import axios from 'axios';

const api = axios.create({
  baseURL: 'https://rentopedia-backend.onrender.com/',
  withCredentials: true // ✅ Important for session cookie
});

export default api;
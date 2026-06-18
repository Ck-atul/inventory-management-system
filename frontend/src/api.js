import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://inventory-management-system-398k.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

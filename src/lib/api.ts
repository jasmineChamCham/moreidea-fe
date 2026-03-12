import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiUpload = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

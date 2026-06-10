
import axios from 'axios';

const express = require('express');
const app = express();

// Render automatically injects process.env.PORT. Fallback to 8080 locally.
const URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

app.listen(URL, () => {
    console.log(`Backend Server is running successfully on port ${URL}`);
});

const api = axios.create({
  baseURL:import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
});

api.interceptors.request.use(config=>{
  const token = localStorage.getItem('token');
  if(token) config.headers.Authorization = 'Bearer '+token;
  return config;
});

export default api;

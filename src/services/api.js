
import axios from 'axios';

const express = require('express');
const app = express();

// Render automatically injects process.env.PORT. Fallback to 8080 locally.
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || localhost;

app.listen(PORT, HOST, () => {
    console.log(`Backend Server is running successfully on port ${HOST}/${PORT}`);
});

const api = axios.create({
  baseURL:'http://${HOST}:${PORT}'
});

api.interceptors.request.use(config=>{
  const token = localStorage.getItem('token');
  if(token) config.headers.Authorization = 'Bearer '+token;
  return config;
});

export default api;

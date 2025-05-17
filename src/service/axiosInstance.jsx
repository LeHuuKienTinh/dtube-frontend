// axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: 'http://localhost:8081',
  baseURL: 'https://dtube-backend.onrender.com/',
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-access-token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
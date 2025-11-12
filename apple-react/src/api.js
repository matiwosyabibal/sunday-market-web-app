import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // backend server URL
});

// Attach auth token and user id to all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const sellerId = localStorage.getItem("sellerId") || localStorage.getItem("userId");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (sellerId) {
    // Prefer sellerId, but keep backward compat with x-user-id
    config.headers["x-seller-id"] = sellerId;
    config.headers["x-user-id"] = sellerId;
  }
  return config;
});

export default API;

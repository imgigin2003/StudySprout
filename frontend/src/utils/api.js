import axios from "axios";
import { storage } from "./storage";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to automatically attach the JWT token to every request
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await storage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error("Failed to load token from storage", e);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;

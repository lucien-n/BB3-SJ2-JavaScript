import axios from "axios";
import { BACKEND_URL } from "../constants";

const API = axios.create({
  baseURL: `${BACKEND_URL}/api`,
});

// Add a request interceptor to attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

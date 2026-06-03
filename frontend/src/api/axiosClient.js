import axios from "axios";
import { API_BASE_URL } from "@/config/env.js";

const baseURL = API_BASE_URL || "http://localhost:5003/api";
console.info(`[axiosClient] baseURL=${baseURL}`);

const axiosClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT from localStorage on every request.
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("civiceye_token");
  const headers = { ...(config?.headers || {}) };

  if (token && token !== "undefined" && token !== "null") {
    headers.Authorization = `Bearer ${token}`;
  }

  return { ...config, headers };
});

// Normalize error shape: { success:false, message, status }.
axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const message = err.response?.data?.message || err.message || "Request failed";
    return Promise.reject({ success: false, status, message, original: err });
  },
);

export default axiosClient;

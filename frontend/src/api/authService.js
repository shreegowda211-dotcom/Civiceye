import axiosClient from "./axiosClient.js";
import { USE_MOCKS } from "@/config/env.js";
import { mockUsers } from "@/mocks/users.js";

/**
 * AUTH SERVICE — Contracts for Express + MongoDB backend
 * ------------------------------------------------------
 *
 * POST /api/auth/register
 *   Body: { name, email, password, phone, role? = "citizen" }
 *   200:  { success: true, token, user: { _id, name, email, role, phone, avatar? } }
 *   4xx:  { success: false, message }
 *
 * POST /api/auth/login
 *   Body: { email, password }
 *   200:  { success: true, token, user: { _id, name, email, role, phone, avatar? } }
 *   401:  { success: false, message: "Invalid credentials" }
 *
 * GET /api/auth/me
 *   Headers: Authorization: Bearer <jwt>
 *   200: { success: true, user: { ... } }
 *
 * POST /api/auth/forgot-password
 *   Body: { email }
 *   200:  { success: true, message: "Reset email sent" }
 *
 * POST /api/auth/reset-password
 *   Body: { token, password }
 *   200:  { success: true, message: "Password updated" }
 *
 * PATCH /api/auth/profile
 *   Body: { name?, phone?, avatar? }
 *   200:  { success: true, user }
 *
 * POST /api/auth/logout         (optional — token invalidation if using server-side blacklist)
 */

function delay(ms = 350) { return new Promise((r) => setTimeout(r, ms)); }

export const authService = {
  async login({ email, password }) {
    if (USE_MOCKS) {
      await delay();
      const user = mockUsers.find((u) => u.email === email);
      if (!user || password.length < 4) {
        return Promise.reject({ success: false, message: "Invalid credentials" });
      }
      return { success: true, token: `mock-jwt-${user._id}`, user };
    }
    const { data } = await axiosClient.post("/auth/login", { email, password });
    return data;
  },

  async register(payload) {
    if (USE_MOCKS) {
      await delay();
      const user = { _id: `u_${Date.now()}`, role: "citizen", avatar: null, ...payload };
      return { success: true, token: `mock-jwt-${user._id}`, user };
    }
    const { data } = await axiosClient.post("/auth/register", payload);
    return data;
  },

  async me() {
    if (USE_MOCKS) {
      await delay(150);
      const id = localStorage.getItem("civiceye_user_id");
      const user = mockUsers.find((u) => u._id === id) || mockUsers[0];
      return { success: true, user };
    }
    const { data } = await axiosClient.get("/auth/me");
    return data;
  },

  async forgotPassword(email) {
    if (USE_MOCKS) { await delay(); return { success: true, message: "Reset email sent" }; }
    const { data } = await axiosClient.post("/auth/forgot-password", { email });
    return data;
  },

  async updateProfile(payload) {
    if (USE_MOCKS) { await delay(); return { success: true, user: payload }; }
    const { data } = await axiosClient.patch("/auth/profile", payload);
    return data;
  },
};

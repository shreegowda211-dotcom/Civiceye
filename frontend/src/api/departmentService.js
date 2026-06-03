import axiosClient from "./axiosClient.js";
import { USE_MOCKS } from "@/config/env.js";
import { mockDepartments } from "@/mocks/departments.js";

/**
 * DEPARTMENT SERVICE — Contracts for Express + MongoDB backend
 * ------------------------------------------------------------
 *
 * GET /api/departments
 *   Query: { q?, page?, limit? }
 *   200:  { success: true, data: Department[], total }
 *
 * GET /api/departments/:id
 *   200: { success: true, data: Department }
 *
 * POST /api/departments                       (admin)
 *   Body: { name, description, categories: string[], head?: officerId }
 *   200: { success: true, data: Department }
 *
 * PATCH /api/departments/:id                  (admin)
 *   Body: partial Department
 *   200: { success: true, data: Department }
 *
 * DELETE /api/departments/:id                 (admin)
 *   200: { success: true }
 *
 * GET /api/departments/:id/stats
 *   200: { success: true, data: { totalComplaints, pending, inProgress, resolved, avgResolutionHours, officerCount } }
 *
 * GET /api/departments/by-category/:category
 *   200: { success: true, data: Department }     (used by AI auto-routing)
 *
 * Department shape:
 *  { _id, name, description, categories: string[], officerCount, openCount, resolvedCount, head?: officerId }
 */

function delay(ms = 220) { return new Promise((r) => setTimeout(r, ms)); }

export const departmentService = {
  async list(params = {}) {
    if (USE_MOCKS) { await delay(); return { success: true, data: mockDepartments, total: mockDepartments.length }; }
    const { data } = await axiosClient.get("/departments", { params });
    return data;
  },

  async get(id) {
    if (USE_MOCKS) { await delay(); return { success: true, data: mockDepartments.find((d) => d._id === id) }; }
    const { data } = await axiosClient.get(`/departments/${id}`);
    return data;
  },

  async create(payload) {
    if (USE_MOCKS) { await delay(); return { success: true, data: { _id: `d_${Date.now()}`, officerCount: 0, openCount: 0, resolvedCount: 0, ...payload } }; }
    const { data } = await axiosClient.post("/departments", payload);
    return data;
  },

  async update(id, payload) {
    if (USE_MOCKS) { await delay(); return { success: true, data: { _id: id, ...payload } }; }
    const { data } = await axiosClient.patch(`/departments/${id}`, payload);
    return data;
  },

  async remove(id) {
    if (USE_MOCKS) { await delay(); return { success: true }; }
    const { data } = await axiosClient.delete(`/departments/${id}`);
    return data;
  },

  async stats(id) {
    if (USE_MOCKS) {
      await delay();
      return { success: true, data: { totalComplaints: 64, pending: 9, inProgress: 14, resolved: 41, avgResolutionHours: 32, officerCount: 6 } };
    }
    const { data } = await axiosClient.get(`/departments/${id}/stats`);
    return data;
  },

  async byCategory(category) {
    if (USE_MOCKS) {
      await delay();
      const d = mockDepartments.find((x) => x.categories.includes(category));
      return { success: true, data: d };
    }
    const { data } = await axiosClient.get(`/departments/by-category/${category}`);
    return data;
  },
};

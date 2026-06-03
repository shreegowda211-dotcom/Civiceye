import axiosClient from "./axiosClient.js";

/**
 * OFFICER SERVICE — Contracts for Express + MongoDB backend
 * ---------------------------------------------------------
 *
 * GET /api/officers
 *   Query: { departmentId?, q?, page?, limit? }
 *   200:  { success: true, data: Officer[], total }
 *
 * GET /api/officers/:id
 *   200: { success: true, data: Officer }
 *
 * POST /api/officers                              (admin)
 *   Body: { name, email, phone, password, departmentId }
 *   200:  { success: true, data: Officer }
 *
 * PATCH /api/officers/:id                         (admin)
 *   Body: partial Officer
 *   200: { success: true, data: Officer }
 *
 * DELETE /api/officers/:id                        (admin)
 *
 * GET /api/officers/workload
 *   Query: { departmentId? }
 *   200: { success: true, data: [{ officerId, name, department, assigned, inProgress, resolved, load }] }
 *
 * GET /api/officers/:id/performance
 *   200: { success: true, data: { totalAssigned, resolved, avgResolutionHours, rating } }
 *
 * Officer shape:
 *  { _id, name, email, phone, department: { _id, name }, activeCount, resolvedCount, rating, createdAt }
 */

export const officerService = {
  async list(params = {}) {
    const { data } = await axiosClient.get("/officers", { params });
    return data;
  },

  async get(id) {
    const { data } = await axiosClient.get(`/officers/${id}`);
    return data;
  },

  async create(payload) {
    const { data } = await axiosClient.post("/officers", payload);
    return data;
  },

  async update(id, payload) {
    const { data } = await axiosClient.patch(`/officers/${id}`, payload);
    return data;
  },

  async remove(id) {
    const { data } = await axiosClient.delete(`/officers/${id}`);
    return data;
  },

  async workload(params = {}) {
    const { data } = await axiosClient.get("/officers/workload", { params });
    return data;
  },

  async performance(id) {
    const { data } = await axiosClient.get(`/officers/${id}/performance`);
    return data;
  },
};

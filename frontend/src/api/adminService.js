import axiosClient from "./axiosClient.js";
import { USE_MOCKS } from "@/config/env.js";
import { mockUsers } from "@/mocks/users.js";
import { mockComplaints } from "@/mocks/complaints.js";

/**
 * ADMIN SERVICE — Contracts for Express + MongoDB backend
 * -------------------------------------------------------
 *
 * GET /api/admin/analytics
 *   Query: { from?, to?, departmentId?, category? }
 *   200:  { success: true, data: {
 *            totals: { complaints, pending, inProgress, resolved, rejected, users, officers, departments },
 *            resolutionRate: number,                  // %
 *            avgResolutionHours: number,
 *            trends: [{ date: "YYYY-MM-DD", count, resolved }],
 *            byCategory: [{ category, count }],
 *            byDepartment: [{ department, count, resolved }],
 *            byStatus: [{ status, count }]
 *          }}
 *
 * GET /api/admin/heatmap
 *   Query: { from?, to?, category? }
 *   200:  { success: true, data: [[lat, lng, intensity], ...] }
 *
 * GET /api/admin/users
 *   Query: { role?, q?, page?, limit? }
 *   200:  { success: true, data: User[], total }
 *
 * PATCH /api/admin/users/:id
 *   Body: { role?, isActive? }
 *   200: { success: true, data: User }
 *
 * DELETE /api/admin/users/:id
 *
 * GET /api/admin/reports
 *   Query: { type: "complaints"|"officers"|"departments", from, to, format?="json"|"csv" }
 *   200:  { success: true, data: any[] }   // or CSV stream
 *
 * GET /api/admin/settings
 *   200: { success: true, data: SystemSettings }
 * PATCH /api/admin/settings
 *   Body: partial SystemSettings
 *
 * SystemSettings shape:
 *  { siteName, supportEmail, autoRoutingEnabled, defaultDepartmentId?, slaHours, allowSelfRegistration }
 */

function delay(ms = 300) { return new Promise((r) => setTimeout(r, ms)); }

export const adminService = {
  async analytics(params = {}) {
    if (USE_MOCKS) {
      await delay();
      const total = mockComplaints.length;
      const by = (s) => mockComplaints.filter((c) => c.status === s).length;
      const trends = Array.from({ length: 14 }).map((_, i) => {
        const d = new Date(); d.setDate(d.getDate() - (13 - i));
        return { date: d.toISOString().slice(0, 10), count: 4 + Math.round(Math.sin(i) * 3 + i % 5), resolved: 2 + (i % 4) };
      });
      const cats = {};
      mockComplaints.forEach((c) => { cats[c.category] = (cats[c.category] || 0) + 1; });
      const byCategory = Object.entries(cats).map(([category, count]) => ({ category, count }));
      const depts = {};
      mockComplaints.forEach((c) => { const k = c.department?.name || "Unassigned"; depts[k] = depts[k] || { count: 0, resolved: 0 }; depts[k].count++; if (c.status === "resolved") depts[k].resolved++; });
      const byDepartment = Object.entries(depts).map(([department, v]) => ({ department, ...v }));
      const resolved = by("resolved");
      return {
        success: true,
        data: {
          totals: { complaints: total, pending: by("pending"), inProgress: by("in_progress"), resolved, rejected: by("rejected"), users: mockUsers.length, officers: 8, departments: 8 },
          resolutionRate: Math.round((resolved / Math.max(total, 1)) * 100),
          avgResolutionHours: 34,
          trends,
          byCategory,
          byDepartment,
          byStatus: ["pending", "assigned", "in_progress", "resolved", "rejected"].map((s) => ({ status: s, count: by(s) })),
        },
      };
    }
    const { data } = await axiosClient.get("/admin/analytics", { params });
    return data;
  },

  async heatmap(params = {}) {
    if (USE_MOCKS) {
      await delay();
      const data = mockComplaints
        .filter((c) => c.location?.latitude && c.location?.longitude)
        .map((c) => [c.location.latitude, c.location.longitude, 0.4 + Math.random() * 0.6]);
      return { success: true, data };
    }
    const { data } = await axiosClient.get("/admin/heatmap", { params });
    return data;
  },

  async users(params = {}) {
    if (USE_MOCKS) {
      await delay();
      let data = [...mockUsers];
      if (params.role) data = data.filter((u) => u.role === params.role);
      if (params.q) { const q = params.q.toLowerCase(); data = data.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)); }
      return { success: true, data, total: data.length };
    }
    const { data } = await axiosClient.get("/admin/users", { params });
    return data;
  },

  async updateUser(id, payload) {
    if (USE_MOCKS) { await delay(); return { success: true, data: { _id: id, ...payload } }; }
    const { data } = await axiosClient.patch(`/admin/users/${id}`, payload);
    return data;
  },

  async deleteUser(id) {
    if (USE_MOCKS) { await delay(); return { success: true }; }
    const { data } = await axiosClient.delete(`/admin/users/${id}`);
    return data;
  },

  async getSettings() {
    if (USE_MOCKS) {
      await delay();
      return { success: true, data: { siteName: "CivicEye", supportEmail: "support@civiceye.app", autoRoutingEnabled: true, slaHours: 72, allowSelfRegistration: true } };
    }
    const { data } = await axiosClient.get("/admin/settings");
    return data;
  },

  async updateSettings(payload) {
    if (USE_MOCKS) { await delay(); return { success: true, data: payload }; }
    const { data } = await axiosClient.patch("/admin/settings", payload);
    return data;
  },

  async activities(params = {}) {
    if (USE_MOCKS) {
      await delay();
      return { success: true, data: [], total: 0 };
    }
    const { data } = await axiosClient.get("/admin/activities", { params });
    return data;
  },

  async reports(params = {}) {
    if (USE_MOCKS) {
      await delay();
      const { type = "complaints" } = params;
      if (type === "complaints") {
        return { success: true, data: mockComplaints };
      } else if (type === "officers") {
        return { success: true, data: [
          { _id: "1", name: "John Smith", email: "john@example.com", phone: "123-456-7890" },
          { _id: "2", name: "Jane Doe", email: "jane@example.com", phone: "098-765-4321" }
        ]};
      } else {
        return { success: true, data: [
          { _id: "1", name: "Public Works" },
          { _id: "2", name: "Water Board" }
        ]};
      }
    }
    const { data } = await axiosClient.get("/admin/reports", { params });
    return data;
  },
};

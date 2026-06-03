import axiosClient from "./axiosClient.js";
import { USE_MOCKS } from "@/config/env.js";
import { mockNotifications } from "@/mocks/notifications.js";

/**
 * NOTIFICATION SERVICE — Contracts for Express + MongoDB + Socket.io
 * ------------------------------------------------------------------
 *
 * GET /api/notifications
 *   Query: { unread?, page?, limit? }
 *   200:  { success: true, data: Notification[], total, unreadCount }
 *
 * PATCH /api/notifications/:id/read
 *   200: { success: true }
 *
 * PATCH /api/notifications/read-all
 *   200: { success: true }
 *
 * DELETE /api/notifications/:id
 *
 * Realtime via Socket.io:
 *   socket.on("notification:new", (notification) => ...)
 *   socket.on("complaint:status", ({ complaintId, status }) => ...)
 *
 * Notification shape:
 *  { _id, userId, type: "assignment"|"status"|"resolution"|"system",
 *    title, message, link?, read: boolean, createdAt }
 */

function delay(ms = 200) { return new Promise((r) => setTimeout(r, ms)); }

export const notificationService = {
  async list(params = {}) {
    if (USE_MOCKS) {
      await delay();
      let data = [...mockNotifications];
      if (params.unread) data = data.filter((n) => !n.read);
      return { success: true, data, total: data.length, unreadCount: mockNotifications.filter((n) => !n.read).length };
    }
    const { data } = await axiosClient.get("/notifications", { params });
    return data;
  },

  async markRead(id) {
    if (USE_MOCKS) {
      await delay(80);
      const n = mockNotifications.find((x) => x._id === id);
      if (n) n.read = true;
      return { success: true };
    }
    const { data } = await axiosClient.patch(`/notifications/${id}/read`);
    return data;
  },

  async markAllRead() {
    if (USE_MOCKS) { await delay(80); mockNotifications.forEach((n) => (n.read = true)); return { success: true }; }
    const { data } = await axiosClient.patch("/notifications/read-all");
    return data;
  },

  async remove(id) {
    if (USE_MOCKS) { await delay(); return { success: true }; }
    const { data } = await axiosClient.delete(`/notifications/${id}`);
    return data;
  },
};

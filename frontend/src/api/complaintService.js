import axiosClient from "./axiosClient.js";

function normalizeApiResponse(payload) {
  if (!payload) return { success: false, data: [] };
  if (payload?.success === true && payload?.data !== undefined) return payload;
  if (Array.isArray(payload)) return { success: true, data: payload };
  return { success: true, data: payload };
}

export const complaintService = {
  async list(params = {}) {
    const response = await axiosClient.get("/complaints", { params });
    return normalizeApiResponse(response.data);
  },

  async mine(params = {}) {
    const response = await axiosClient.get("/complaints/mine", { params });
    return normalizeApiResponse(response.data);
  },

  async byDepartment(departmentId, params = {}) {
    if (!departmentId) {
      return { success: true, data: [] };
    }
    const response = await axiosClient.get(`/complaints/department/${departmentId}`, { params });
    return normalizeApiResponse(response.data);
  },

  async get(id) {
    const response = await axiosClient.get(`/complaints/${id}`);
    return normalizeApiResponse(response.data);
  },

  async create(payload) {
    const response = await axiosClient.post("/complaints", payload);
    return normalizeApiResponse(response.data);
  },

  async uploadImages(id, files) {
    const fd = new FormData();
    files.forEach((f) => fd.append("images", f));
    const { data } = await axiosClient.post(`/complaints/${id}/upload`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizeApiResponse(data);
  },

  async updateStatus(id, payload) {
    const response = await axiosClient.patch(`/complaints/${id}/status`, payload);
    return normalizeApiResponse(response.data);
  },

  async assign(id, payload) {
    const response = await axiosClient.patch(`/complaints/${id}/assign`, payload);
    return normalizeApiResponse(response.data);
  },

  async history(id) {
    const response = await axiosClient.get(`/complaints/${id}/history`);
    return normalizeApiResponse(response.data);
  },

  async remove(id) {
    const { data } = await axiosClient.delete(`/complaints/${id}`);
    return normalizeApiResponse(data);
  },
};

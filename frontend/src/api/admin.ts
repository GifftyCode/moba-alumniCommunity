import api from "./axios";

export const adminAPI = {
  getStats: () => api.get("/admin/stats"),

  getPendingAlumni: () => api.get("/admin/pending-alumni"),

  getAllAlumni: () => api.get("/admin/all-alumni"),

  approveAlumni: (id: string, approve: boolean) =>
    api.put(`/admin/alumni/${id}/approve`, { approve }),

  deleteAlumni: (id: string) => api.delete(`/admin/alumni/${id}`),

  getPendingContent: () => api.get("/admin/pending-content"),

  approveContent: (id: string, approve: boolean, isFeatured?: boolean) =>
    api.put(`/admin/content/${id}/approve`, { approve, isFeatured }),

  deleteContent: (id: string) => api.delete(`/admin/content/${id}`),
};

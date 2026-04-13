import api from "./axios";

export const alumniAPI = {
  getAll: (params?: Record<string, unknown>) => api.get("/alumni", { params }),

  getById: (id: string) => api.get(`/alumni/${id}`),

  getFeatured: () => api.get("/alumni/featured"),

  getDepartments: () => api.get("/alumni/departments"),

  getGraduationYears: () => api.get("/alumni/graduation-years"),

  updateProfile: (data: Record<string, unknown>) =>
    api.put("/alumni/profile", data),
};

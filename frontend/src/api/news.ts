import api from "./axios";

export const newsAPI = {
  getAll: (params?: Record<string, unknown>) => api.get("/news", { params }),

  getById: (id: string) => api.get(`/news/${id}`),

  getFeatured: () => api.get("/news/featured"),

  getMyPosts: () => api.get("/news/my-posts"),

  create: (data: Record<string, unknown>) => api.post("/news", data),

  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/news/${id}`, data),
};

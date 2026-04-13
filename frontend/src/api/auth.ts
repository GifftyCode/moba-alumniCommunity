import api from "./axios";
import { User } from "../types";

export const authAPI = {
  register: (data: Partial<User> & { password: string }) =>
    api.post("/auth/register", data),

  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),

  getMe: () => api.get("/auth/me"),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.put("/auth/change-password", { currentPassword, newPassword }),
};

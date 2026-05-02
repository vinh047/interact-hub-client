import type { User } from "@/types/user.type";
import api from "./api";

export const userService = {
  updateProfile: async (formData: FormData) => {
    const response = await api.patch<unknown, User>("/user/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  },

  getProfile: async (id: string) => {
    const response = await api.get<unknown, User>(`/user/${id}`);
    return response;
  },
};

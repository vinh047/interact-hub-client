import type { User } from "@/types/user.type";
import api from "./api";
import type { PaginatedResponse } from "@/types/common.type";

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

  getFriendSuggestions: async (
    page = 1,
    limit = 5,
  ): Promise<PaginatedResponse<User>> => {
    const response = await api.get<unknown, PaginatedResponse<User>>(
      `/user/suggestions?page=${page}&limit=${limit}`,
    );
    return response;
  },
};

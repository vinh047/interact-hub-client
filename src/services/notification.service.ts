import type { Notification } from "@/types/notification.type";
import api from "./api";
import type { PaginatedResponse } from "@/types/common.type";

export const notificationService = {
  getNotifications: async (page: number = 1, limit: number = 10) => {
    return api.get<unknown, PaginatedResponse<Notification>>("/notification", {
      params: { page, limit },
    });
  },

  markAllAsRead: async () => {
    return api.patch("/notification/read");
  },
};

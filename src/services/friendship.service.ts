import type { PaginatedResponse } from "@/types/common.type";
import api from "./api";
import type { FriendUserResponse } from "@/types/friendship.type";

interface FriendshipParams {
  userId?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export const friendshipService = {
  getFriends: async (params: {
    page?: number;
    limit?: number;
    userId?: string;
    search?: string;
  }): Promise<PaginatedResponse<FriendUserResponse>> => {
    const response = await api.get<
      unknown,
      PaginatedResponse<FriendUserResponse>
    >(`/friendship/friends`, {
      params: params,
    });
    return response;
  },

  // Gửi lời mời kết bạn
  sendRequest: async (targetUserId: string) => {
    return await api.post(`/friendship/request/${targetUserId}`);
  },

  // Chấp nhận lời mời kết bạn
  acceptRequest: async (requesterId: string) => {
    return await api.put(`/friendship/accept/${requesterId}`);
  },

  // Hủy kết bạn hoặc lời mời
  removeFriendship: async (otherUserId: string) => {
    return await api.delete(`/friendship/${otherUserId}`);
  },

  getPendingRequests: async (params: FriendshipParams) => {
    return api.get<unknown, PaginatedResponse<FriendUserResponse>>(
      "/friendship/requests/received",
      {
        params,
      },
    );
  },
};

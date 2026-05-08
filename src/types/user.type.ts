import type { FriendshipStatus } from "./enum.type";

export interface User {
  id: string;
  fullName: string;
  avatarUrl?: string | null;
  bio?: string | null;
  createdAt?: string;
  friendCount: number;
  friendshipStatus?: FriendshipStatus;
  isRequester?: boolean;
  mutualFriendsCount: number; 
}

// Dành cho trang danh sách bạn bè
export interface Friendship {
  requesterId: string;
  addresseeId: string;
  status: FriendshipStatus;
  createdAt: string;
  user: User; // Thông tin của người bạn đó
}

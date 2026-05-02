export interface FriendUserResponse {
  userId: string;
  fullName: string;
  avatarUrl?: string | null;
  bio?: string | null;
  status: string; // Hoặc string tuỳ theo cách bạn cấu hình Enum ở Backend
  createdAt: string;
}

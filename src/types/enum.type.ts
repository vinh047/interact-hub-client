export type FriendshipStatus = "Pending" | "Accepted" | "Blocked";
export type ReportStatus = "Pending" | "Reviewed" | "Dismissed";
export type NotificationType =
  | "Like"
  | "Comment"
  | "FriendRequest"
  | "FriendAccept"
  | "System";

export const POST_VISIBILITY_VALUES = [
  "Public",
  "FriendsOnly",
  "Private",
] as const;

// 2. Trích xuất Type từ mảng trên (Kết quả vẫn là "Public" | "FriendsOnly" | "Private")
export type PostVisibility = (typeof POST_VISIBILITY_VALUES)[number];

export const MediaType = {
  Image: "Image",
  Video: "Video",
} as const;

export type MediaType = (typeof MediaType)[keyof typeof MediaType];

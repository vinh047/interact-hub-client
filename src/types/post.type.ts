import type { PostVisibility } from "./enum.type";
import type { User } from "./user.type";

export interface PostMedia {
  id: string;
  mediaUrl: string;
  mediaType: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  user: User; // Người comment
}

export interface Post {
  id: string;
  content: string;
  visibility: PostVisibility;
  createdAt: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  mediaFiles: PostMedia[];

  // Các con số thống kê lấy từ DTO của bạn
  likeCount: number;
  commentCount: number;
  isLikedByCurrentUser: boolean;
}

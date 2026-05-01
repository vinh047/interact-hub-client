import type { PostVisibility } from "./enum.type";

export interface PostMedia {
  id: string;
  mediaUrl: string;
  mediaType: string;
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

  likeCount: number;
  commentCount: number;
  isLikedByCurrentUser: boolean;
}

export interface CreatePostRequest {
  content?: string;
  visibility: PostVisibility;
  mediaFiles?: File[];
}

export interface UpdatePostRequest {
  content?: string;
  visibility?: PostVisibility;
  newMediaFiles?: File[];
  deletedMediaIds?: string[];
}

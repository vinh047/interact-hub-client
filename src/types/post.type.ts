import type { MediaType, PostVisibility } from "./enum.type";

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

export interface PostQueryParameters {
  page?: number;
  limit?: number;
  sort?: string;
  visibility?: PostVisibility;
}

export interface PostMediaResponse {
  postId: string;
  mediaUrl: string;
  mediaType: MediaType;
  createdAt: string;
}

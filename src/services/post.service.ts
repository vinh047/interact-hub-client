import type { PaginatedResponse } from "@/types/common.type";
import api from "./api";
import type {
  CreatePostRequest,
  Post,
  PostMediaResponse,
  PostQueryParameters,
  UpdatePostRequest,
} from "@/types/post.type";

export const postService = {
  create: async (data: CreatePostRequest): Promise<Post> => {
    const formData = new FormData();

    // Đóng gói dữ liệu văn bản theo đúng yêu cầu của Backend
    formData.append("Content", data.content ?? "");
    formData.append("Visibility", data.visibility);

    // Duyệt mảng mediaFiles và đưa vào FormData
    // Lưu ý: Key "MediaFiles" phải khớp với backend DTO
    if (data.mediaFiles && data.mediaFiles.length > 0) {
      data.mediaFiles.forEach((file) => {
        formData.append("MediaFiles", file);
      });
    }

    // Gọi API với Content-Type là multipart/form-data
    const response = await api.post<unknown, Post>("/post", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response;
  },

  getFeedPosts: async (
    page = 1,
    limit = 2,
  ): Promise<PaginatedResponse<Post>> => {
    const response = await api.get<unknown, PaginatedResponse<Post>>(
      `/post?page=${page}&limit=${limit}`,
    );
    return response;
  },

  getPostById: async (postId: string): Promise<Post> => {
    const response = await api.get<unknown, Post>(`/post/${postId}`);
    return response;
  },

  deletePost: async (postId: string): Promise<void> => {
    await api.delete(`/post/${postId}`);
  },

  updatePost: async (postId: string, data: UpdatePostRequest) => {
    const formData = new FormData();
    if (data.content) {
      formData.append("content", data.content);
    }

    if (data.visibility) {
      formData.append("visibility", data.visibility.toString());
    }

    data.newMediaFiles?.forEach((file) =>
      formData.append("newMediaFiles", file),
    );
    data.deletedMediaIds?.forEach((id) =>
      formData.append("deletedMediaIds", id),
    );

    const response = await api.put(`/post/${postId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
  },

  reportPost: async (postId: string, reason: string) => {
    const response = await api.post(`/posts/${postId}/report`, { reason });
    return response.data;
  },

  getUserPosts: async (
    targetUserId: string,
    params: PostQueryParameters,
  ): Promise<PaginatedResponse<Post>> => {
    const response = await api.get<unknown, PaginatedResponse<Post>>(
      `/post/user/${targetUserId}`,
      { params },
    );
    return response;
  },

  getUserMedia: async (
    userId: string,
    params: { page?: number; limit?: number },
  ): Promise<PaginatedResponse<PostMediaResponse>> => {
    const response = await api.get<
      unknown,
      PaginatedResponse<PostMediaResponse>
    >(`/post/media/${userId}`, {
      params: params,
    });
    return response;
  },
};

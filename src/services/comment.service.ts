import api from "./api";
import type { Comment } from "@/types/comment.type";
import type { PaginatedResponse } from "@/types/common.type";

export const commentService = {
  // Lấy danh sách bình luận gốc có phân trang
  getRootComments: async (
    postId: string,
    page = 1,
    limit = 20,
  ): Promise<PaginatedResponse<Comment>> => {
    const response = await api.get<unknown, PaginatedResponse<Comment>>(
      `/comment/post/${postId}?page=${page}&limit=${limit}`,
    );
    return response;
  },

  // Tạo bình luận mới
  createComment: async (
    postId: string,
    content: string,
    parentCommentId?: string,
  ): Promise<Comment> => {
    const response = await api.post<unknown, Comment>(`/comment`, {
      postId,
      content,
      parentCommentId,
    });
    return response;
  },

  getRepliesByCommentId: async (
    commentId: string,
    page = 1,
    limit = 20,
  ): Promise<PaginatedResponse<Comment>> => {
    const response = await api.get<unknown, PaginatedResponse<Comment>>(
      `/comment/${commentId}/replies?page=${page}&limit=${limit}`,
    );
    return response;
  },

  // Sửa bình luận
  updateComment: async (
    commentId: string,
    content: string,
  ): Promise<Comment> => {
    const response = await api.put<unknown, Comment>(`/comment/${commentId}`, {
      content,
    });
    return response;
  },

  // Xóa bình luận
  deleteComment: async (commentId: string): Promise<void> => {
    await api.delete(`/comment/${commentId}`);
  },
};

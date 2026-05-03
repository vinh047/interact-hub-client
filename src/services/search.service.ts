import api from "./api";
import type { PaginatedResponse } from "@/types/common.type";
import type { User } from "@/types/user.type"; 
import type { Post } from "@/types/post.type";

export const searchService = {
  searchUsers: async (q: string, page: number = 1, limit: number = 10) => {
    return api.get<unknown, PaginatedResponse<User>>("/user/search", {
      params: { q, page, limit },
    });
  },

  searchPosts: async (q: string, page: number = 1, limit: number = 10) => {
    return api.get<unknown, PaginatedResponse<Post>>("/post/search", {
      params: { q, page, limit },
    });
  },
};

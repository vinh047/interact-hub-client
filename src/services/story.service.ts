import type { PaginatedResponse } from "@/types/common.type";
import api from "./api";
import type { Story } from "@/types/story.type";

export const storyService = {
  getFeedStories: async (
    page = 1,
    limit = 10,
  ): Promise<PaginatedResponse<Story>> => {
    const response = await api.get<unknown, PaginatedResponse<Story>>(
      `/story/feed?page=${page}&limit=${limit}`,
    );

    return response;
  },

  // Nơi đây sau này có thể viết thêm hàm:
  // createStory: async (formData) => {...}
};

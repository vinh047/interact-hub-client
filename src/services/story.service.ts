import type { PaginatedResponse } from "@/types/common.type";
import api from "./api";
import type { CreateStoryRequest, Story } from "@/types/story.type";

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

  create: async (data: CreateStoryRequest): Promise<Story> => {
    const formData = new FormData();

    formData.append("MediaFile", data.mediaFile);

    const response = await api.post<unknown, Story>("/story", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  },
};

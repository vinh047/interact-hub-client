import type { TrendingTag } from "@/types/hashtag.type";
import api from "./api";

export const hashtagService = {
  getTrendingHashtags: async () => {
    const response = await api.get<unknown, TrendingTag[]>("/hashtag/trending");
    return response;
  },
};
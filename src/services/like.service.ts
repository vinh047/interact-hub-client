import api from "./api";

export const likeService = {
  toggleLike: async (postId: string) => {
    const response = await api.post<
      unknown,
      { message: string; isLiked: boolean }
    >(`/like/post/${postId}`);
    return response;
  },
};

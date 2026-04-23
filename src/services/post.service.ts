import api from "./api";
import type { CreatePostRequest, Post } from "@/types/post.type"; 

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
    const response = await api.post<unknown, Post>(
      "/post", 
      formData, 
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response;
  },

};
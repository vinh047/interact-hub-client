import { POST_VISIBILITY_VALUES } from "@/types/enum.type";
import z from "zod";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB (Phù hợp cho cả video mp4)
const ACCEPTED_MEDIA_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "video/mp4"];

export const createPostSchema = z.object({
  content: z.string().max(2000, "Nội dung không quá 2000 ký tự").optional(),
  
  visibility: z.enum(POST_VISIBILITY_VALUES),

  // Khai báo mảng mediaFiles
  mediaFiles: z
    .array(z.instanceof(File))
    .optional()
    .refine(
      (files) => !files || files.every((file) => file.size <= MAX_FILE_SIZE),
      "Mỗi file không được quá 50MB"
    )
    .refine(
      (files) => !files || files.every((file) => ACCEPTED_MEDIA_TYPES.includes(file.type)),
      "Chỉ hỗ trợ định dạng ảnh (JPG, PNG, WEBP) và video MP4"
    ),
})
.refine((data) => data.content?.trim() || (data.mediaFiles && data.mediaFiles.length > 0), {
  message: "Bài viết phải có nội dung hoặc hình ảnh/video",
  path: ["content"], 
});
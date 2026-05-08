import type { ApiErrorResponse, ErrorCode } from "@/types/common.type";
import axios from "axios";

const ErrorDictionary: Partial<Record<ErrorCode, string>> = {
  USER_NOT_FOUND: "Tài khoản không tồn tại trong hệ thống.",
  UNAUTHORIZED: "Vui lòng đăng nhập để tiếp tục.",
  FORBIDDEN_ACCESS: "Bạn không có quyền thực hiện hành động này.",
  POST_NOT_FOUND: "Bài viết không tồn tại hoặc đã bị xóa.",
  BAD_REQUEST: "Dữ liệu không hợp lệ, vui lòng kiểm tra lại.",
  CONFLICT: "Dữ liệu đã tồn tại hoặc bị xung đột.",
  INTERNAL_SERVER_ERROR: "Hệ thống đang bảo trì, vui lòng thử lại sau.",
  EMAIL_ALREADY_EXISTS: "Email đã được sử dụng.",
  INVALID_PASSWORD: "Mật khẩu không chính xác.",
};

// 1. Định nghĩa cấu trúc lỗi để "lách" TS mà không cần dùng `any`
interface CustomErrorShape {
  response?: {
    data?: ApiErrorResponse;
  };
}

// 2. Hàm helper bóc tách dữ liệu an toàn 100% TypeScript
const extractErrorData = (error: unknown): ApiErrorResponse | undefined => {
  // Ưu tiên 1: Nếu là lỗi Axios chuẩn
  if (axios.isAxiosError(error)) {
    return error.response?.data as ApiErrorResponse | undefined;
  }

  // Ưu tiên 2: Nếu là lỗi Mock tự throw (không có cờ isAxiosError)
  if (error && typeof error === "object") {
    // Ép kiểu về cấu trúc Custom kết hợp với ApiErrorResponse
    const errObj = error as CustomErrorShape & ApiErrorResponse;
    // Trả về data bên trong response (nếu có), hoặc trả về chính object đó
    return errObj.response?.data || errObj;
  }

  return undefined;
};

// 3. Hàm xử lý lỗi Global
export const getFriendlyErrorMessage = (error: unknown): string => {
  const errData = extractErrorData(error);

  console.log("errData đang hứng được: ", errData);

  if (errData && errData.errorCode) {
    return ErrorDictionary[errData.errorCode] || errData.message || "Lỗi không xác định";
  }

  if (errData && errData.message) {
    return errData.message;
  }

  // Xử lý đứt cáp, mất mạng (Error thuần của JS)
  if (error instanceof Error) {
    return error.message;
  }

  return "Lỗi kết nối đến máy chủ. Vui lòng kiểm tra mạng.";
};

// 4. Hàm bóc tách lỗi chi tiết của từng ô Input
export const extractFieldErrors = (
  error: unknown,
): Record<string, string> | null => {
  const errData = extractErrorData(error);

  if (errData && errData.errorCode === "BAD_REQUEST" && errData.details) {
    const fieldErrors: Record<string, string> = {};

    // Ép kiểu details về dạng Record (Object) an toàn thay vì dùng any
    const details = errData.details as Record<string, string[]>;

    Object.keys(details).forEach((key) => {
      const fieldName = key.charAt(0).toLowerCase() + key.slice(1);
      // Lấy phần tử đầu tiên trong mảng lỗi của từng field
      fieldErrors[fieldName] = details[key][0];
    });

    return fieldErrors;
  }

  return null;
};
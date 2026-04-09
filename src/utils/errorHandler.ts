import type { ApiErrorResponse, ErrorCode } from "@/types/common.type";

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

export const getFriendlyErrorMessage = (error: unknown): string => {
  const errData = error as ApiErrorResponse;

  if (errData && errData.errorCode) {
    return ErrorDictionary[errData.errorCode] || errData.message;
  }

  // Xử lý thêm trường hợp lỗi Javascript thông thường (như đứt cáp, mất mạng)
  if (error instanceof Error) {
    return error.message;
  }

  return "Lỗi kết nối đến máy chủ. Vui lòng kiểm tra mạng.";
};

// 3. Hàm bóc tách lỗi chi tiết của từng ô Input
export const extractFieldErrors = (
  error: unknown,
): Record<string, string> | null => {
  const errData = error as ApiErrorResponse;

  if (errData && errData.errorCode === "BAD_REQUEST" && errData.details) {
    const fieldErrors: Record<string, string> = {};

    Object.keys(errData.details).forEach((key) => {
      const fieldName = key.charAt(0).toLowerCase() + key.slice(1);
      fieldErrors[fieldName] = errData.details![key][0];
    });

    return fieldErrors;
  }

  return null;
};

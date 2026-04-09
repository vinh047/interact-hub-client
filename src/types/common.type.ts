// 1. Ánh xạ chính xác các biến Enum từ ErrorCode.cs
export type ErrorCode =
  | "POST_NOT_FOUND"
  | "USER_NOT_FOUND"
  | "UNAUTHORIZED"
  | "FORBIDDEN_ACCESS"
  | "INTERNAL_SERVER_ERROR"
  | "COMMENT_NOT_FOUND"
  | "BAD_REQUEST"
  | "CONFLICT"
  | "FRIENDSHIP_NOT_FOUND"
  | "NOT_FOUND"
  | "STORY_NOT_FOUND"
  | "EMAIL_ALREADY_EXISTS"
  | "INVALID_PASSWORD";

// 2. Ánh xạ ErrorResponse.cs
export interface ApiErrorResponse {
  errorCode: ErrorCode;
  message: string;
  // Details ở C# là kiểu Object, nhưng thực tế nó là 1 Dictionary (Key: Tên trường, Value: Mảng lỗi)
  // Cú pháp Record<string, string[]> của TypeScript sinh ra chính xác để trị cái này!
  details?: Record<string, string[]>;
}

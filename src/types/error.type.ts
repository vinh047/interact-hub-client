// Có thể dùng chung cho Error trả về từ file ErrorResponse bên Backend
export interface ErrorResponse {
  errorCode: string;
  message: string;
  details?: Record<string, string[]>;
}
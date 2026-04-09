import api from "./api";
import type { LoginRequest, LoginResponse, RegisterRequest } from "@/types/auth.type";
import type { User } from "@/types/user.type";

export const authService = {
  // Hàm xử lý Đăng nhập
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<unknown, LoginResponse>(
      "/auth/login",
      data,
    );
    return response;
  },

  // Hàm xử lý Đăng ký
  register: async (data: RegisterRequest) => {
    const response = await api.post("/auth/register", data);
    return response;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<unknown, User>("/auth/me");
    return response;
  },
};

import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import api from "@/services/api";
import { authService } from "@/services/auth.service"; // Nhớ import authService
import type { User } from "@/types/user.type";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  setAuthSession: (userData: User) => void;
  updateUser: (data: Partial<User>) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // đọc từ localStorage để UI hiện ra ngay lập tức (UI Cache)
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Chạy ngầm kiểm tra phiên đăng nhập với Backend
  useEffect(() => {
    const verifySession = async () => {
      // Chỉ kiểm tra nếu Frontend đang nghĩ là có user đăng nhập
      if (user) {
        try {
          const freshUserData = await authService.getMe();

          // Nếu thành công, cập nhật lại thông tin mới nhất
          setAuthSession(freshUserData);
        } catch {
          // Nếu lỗi (ví dụ 401 Cookie hết hạn), tự động xóa sạch dữ liệu Frontend
          // Lưu ý: Interceptor ở api.ts cũng sẽ chạy và đá văng về /login
          console.error("Phiên đăng nhập không hợp lệ hoặc đã hết hạn.");
          localStorage.removeItem("user");
          setUser(null);
        }
      }
    };

    verifySession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setAuthSession = (userData: User) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setAuthSession(updatedUser);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Lỗi khi xóa Cookie ở server:", error);
    } finally {
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        setAuthSession,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

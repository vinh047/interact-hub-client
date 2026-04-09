import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { authService } from "@/services/auth.service";
import type { RegisterRequest } from "@/types/auth.type";
import {
  getFriendlyErrorMessage,
  extractFieldErrors,
} from "@/utils/errorHandler";
import { toast } from "sonner";
import { registerSchema, type RegisterFormValues } from "@/validations/auth";

export default function Register() {
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [backendFieldErrors, setBackendFieldErrors] = useState<
    Record<string, string>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setGlobalError(null);
    setBackendFieldErrors({});
    setIsLoading(true);

    try {
      const payload: RegisterRequest = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      };

      await authService.register(payload);

      toast.success("Đăng ký thành công!", {
        description: "Vui lòng đăng nhập để tiếp tục.",
      });

      navigate("/login");
    } catch (error) {
      const fieldErrors = extractFieldErrors(error);
      if (fieldErrors) {
        setBackendFieldErrors(fieldErrors);
      } else {
        setGlobalError(getFriendlyErrorMessage(error));
        toast.error("Đăng ký thất bại", {
          description: getFriendlyErrorMessage(error),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-[2rem] shadow-sm border border-gray-100 mt-4 mb-4">
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
          Tạo tài khoản
        </h1>
        <p className="text-gray-500 text-sm">
          Nhập thông tin của bạn để tham gia cộng đồng.
        </p>
      </div>

      {globalError && (
        <div className="mb-6 p-4 bg-red-50/50 border border-red-100 text-red-600 rounded-2xl text-sm text-center font-medium">
          {globalError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Ô Họ Tên */}
        <div className="space-y-2">
          <Label
            htmlFor="fullName"
            className="text-xs font-bold text-gray-700 ml-1"
          >
            Họ và tên
          </Label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              id="fullName"
              placeholder="John Doe"
              // Cập nhật border-gray-300 và focus-visible
              className={`pl-11 h-14 bg-gray-50/80 border-gray-300 rounded-2xl text-base focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-blue-600 focus-visible:bg-white transition-all ${
                errors.fullName
                  ? "border-red-500 bg-red-50 focus-visible:ring-red-500 focus-visible:border-red-500"
                  : ""
              }`}
              {...register("fullName")}
            />
          </div>
          {errors.fullName && (
            <p className="text-sm text-red-500 ml-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Ô Email */}
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-xs font-bold text-gray-700 ml-1"
          >
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              id="email"
              type="email"
              placeholder="john@university.edu"
              // Cập nhật border-gray-300 và focus-visible
              className={`pl-11 h-14 bg-gray-50/80 border-gray-300 rounded-2xl text-base focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-blue-600 focus-visible:bg-white transition-all ${
                errors.email || backendFieldErrors.email
                  ? "border-red-500 bg-red-50 focus-visible:ring-red-500 focus-visible:border-red-500"
                  : ""
              }`}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500 ml-1">{errors.email.message}</p>
          )}
          {backendFieldErrors.email && (
            <p className="text-sm text-red-500 ml-1">
              {backendFieldErrors.email}
            </p>
          )}
        </div>

        {/* Ô Mật Khẩu */}
        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-xs font-bold text-gray-700 ml-1"
          >
            Mật khẩu
          </Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              // Cập nhật border, focus và Ẩn con mắt mặc định [&::-ms-reveal]:hidden
              className={`pl-11 pr-12 h-14 bg-gray-50/80 border-gray-300 rounded-2xl text-base focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-blue-600 focus-visible:bg-white transition-all [&::-ms-reveal]:hidden ${
                errors.password || backendFieldErrors.password
                  ? "border-red-500 bg-red-50 focus-visible:ring-red-500 focus-visible:border-red-500"
                  : ""
              }`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500 ml-1">
              {errors.password.message}
            </p>
          )}
          {backendFieldErrors.password && (
            <p className="text-sm text-red-500 ml-1">
              {backendFieldErrors.password}
            </p>
          )}
        </div>

        {/* Ô Xác Nhận Mật Khẩu */}
        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-xs font-bold text-gray-700 ml-1"
          >
            Xác nhận Mật khẩu
          </Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              // Cập nhật border, focus và Ẩn con mắt mặc định [&::-ms-reveal]:hidden
              className={`pl-11 pr-12 h-14 bg-gray-50/80 border-gray-300 rounded-2xl text-base focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-blue-600 focus-visible:bg-white transition-all [&::-ms-reveal]:hidden ${
                errors.confirmPassword
                  ? "border-red-500 bg-red-50 focus-visible:ring-red-500 focus-visible:border-red-500"
                  : ""
              }`}
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 ml-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Checkbox điều khoản (Bổ sung) */}
        <div className="flex items-start gap-3 pt-2">
          <input
            type="checkbox"
            id="terms"
            // 1. SỬA MÀU CHECKBOX: Thêm 'accent-blue-600' để ép trình duyệt đổi màu
            // Thêm 'shrink-0' để ô vuông không bị bóp méo nếu chữ quá dài
            // Thêm 'cursor-pointer' để hiện hình bàn tay
            className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 accent-blue-600 focus:ring-blue-600 cursor-pointer"
            {...register("terms")}
          />

          <Label
            htmlFor="terms"
            // Thêm flex-1 để nhãn chiếm hết phần không gian còn lại bên phải
            className="flex-1 text-sm text-gray-500 leading-relaxed cursor-pointer"
          >
            {/* 2. SỬA LỖI XẾP CỘT: Bọc tất cả vào một thẻ span */}
            <span className="block">
              Tôi đồng ý với{" "}
              <Link to="#" className="text-blue-600 font-bold hover:underline">
                Điều khoản dịch vụ
              </Link>{" "}
              và{" "}
              <Link to="#" className="text-blue-600 font-bold hover:underline">
                Chính sách bảo mật
              </Link>
              .
            </span>
          </Label>
        </div>
        {errors.terms && (
          <p className="text-sm text-red-500 ml-1 mt-0">
            {errors.terms.message}
          </p>
        )}

        <Button
          type="submit"
          className="w-full h-14 mt-4 text-base font-semibold rounded-full bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
          disabled={isLoading}
        >
          {isLoading ? "Đang xử lý..." : "Đăng ký"}
          {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm font-medium text-gray-500">
        Đã có tài khoản?{" "}
        <Link to="/login" className="text-blue-600 font-bold hover:underline">
          Đăng nhập
        </Link>
      </div>
    </div>
  );
}

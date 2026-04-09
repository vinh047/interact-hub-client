import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { authService } from "@/services/auth.service";
import { getFriendlyErrorMessage } from "@/utils/errorHandler";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { loginSchema, type LoginFormValues } from "@/validations/auth";


export default function Login() {
  const navigate = useNavigate();
  const { setAuthSession } = useAuth();

  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setGlobalError(null);
    setIsLoading(true);

    try {
      const response = await authService.login(data);

      setAuthSession(response.user);

      toast.success("Đăng nhập thành công!");

      navigate("/");
    } catch (error) {
      setGlobalError(getFriendlyErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-[2rem] shadow-sm border border-gray-100">
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
          Đăng nhập
        </h1>
        <p className="text-gray-500 text-sm">
          Chào mừng bạn quay trở lại cộng đồng InteractHub.
        </p>
      </div>

      {globalError && (
        <div className="mb-6 p-4 bg-red-50/50 border border-red-100 text-red-600 rounded-2xl text-sm text-center font-medium">
          {globalError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              // ĐÃ SỬA: Đổi sang border-gray-300 để có viền rõ ràng
              className={`pl-11 h-14 bg-gray-50/80 border-gray-300 rounded-2xl text-base focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-blue-600 focus-visible:bg-white transition-all ${
                errors.email
                  ? "border-red-500 bg-red-50 focus-visible:ring-red-500 focus-visible:border-red-500"
                  : ""
              }`}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500 ml-1">{errors.email.message}</p>
          )}
        </div>

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
              // ĐÃ SỬA: Đổi sang border-gray-300 để có viền rõ ràng
              className={`pl-11 pr-12 h-14 bg-gray-50/80 border-gray-300 rounded-2xl text-base focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-blue-600 focus-visible:bg-white transition-all ${
                errors.password
                  ? "border-red-500 bg-red-50 focus-visible:ring-red-500 focus-visible:border-red-500"
                  : ""
              }`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
        </div>

        <div className="flex items-center justify-end">
          <Link
            to="#"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full h-14 text-base font-semibold rounded-full bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
          disabled={isLoading}
        >
          {isLoading ? "Đang xử lý..." : "Đăng nhập"}
          {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm font-medium text-gray-500">
        Chưa có tài khoản?{" "}
        <Link
          to="/register"
          className="text-blue-600 font-bold hover:underline"
        >
          Đăng ký
        </Link>
      </div>
    </div>
  );
}

import { Link, useLocation } from "react-router-dom";
import { Home, Compass, Bell, User, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export default function DesktopSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  // Danh sách các menu item để render cho gọn
  const menuItems = [
    { name: "Trang chủ", icon: Home, path: "/" },
    { name: "Khám phá", icon: Compass, path: "/explore" },
    { name: "Thông báo", icon: Bell, path: "/notifications" },
    { name: "Hồ sơ", icon: User, path: `/profile/${user?.id || "me"}` },
  ];

  return (
    <div className="flex flex-col h-full py-6 px-4">
      {/* 2. Menu chính */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group",
                isActive
                  ? "bg-blue-50 text-blue-600 font-bold"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium",
              )}
            >
              <item.icon
                className={cn(
                  "w-6 h-6 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "fill-blue-100" : "", // Thêm hiệu ứng fill nếu icon hỗ trợ
                )}
              />
              <span className="text-lg hidden lg:block">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* 3. Khu vực Avatar & Settings (Dưới cùng) */}
      <div className="mt-auto space-y-2">
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-gray-600 hover:bg-gray-100 transition-all font-medium group">
          <Settings className="w-6 h-6 transition-transform duration-200 group-hover:rotate-90" />
          <span className="text-lg hidden lg:block">Cài đặt</span>
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-medium group"
        >
          <LogOut className="w-6 h-6 transition-transform duration-200 group-hover:-translate-x-1" />
          <span className="text-lg hidden lg:block">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}

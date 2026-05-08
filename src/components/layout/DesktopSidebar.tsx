import { Link, useLocation } from "react-router-dom";
import { Home, Users, Archive, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
// Import hook lấy thông tin user đăng nhập
import { useAuth } from "@/contexts/AuthContext";

export default function DesktopSidebar() {
  const location = useLocation();
  const { user } = useAuth(); // Lấy user hiện tại

  // Lấy ID của user, nếu chưa load kịp thì để tạm "me"
  const userId = user?.id || "me";

  const menuItems = [
    { name: "Trang chủ", icon: Home, path: "/" },
    { name: "Khám phá", icon: Compass, path: "/explore" },
    // Dùng template string (``) để chèn userId động vào link
    { name: "Bạn bè", icon: Users, path: `/profile/${userId}?tab=friends` },
    { name: "Kho lưu trữ tin", icon: Archive, path: `/profile/${userId}?tab=archive` },
  ];

  return (
    <div className="absolute top-12 left-0 h-75 flex flex-col w-70 bg-transparent transition-all duration-300 ease-in-out z-50 rounded-r-2xl border-r border-transparent">
      
      <nav className="space-y-2 px-3 w-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {menuItems.map((item) => {
          // Lấy toàn bộ đường dẫn bao gồm cả phần ?tab=...
          const currentUrl = location.pathname + location.search;
          
          // Kiểm tra xem item hiện tại có đang được active không
          const isActive = item.path.includes("?") 
            ? currentUrl === item.path // Nếu link có ?tab= thì phải khớp hoàn toàn
            : location.pathname === item.path; // Nếu không có thì chỉ cần khớp pathname

          return (
            <Link
              key={item.name}
              to={item.path}
              title={item.name}
              className={cn(
                "flex items-center px-3 py-3 rounded-xl transition-colors duration-200",
                isActive
                  ? "bg-blue-50 text-blue-600 font-bold"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 font-semibold"
              )}
            >
              <div className="w-7.5 flex justify-center shrink-0">
                <item.icon
                  strokeWidth={isActive ? 2.5 : 2}
                  className={cn(
                    "w-6.5 h-6.5 transition-transform duration-200",
                    isActive ? "fill-blue-100" : "" 
                  )}
                />
              </div>

              <span className="text-[16px] xl:text-[17px] tracking-tight whitespace-nowrap ml-4">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
      
    </div>
  );
}
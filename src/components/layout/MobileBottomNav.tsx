import { Link, useLocation } from "react-router-dom";
import { Home, Compass, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import UserAvatar from "@/components/common/UserAvatar";

export default function MobileBottomNav() {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { name: "Trang chủ", icon: Home, path: "/" },
    { name: "Khám phá", icon: Compass, path: "/explore" },
    {
      name: "Hồ sơ",
      icon: User,
      isAvatar: true,
      path: `/profile/${user?.id || "me"}`,
    },
  ];

  return (
    <nav className="flex items-center justify-around h-14 sm:h-16 px-2 w-full bg-transparent">
      {menuItems.map((item) => {
        const isActive = item.path.includes("?")
          ? location.pathname + location.search === item.path
          : location.pathname === item.path;

        return (
          <Link
            key={item.name}
            to={item.path}
            title={item.name}
            className="flex flex-col items-center justify-center flex-1 h-full relative group"
          >
            {/* Nếu là mục Avatar thì render ảnh thật */}
            {item.isAvatar ? (
              <div
                className={cn(
                  "flex items-center justify-center w-14 h-10 sm:w-16 sm:h-11 rounded-2xl transition-all duration-200",
                  isActive ? "bg-gray-100" : "hover:bg-gray-50",
                )}
              >
                <div
                  className={cn(
                    "w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full overflow-hidden transition-transform duration-200 active:scale-95 group-hover:scale-110",
                    isActive
                      ? "ring-2 ring-offset-2 ring-blue-600"
                      : "ring-1 ring-gray-200",
                  )}
                >
                  <UserAvatar
                    src={user?.avatarUrl}
                    name={user?.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ) : (
              <div
                className={cn(
                  "flex items-center justify-center w-14 h-10 sm:w-16 sm:h-11 rounded-2xl transition-all duration-200",
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                <item.icon
                  strokeWidth={isActive ? 2.5 : 2}
                  className={cn(
                    "w-6 h-6 sm:w-6.5 sm:h-6.5 transition-transform duration-200 active:scale-95 group-hover:scale-110",
                    isActive ? "fill-blue-100" : "",
                  )}
                />
              </div>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

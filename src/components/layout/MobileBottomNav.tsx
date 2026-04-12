import { Link, useLocation } from "react-router-dom";
import { Home, Compass, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export default function MobileBottomNav() {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Explore", icon: Compass, path: "/explore" },
    { name: "Notifications", icon: Bell, path: "/notifications" },
    { name: "Profile", icon: User, path: `/profile/${user?.id || "me"}` },
  ];

  return (
    <nav className="flex items-center justify-around h-16 px-2 pb-safe">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.name}
            to={item.path}
            className="flex flex-col items-center justify-center w-full h-full relative"
          >
            {/* Hiệu ứng chấm xanh nhỏ xíu ở trên đầu nếu đang active (Giống Instagram) */}
            {isActive && (
              <div className="absolute top-0 w-1 h-1 bg-blue-600 rounded-full" />
            )}

            <item.icon
              className={cn(
                "w-7 h-7 transition-all duration-200",
                isActive
                  ? "text-blue-600 scale-110"
                  : "text-gray-500 hover:text-gray-900",
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}

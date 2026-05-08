import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import UserAvatar from "@/components/common/UserAvatar";

export default function AvatarDropdown() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 cursor-pointer rounded-full border border-gray-200 overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all p-0.5 shrink-0 focus:outline-none"
      >
        <UserAvatar
          src={user?.avatarUrl}
          name={user?.fullName}
          className="w-full h-full object-cover"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 sm:right-0 mt-2 w-70 sm:w-85 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-200 z-50 overflow-hidden flex flex-col">
          <div className="p-3 shadow-sm border-b border-gray-100 z-10">
            <Link
              to={`/profile/${user?.id || "me"}`}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-gray-100"
            >
              <UserAvatar
                src={user?.avatarUrl}
                name={user?.fullName || "User"}
                className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] sm:text-[16px] font-bold text-gray-900 truncate">
                  {user?.fullName || "Người dùng InteractHub"}
                </p>
              </div>
            </Link>
          </div>

          <div className="p-2">
            {/* <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-100 text-gray-900 font-medium transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
                </div>
                <span className="text-[14px] sm:text-[15px]">
                  Cài đặt & Quyền riêng tư
                </span>
              </div>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            </Link> */}

            <button
              onClick={handleLogout}
              className="w-full cursor-pointer flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-100 text-gray-900 font-medium transition-colors text-left mt-1"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
                </div>
                <span className="text-[14px] sm:text-[15px]">Đăng xuất</span>
              </div>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { Link } from "react-router-dom";
import { Search, Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UserAvatar from "../common/UserAvatar";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white/90 backdrop-blur-md border-b border-gray-200 z-50 flex items-center justify-between px-4 md:px-8">
      {/* 1. Cụm Logo bên trái */}
      <Link to="/" className="flex items-center gap-2">
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-blue-200">
          IH
        </div>
        <span className="text-xl font-extrabold tracking-tight text-gray-900 hidden sm:block">
          InteractHub
        </span>
      </Link>

      {/* 2. Ô Tìm kiếm (Sẽ mở rộng và hiển thị rõ ở Desktop) */}
      <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Tìm kiếm trên InteractHub..."
          className="pl-10 h-10 w-full bg-gray-100 border-transparent rounded-full focus-visible:bg-white focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-200 transition-all text-sm"
        />
      </div>

      {/* 3. Cụm chức năng bên phải */}
      <div className="flex items-center gap-3">
        {/* Nút Tìm kiếm (Chỉ hiện ở Mobile vì Desktop đã có Input dài) */}
        <button className="md:hidden text-gray-600 hover:text-blue-600 transition-colors">
          <Search className="w-6 h-6" />
        </button>

        {/* Thông báo */}
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-full bg-gray-100 relative hidden sm:flex"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </Button>

        {/* Avatar User */}
        <Link
          to={`/profile/${user?.id || "me"}`}
          className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all p-0.5 shrink-0"
        >
          <UserAvatar
            src={user?.avatarUrl}
            name={user?.fullName}
            className="w-full h-full object-cover"
          />
        </Link>
      </div>
    </header>
  );
}

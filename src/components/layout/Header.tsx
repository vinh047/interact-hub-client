import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useSignalR } from "@/hooks/useSignalR";
import NotificationDropdown from "./dropdown/NotificationDropdown";
import AvatarDropdown from "./dropdown/AvatarDropdown";

export default function Header() {
  const navigate = useNavigate();

  // Lấy từ khóa từ URL (nếu đang ở trang Search) để đồng bộ với ô input
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";

  // Khởi tạo state bằng từ khóa hiện tại trên URL
  const [keyword, setKeyword] = useState(urlQuery);

  // Sử dụng Hook SignalR để lấy số lượng thông báo chưa đọc
  const { unreadCount, setUnreadCount } = useSignalR();

  // Cập nhật lại keyword trong input khi URL thay đổi (nhấn back hoặc click logo)
  useEffect(() => {
    setKeyword(urlQuery);
  }, [urlQuery]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && keyword.trim()) {
      // Điều hướng sang trang tìm kiếm và giữ lại keyword trong input
      navigate(`/search?q=${encodeURIComponent(keyword.trim())}&type=all`);
    }
  };

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

      {/* 2. Ô Tìm kiếm (Chỉ hiện trên desktop) */}
      <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Tìm kiếm trên InteractHub..."
          className="pl-10 h-10 w-full bg-gray-100 border-transparent rounded-full focus-visible:bg-white focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-200 transition-all text-sm"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      {/* 3. Cụm chức năng bên phải */}
      <div className="flex items-center gap-3">
        {/* Nút tìm kiếm mobile */}
        <button className="md:hidden text-gray-600 hover:text-blue-600 transition-colors">
          <Search className="w-6 h-6" />
        </button>

        {/* 
            COMPONENT THÔNG BÁO HOÀN CHỈNH 
            Đã tích hợp: Dropdown, Cuộn vô hạn, Đánh dấu đã đọc
        */}
        <NotificationDropdown
          unreadCount={unreadCount}
          setUnreadCount={setUnreadCount}
        />

        <AvatarDropdown />

        {/* Khu vực Trang cá nhân */}
        {/* <Link
          to={`/profile/${user?.id || "me"}`}
          className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all p-0.5 shrink-0"
        >
          <UserAvatar
            src={user?.avatarUrl}
            name={user?.fullName}
            className="w-full h-full object-cover"
          />
        </Link> */}
      </div>
    </header>
  );
}

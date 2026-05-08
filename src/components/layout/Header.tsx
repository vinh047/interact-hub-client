import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Search, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useSignalR } from "@/hooks/useSignalR";
import NotificationDropdown from "./dropdown/NotificationDropdown";
import AvatarDropdown from "./dropdown/AvatarDropdown";

export default function Header() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";
  const [keyword, setKeyword] = useState(urlQuery);
  const { unreadCount, setUnreadCount } = useSignalR();

  // STATE: Quản lý việc đóng/mở thanh tìm kiếm trên Mobile
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  useEffect(() => {
    setKeyword(urlQuery);
  }, [urlQuery]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && keyword.trim()) {
      navigate(`/search?q=${encodeURIComponent(keyword.trim())}&type=all`);
      setIsMobileSearchOpen(false); // Tự động đóng search trên mobile sau khi enter
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white/90 backdrop-blur-md border-b border-gray-200 z-50 flex items-center justify-between px-2 sm:px-4 md:px-8">
      {/* --- TRẠNG THÁI 1: KHI ĐANG MỞ SEARCH TRÊN MOBILE --- */}
      {isMobileSearchOpen ? (
        <div className="flex items-center w-full gap-2 animate-in fade-in slide-in-from-right-4 duration-200">
          <button
            onClick={() => setIsMobileSearchOpen(false)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              autoFocus
              type="text"
              placeholder="Tìm kiếm..."
              className="pl-9 h-9 w-full bg-gray-100 border-transparent rounded-full focus-visible:bg-white focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-200 text-sm"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        </div>
      ) : (
        /* --- TRẠNG THÁI 2: HEADER BÌNH THƯỜNG --- */
        <>
          {/* 1. Cụm Logo bên trái */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-blue-200">
              IH
            </div>
            <span className="text-xl font-extrabold tracking-tight text-gray-900 ">
              InteractHub
            </span>
          </Link>

          {/* 2. Ô Tìm kiếm (Desktop) */}
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
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Search className="w-5.5 h-5.5" />
            </button>

            <NotificationDropdown
              unreadCount={unreadCount}
              setUnreadCount={setUnreadCount}
            />

            <div className="hidden md:block">
              <AvatarDropdown />
            </div>
          </div>
        </>
      )}
    </header>
  );
}

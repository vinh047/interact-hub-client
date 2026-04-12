import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function MobileHeader() {
  const { user } = useAuth();

  return (
    // Dùng backdrop-blur để làm hiệu ứng kính mờ (khi cuộn bài viết ở dưới, nó sẽ lướt qua lớp kính nhìn rất xịn)
    <header className="flex items-center justify-between h-14 px-4 bg-white/80 backdrop-blur-md border-b border-gray-100">
      {/* Cụm Logo bên trái */}
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
          IH
        </div>
        <span className="text-xl font-extrabold tracking-tight text-gray-900">
          InteractHub
        </span>
      </Link>

      {/* Cụm chức năng bên phải */}
      <div className="flex items-center gap-4">
        {/* Nút tìm kiếm */}
        <button className="text-gray-600 hover:text-blue-600 transition-colors">
          <Search className="w-6 h-6" />
        </button>

        {/* Avatar User (Link thẳng tới trang cá nhân) */}
        <Link
          to={`/profile/${user?.id || "me"}`}
          className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300 ring-2 ring-transparent hover:ring-blue-600 transition-all"
        >
          {/* Tạm dùng api tạo avatar từ tên chữ cái đầu */}
          <img
            src={`https://ui-avatars.com/api/?name=${user?.fullName || "U"}&background=random`}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </Link>
      </div>
    </header>
  );
}

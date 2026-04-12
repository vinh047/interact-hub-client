import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function DesktopRightPanel() {
  // Dữ liệu giả (Mock data) - Sau này sẽ gọi API từ C# thay thế
  const trendingTags = [
    { tag: "#DotNet8", posts: "24.5K" },
    { tag: "#ReactJS", posts: "12.3K" },
    { tag: "#InteractHub", posts: "8.9K" },
    { tag: "#SGU", posts: "5.2K" },
  ];

  const friendSuggestions = [
    { name: "Nguyễn Văn A", mutual: "12 bạn chung", initials: "NA" },
    { name: "Trần Thị B", mutual: "5 bạn chung", initials: "TB" },
    { name: "Lê Hoàng C", mutual: "2 bạn chung", initials: "LC" },
  ];

  return (
    // overflow-y-auto để thanh này cuộn độc lập với trang chính
    <div className="flex flex-col h-full py-4 px-6 space-y-6 overflow-y-auto scrollbar-hide">
      {/* 1. Ô Tìm kiếm (Cố định ở trên cùng) */}
      <div className="sticky top-0 bg-white z-10 pt-2 pb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Tìm kiếm trên InteractHub..."
            className="pl-11 h-12 bg-gray-100 border-transparent rounded-full focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-600 transition-all text-base"
          />
        </div>
      </div>

      {/* 2. Khối Trending (Xu hướng) */}
      <div className="bg-gray-50 rounded-[1.5rem] p-5 border border-gray-100">
        <h3 className="text-xl font-extrabold text-gray-900 mb-4">
          Đang thịnh hành
        </h3>
        <div className="space-y-4">
          {trendingTags.map((item) => (
            <Link
              to={`/explore?tag=${item.tag.replace("#", "")}`}
              key={item.tag}
              className="block group"
            >
              <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {item.tag}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {item.posts} bài viết
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Khối Gợi ý kết bạn */}
      <div className="bg-gray-50 rounded-[1.5rem] p-5 border border-gray-100">
        <h3 className="text-xl font-extrabold text-gray-900 mb-4">
          Gợi ý cho bạn
        </h3>
        <div className="space-y-4">
          {friendSuggestions.map((user, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
                  {user.initials}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900 hover:underline cursor-pointer line-clamp-1">
                    {user.name}
                  </span>
                  <span className="text-xs text-gray-500">{user.mutual}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full h-8 px-4 text-xs font-bold border-gray-300 hover:bg-gray-200"
              >
                Thêm
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Footer Mini (Bản quyền) */}
      <div className="text-[13px] text-gray-400 flex flex-wrap gap-x-3 gap-y-1 px-2 pb-8">
        <a href="#" className="hover:underline">
          Bảo mật
        </a>
        <a href="#" className="hover:underline">
          Điều khoản
        </a>
        <a href="#" className="hover:underline">
          Cookie
        </a>
        <span>© 2026 InteractHub SGU</span>
      </div>
    </div>
  );
}

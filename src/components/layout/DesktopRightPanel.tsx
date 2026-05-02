import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { hashtagService } from "@/services/hashtag.service";

interface TrendingTag {
  id: string;
  name: string;
  trendingScore: number;
}

export default function DesktopRightPanel() {
  const [trendingTags, setTrendingTags] = useState<TrendingTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hàm fomat số lượng: 1200 -> 1.2K
  const formatScore = (score: number) => {
    if (score >= 1000) return (score / 1000).toFixed(1) + "K";
    return score.toString();
  };

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await hashtagService.getTrendingHashtags();
        setTrendingTags(data);
      } catch (error) {
        console.error("Lỗi khi tải trending hashtags:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrending();
  }, []);

  const friendSuggestions = [
    { name: "Nguyễn Văn A", mutual: "12 bạn chung", initials: "NA" },
    { name: "Trần Thị B", mutual: "5 bạn chung", initials: "TB" },
    { name: "Lê Hoàng C", mutual: "2 bạn chung", initials: "LC" },
  ];

  return (
    <div className="flex flex-col h-full py-4 px-6 space-y-6 overflow-y-auto scrollbar-hide">
      {/* KHỐI TRENDING (ĐÃ ĐƯỢC GẮN API) */}
      <div className="bg-gray-50 rounded-[1.5rem] p-5 border border-gray-100">
        <h3 className="text-xl font-extrabold text-gray-900 mb-4">
          Đang thịnh hành
        </h3>

        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : trendingTags.length > 0 ? (
          <div className="space-y-4">
            {trendingTags.map((item) => (
              <Link
                // Trỏ thẳng về trang Tìm Kiếm Tổng Hợp mà chúng ta vừa thống nhất
                to={`/search?q=${item.name}&type=hashtag`}
                key={item.id}
                className="block group"
              >
                <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  #{item.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatScore(item.trendingScore)} lượt tương tác
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-2">
            Chưa có xu hướng nào
          </p>
        )}
      </div>

      {/* KHỐI GỢI Ý KẾT BẠN (Tạm giữ nguyên Mock data) */}
      {/* <div className="bg-gray-50 rounded-[1.5rem] p-5 border border-gray-100">
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
      </div> */}

      {/* Footer Mini */}
      {/* <div className="text-[13px] text-gray-400 flex flex-wrap gap-x-3 gap-y-1 px-2 pb-8">
        <a href="#" className="hover:underline">Bảo mật</a>
        <a href="#" className="hover:underline">Điều khoản</a>
        <a href="#" className="hover:underline">Cookie</a>
        <span>© 2026 InteractHub SGU</span>
      </div> */}
    </div>
  );
}

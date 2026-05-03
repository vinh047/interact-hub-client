import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, TrendingUp } from "lucide-react";
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
    <div className="flex flex-col h-full py-2 px-2 space-y-6 overflow-y-auto custom-scrollbar pb-20">
      {/* KHỐI TRENDING */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">
            Đang thịnh hành
          </h3>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : trendingTags.length > 0 ? (
          <div className="flex flex-col mt-2">
            {trendingTags.map((item) => (
              <Link
                to={`/search?q=${item.name}&type=posts`}
                key={item.id}
                className="flex flex-col py-2.5 px-3 -mx-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <p className="text-[15px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  #{item.name}
                </p>
                <p className="text-[13px] text-gray-500 mt-0.5 font-medium">
                  {formatScore(item.trendingScore)} lượt tương tác
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-[14px] text-gray-500 font-medium">
              Chưa có xu hướng nào
            </p>
          </div>
        )}
      </div>

      {/* KHỐI GỢI Ý KẾT BẠN (Đã tinh chỉnh CSS) */}
      {/* <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h3 className="text-lg font-extrabold text-gray-900 mb-4 tracking-tight">
          Gợi ý cho bạn
        </h3>
        <div className="flex flex-col gap-4">
          {friendSuggestions.map((user, idx) => (
            <div key={idx} className="flex items-center justify-between group">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  {user.initials}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] font-bold text-gray-900 group-hover:underline cursor-pointer truncate">
                    {user.name}
                  </span>
                  <span className="text-[12px] text-gray-500 truncate">{user.mutual}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 rounded-full h-8 px-4 text-xs font-bold border-gray-300 hover:bg-gray-100 transition-colors ml-2"
              >
                Thêm
              </Button>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}

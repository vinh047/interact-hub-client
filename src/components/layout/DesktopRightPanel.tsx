import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, TrendingUp, Users } from "lucide-react";
import { hashtagService } from "@/services/hashtag.service";
import { userService } from "@/services/user.service";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/user.type";
import { friendshipService } from "@/services/friendship.service";
import { toast } from "sonner";

interface TrendingTag {
  id: string;
  name: string;
  trendingScore: number;
}

export default function DesktopRightPanel() {
  const [trendingTags, setTrendingTags] = useState<TrendingTag[]>([]);
  const [isLoadingTrending, setIsLoadingTrending] = useState(true);

  // Thêm state cho Gợi ý kết bạn
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);

  const [processingId, setProcessingId] = useState<string | null>(null);

  // Hàm fomat số lượng: 1200 -> 1.2K
  const formatScore = (score: number) => {
    if (score >= 1000) return (score / 1000).toFixed(1) + "K";
    return score.toString();
  };

  // Hàm lấy chữ cái đầu của tên làm Avatar
  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleAddFriend = async (userId: string) => {
    try {
      setProcessingId(userId); // Bật loading cho nút vừa bấm

      // Gọi service giống hệt bên ProfileHeader
      await friendshipService.sendRequest(userId);
      toast.success("Đã gửi lời mời kết bạn");

      // Cập nhật lại danh sách: Đánh dấu người này đã được gửi lời mời
      setSuggestions((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isRequester: true } : u)),
      );
    } catch {
      toast.error("Không thể gửi lời mời kết bạn.");
    } finally {
      setProcessingId(null); // Tắt loading
    }
  };

  const handleCancelRequest = async (userId: string) => {
    try {
      setProcessingId(userId); // Bật loading

      // Tái sử dụng logic hủy kết bạn giống ProfileHeader
      await friendshipService.removeFriendship(userId);
      toast.success("Đã hủy lời mời kết bạn");

      // Cập nhật lại danh sách: Gỡ cờ isSent để nút quay về chữ "Thêm"
      setSuggestions((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isRequester: false } : u)),
      );
    } catch {
      toast.error("Không thể hủy lời mời.");
    } finally {
      setProcessingId(null); // Tắt loading
    }
  };

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await hashtagService.getTrendingHashtags();
        setTrendingTags(data);
      } catch (error) {
        console.error("Lỗi khi tải trending hashtags:", error);
      } finally {
        setIsLoadingTrending(false);
      }
    };

    // FETCH GỢI Ý KẾT BẠN
    const fetchSuggestions = async () => {
      try {
        const res = await userService.getFriendSuggestions(1, 5);
        setSuggestions(res.data || []);
      } catch (error) {
        console.error("Lỗi khi tải gợi ý kết bạn:", error);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    fetchTrending();
    fetchSuggestions();
  }, []);

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

        {isLoadingTrending ? (
          <div className="flex justify-center py-6">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : trendingTags.length > 0 ? (
          <div className="flex flex-col mt-2">
            {trendingTags.map((item) => (
              <Link
                to={`/search?q=%23${item.name}&type=posts`}
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

      {/* KHỐI GỢI Ý KẾT BẠN */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">
            Gợi ý cho bạn
          </h3>
        </div>

        {isLoadingSuggestions ? (
          <div className="flex justify-center py-6">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : suggestions.length > 0 ? (
          <div className="flex flex-col gap-4">
            {suggestions.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between group"
              >
                <Link
                  to={`/profile/${user.id}`}
                  className="flex items-center gap-3 overflow-hidden flex-1 min-w-0 mr-2"
                >
                  {/* Nếu có Avatar thì hiện, không có thì dùng Initials */}
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName}
                      className="w-10 h-10 shrink-0 rounded-full object-cover border border-gray-100"
                    />
                  ) : (
                    <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                      {getInitials(user.fullName)}
                    </div>
                  )}

                  <div className="flex flex-col min-w-0">
                    <span className="text-[14px] font-bold text-gray-900 group-hover:underline cursor-pointer truncate">
                      {user.fullName}
                    </span>
                    <span className="text-[12px] text-gray-500 truncate">
                      {user.mutualFriendsCount > 0
                        ? `${user.mutualFriendsCount} bạn chung`
                        : "Gợi ý mới"}
                    </span>
                  </div>
                </Link>

                {user.isRequester ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={processingId === user.id}
                    onClick={(e) => {
                      e.preventDefault();
                      handleCancelRequest(user.id);
                    }}
                    // Dùng group/btn để đổi text và màu nền khi hover
                    className="group/btn shrink-0 rounded-full h-8 px-4 text-xs font-bold bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 transition-all border border-transparent hover:border-red-200 w-[72px]"
                  >
                    {processingId === user.id ? (
                      <Loader2 className="w-3 h-3 animate-spin text-gray-500" />
                    ) : (
                      <>
                        <span className="block group-hover/btn:hidden">
                          Đã gửi
                        </span>
                        <span className="hidden group-hover/btn:block">
                          Hủy
                        </span>
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={processingId === user.id}
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddFriend(user.id);
                    }}
                    className="shrink-0 rounded-full h-8 px-4 text-xs font-bold border-gray-300 hover:bg-gray-100 transition-colors w-[72px]"
                  >
                    {processingId === user.id ? (
                      <Loader2 className="w-3 h-3 animate-spin text-gray-500" />
                    ) : (
                      "Thêm"
                    )}
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-[14px] text-gray-500 font-medium">
              Không có gợi ý nào
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

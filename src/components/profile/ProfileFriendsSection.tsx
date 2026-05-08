import { useState, useEffect, useCallback, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { Loader2, Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { friendshipService } from "@/services/friendship.service";
import UserAvatar from "../common/UserAvatar";
import { Link } from "react-router-dom";
import type { FriendUserResponse } from "@/types/friendship.type";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { getFriendlyErrorMessage } from "@/utils/errorHandler";

interface ProfileFriendsSectionProps {
  userId: string;
}

type TabType = "all_friends" | "requests";

export default function ProfileFriendsSection({
  userId,
}: ProfileFriendsSectionProps) {
  const { user: currentUser } = useAuth();
  const isCurrentUser = currentUser?.id === userId;

  const [activeTab, setActiveTab] = useState<TabType>("all_friends");
  const [usersList, setUsersList] = useState<FriendUserResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const isFetchingRef = useRef(false);
  const { ref, inView } = useInView({ threshold: 0, rootMargin: "200px" });

  const fetchData = useCallback(
    async (currentPage: number, isReset: boolean = false) => {
      if (!userId || isFetchingRef.current) return;

      try {
        isFetchingRef.current = true;
        setIsFetching(true);

        let response;
        if (activeTab === "all_friends") {
          response = await friendshipService.getFriends({
            userId,
            page: currentPage,
            limit: 12,
            search: searchTerm,
          });
        } else if (activeTab === "requests") {
          response = await friendshipService.getPendingRequests({
            page: currentPage,
            limit: 12,
            // Không truyền search vào đây vì BE không xử lý
          });
        }

        const newItems = response?.data || [];
        setUsersList((prev) => (isReset ? newItems : [...prev, ...newItems]));

        const totalPages = response?.pagination?.totalPages || 1;
        setHasMore(currentPage < totalPages);
      } catch (error) {
        console.error("Lỗi tải danh sách:", error);
        const errorMessage = getFriendlyErrorMessage(error);

        if (isReset) {
          // Lỗi ngay lần đầu tải (chưa có data) -> Lưu vào state để in ra màn hình
          setPageError(errorMessage);
        } else {
          // Lỗi khi đang cuộn trang để xem thêm -> Hiện Toast
          toast.error("Không thể tải thêm danh sách", {
            description: errorMessage,
          });
        }
      } finally {
        isFetchingRef.current = false;
        setIsFetching(false);
        setIsInitialLoad(false);
      }
    },
    [userId, searchTerm, activeTab],
  );

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1);
      setHasMore(true);
      setIsInitialLoad(true);
      fetchData(1, true);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [fetchData]);

  useEffect(() => {
    if (inView && hasMore && !isFetching && !isInitialLoad) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchData(nextPage, false);
    }
  }, [inView, hasMore, isFetching, isInitialLoad, page, fetchData]);

  const handleAcceptRequest = async (requesterId: string) => {
    try {
      await friendshipService.acceptRequest(requesterId);
      setUsersList((prev) => prev.filter((u) => u.userId !== requesterId));
    } catch (error) {
      const errorMessage = getFriendlyErrorMessage(error);
      toast.error("Không thể chấp nhận lời mời", {
        description: errorMessage,
      });
    }
  };

  const handleDeclineRequest = async (requesterId: string) => {
    try {
      await friendshipService.removeFriendship(requesterId);
      setUsersList((prev) => prev.filter((u) => u.userId !== requesterId));
    } catch (error) {
      const errorMessage = getFriendlyErrorMessage(error);
      toast.error("Lỗi không thể từ chối lời mời", {
        description: errorMessage,
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      {/* 1. HEADER & SEARCH */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-[20px] font-bold text-gray-900">Bạn bè</h2>

        {/* CHỈ HIỆN Ô SEARCH KHI Ở TAB TẤT CẢ BẠN BÈ */}
        {activeTab === "all_friends" && (
          <div className="relative w-full sm:w-70">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#f0f2f5] border-transparent h-9 rounded-full focus-visible:ring-0 focus-visible:bg-gray-200 transition-colors text-[15px]"
            />
          </div>
        )}
      </div>

      {/* 2. TAB MENU ĐỘNG */}
      <div className="flex border-b border-gray-200 mt-4 gap-2">
        <button
          onClick={() => setActiveTab("all_friends")}
          className={`px-4 py-3 font-semibold text-[15px] transition-colors -mb-px ${
            activeTab === "all_friends"
              ? "text-blue-600 border-b-[3px] border-blue-600"
              : "text-gray-500 hover:bg-gray-50 rounded-t-lg"
          }`}
        >
          Tất cả bạn bè
        </button>

        {isCurrentUser && (
          <button
            onClick={() => {
              setActiveTab("requests");
              setSearchTerm(""); // Xóa text search khi sang tab Lời mời để tránh side-effect
            }}
            className={`px-4 py-3 font-semibold text-[15px] transition-colors -mb-px ${
              activeTab === "requests"
                ? "text-blue-600 border-b-[3px] border-blue-600"
                : "text-gray-500 hover:bg-gray-50 rounded-t-lg"
            }`}
          >
            Lời mời kết bạn
          </button>
        )}
      </div>

      {/* 3. DANH SÁCH BẠN BÈ / LỜI MỜI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        {pageError ? (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Không thể tải danh sách
            </h3>
            <p className="text-gray-500 max-w-sm mb-4">{pageError}</p>
            <Button onClick={() => fetchData(1, true)} variant="outline">
              Thử lại ngay
            </Button>
          </div>
        ) : isInitialLoad ? (
          <div className="col-span-full py-10 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : usersList.length > 0 ? (
          usersList.map((userObj) => (
            <div
              key={userObj.userId}
              className="flex items-center justify-between p-4 border border-gray-200 shadow-sm rounded-xl hover:shadow-md transition-all bg-white"
            >
              <Link
                to={`/profile/${userObj.userId}`}
                className="flex items-center gap-4 flex-1 min-w-0"
              >
                <UserAvatar
                  src={userObj.avatarUrl}
                  name={userObj.fullName}
                  className="w-16 h-16 shrink-0 shadow-sm"
                />
                <span className="font-semibold text-[16px] text-gray-900 hover:underline truncate">
                  {userObj.fullName}
                </span>
              </Link>

              {activeTab === "requests" && (
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <Button
                    onClick={() => handleAcceptRequest(userObj.userId)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 px-3"
                  >
                    Xác nhận
                  </Button>
                  <Button
                    onClick={() => handleDeclineRequest(userObj.userId)}
                    variant="secondary"
                    size="sm"
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold h-9 px-3"
                  >
                    Xóa
                  </Button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 font-medium">
              {activeTab === "requests"
                ? "Không có lời mời kết bạn nào."
                : "Không tìm thấy người bạn nào."}
            </p>
          </div>
        )}
      </div>

      {/* 4. INFINITE SCROLL OBSERVER */}
      {hasMore && !isInitialLoad && (
        <div ref={ref} className="py-4 flex justify-center col-span-full">
          {isFetching && (
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          )}
        </div>
      )}
    </div>
  );
}

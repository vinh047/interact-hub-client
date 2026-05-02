import { useState, useEffect, useCallback, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { Loader2, Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { friendshipService } from "@/services/friendship.service";
import UserAvatar from "../common/UserAvatar";
import { Link } from "react-router-dom";
import type { FriendUserResponse } from "@/types/friendship.type";

interface ProfileFriendsSectionProps {
  userId: string;
}

export default function ProfileFriendsSection({
  userId,
}: ProfileFriendsSectionProps) {
  const [friends, setFriends] = useState<FriendUserResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const isFetchingRef = useRef(false);
  const { ref, inView } = useInView({ threshold: 0, rootMargin: "200px" });

  const fetchFriends = useCallback(
    async (currentPage: number, isReset: boolean = false) => {
      if (!userId || isFetchingRef.current) return;

      try {
        isFetchingRef.current = true;
        setIsFetching(true);

        const response = await friendshipService.getFriends({
          userId,
          page: currentPage,
          limit: 12,
          search: searchTerm,
        });

        const newFriends = response.data || [];
        setFriends((prev) => (isReset ? newFriends : [...prev, ...newFriends]));

        const totalPages = response.pagination?.totalPages || 1;
        setHasMore(currentPage < totalPages);
      } catch (error) {
        console.error("Lỗi khi tải danh sách bạn bè:", error);
      } finally {
        isFetchingRef.current = false;
        setIsFetching(false);
        setIsInitialLoad(false);
      }
    },
    [userId, searchTerm],
  );

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1);
      setHasMore(true);
      setIsInitialLoad(true);
      fetchFriends(1, true);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [userId, searchTerm, fetchFriends]);

  useEffect(() => {
    if (inView && hasMore && !isFetching && !isInitialLoad) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchFriends(nextPage, false);
    }
  }, [inView, hasMore, isFetching, isInitialLoad, page, fetchFriends]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      {/* 1. HEADER & SEARCH */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-[20px] font-bold text-gray-900">Bạn bè</h2>
        <div className="relative w-full sm:w-70">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Tìm kiếm bạn bè"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#f0f2f5] border-transparent h-9 rounded-full focus-visible:ring-0 focus-visible:bg-gray-200 transition-colors text-[15px]"
          />
        </div>
      </div>

      {/* 2. TAB MENU */}
      <div className="flex border-b border-gray-200 mt-4">
        <button className="px-4 py-3 text-[#0866ff] border-b-[3px] border-[#0866ff] font-semibold text-[15px] -mb-px">
          Tất cả bạn bè
        </button>
      </div>

      {/* 3. DANH SÁCH BẠN BÈ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {isInitialLoad ? (
          <div className="col-span-full py-10 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : friends.length > 0 ? (
          friends.map((friend) => (
            <div
              key={friend.userId}
              // Thêm viền rõ hơn, đổ bóng nhẹ và bo góc lớn để tách biệt khối
              className="flex items-center justify-between p-4 border border-gray-200 shadow-sm rounded-xl hover:shadow-md transition-all bg-white"
            >
              <Link
                to={`/profile/${friend.userId}`}
                className="flex items-center gap-4"
              >
                <div className="shrink-0">
                  <UserAvatar
                    src={friend.avatarUrl}
                    name={friend.fullName}
                    className="w-18 h-18 shadow-sm"
                  />
                </div>
                <span className="font-semibold text-[16px] text-gray-900 hover:underline line-clamp-2">
                  {friend.fullName}
                </span>
              </Link>
              {/* Vị trí cho nút 3 chấm hoặc nút Hủy kết bạn sau này */}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 font-medium">
              Không tìm thấy người bạn nào.
            </p>
          </div>
        )}
      </div>

      {/* 4. OBSERVER TRANG TIẾP THEO */}
      {hasMore && !isInitialLoad && (
        <div ref={ref} className="py-4 flex justify-center">
          {isFetching && (
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          )}
        </div>
      )}
    </div>
  );
}

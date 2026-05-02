import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { friendshipService } from "@/services/friendship.service";
import type { FriendUserResponse } from "@/types/friendship.type";
import UserAvatar from "../common/UserAvatar";

export default function ProfileFriendsGrid({
  userId,
  friendCount,
}: {
  userId: string;
  friendCount: number;
}) {
  const [friends, setFriends] = useState<FriendUserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFriendsPreview = async () => {
      if (!userId) return;
      try {
        setIsLoading(true);
        // Lấy trang 1, giới hạn 9 người
        const response = await friendshipService.getFriends({
          page: 1,
          limit: 9,
          userId,
        });

        setFriends(response.data || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách bạn bè:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriendsPreview();
  }, [userId]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      {/* Header Bạn bè */}
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-xl font-bold text-gray-900">Bạn bè</h2>
        <Link to={`/profile/${userId}?tab=friends`} className="ml-auto">
          <button className="text-[#0866ff] hover:bg-blue-50 px-2 py-1 rounded-md text-[15px] transition-colors">
            Xem tất cả bạn bè
          </button>
        </Link>
      </div>

      {/* Số lượng */}
      <p className="text-gray-500 text-[15px] mb-4">{friendCount} người bạn</p>

      {/* Lưới hiển thị bạn bè */}
      {isLoading ? (
        <div className="text-center text-sm text-gray-500 py-8 flex justify-center items-center">
          <span className="animate-pulse">Đang tải...</span>
        </div>
      ) : friends.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {friends.map((friend) => (
            <Link
              to={`/profile/${friend.userId}`}
              key={friend.userId}
              className="flex flex-col gap-1 hover:opacity-90 transition-opacity"
            >
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                {friend.avatarUrl ? (
                  <img
                    src={friend.avatarUrl}
                    className="w-full h-full object-cover"
                    alt={friend.fullName}
                  />
                ) : (
                  <UserAvatar
                    name={friend.fullName}
                    shape="square"
                    className="w-full h-full rounded-none border-0"
                    fontSize="text-xl"
                  />
                )}
              </div>
              <span className="text-[13px] font-semibold text-gray-900 line-clamp-1 leading-tight mt-1">
                {friend.fullName}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center text-sm text-gray-500 py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          Chưa có bạn bè nào.
        </div>
      )}
    </div>
  );
}

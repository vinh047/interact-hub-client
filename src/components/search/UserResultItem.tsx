import { friendshipService } from "@/services/friendship.service";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Check, Loader2, UserCheck, UserPlus, UserX } from "lucide-react";
import { Link } from "react-router-dom";
import UserAvatar from "../common/UserAvatar";
import type { User } from "@/types/user.type";

export default function UserResultItem({ user }: { user: User }) {
  // Lấy trạng thái ban đầu từ API Search trả về
  const [status, setStatus] = useState<string | null>(
    user.friendshipStatus || null,
  );
  const [isRequester, setIsRequester] = useState(user.isRequester || false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleFriendAction = async (e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn việc click nút bị nhảy link sang trang Profile
    setIsActionLoading(true);

    try {
      if (status === "Accepted") {
        //  Hủy kết bạn
      } else if (status === "Pending") {
        if (isRequester) {
          // A gửi cho B -> Hủy yêu cầu
          await friendshipService.removeFriendship(user.id);
          setStatus(null);
          setIsRequester(false);
          toast.success("Đã hủy yêu cầu kết bạn");
        } else {
          // B gửi cho A -> Chấp nhận
          await friendshipService.acceptRequest(user.id);
          setStatus("Accepted");
          toast.success("Đã trở thành bạn bè");
        }
      } else {
        // Chưa có quan hệ -> Gửi yêu cầu kết bạn
        await friendshipService.sendRequest(user.id);
        setStatus("Pending");
        setIsRequester(true); // Đánh dấu mình là người gửi
        toast.success("Đã gửi yêu cầu kết bạn");
      }
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Render nút dựa theo trạng thái
  const renderFriendButton = () => {
    if (status === "Accepted") {
      return (
        <Button
          disabled
          variant="secondary"
          className="bg-gray-100 text-gray-700 font-semibold h-9 shrink-0"
        >
          <UserCheck className="w-4 h-4 mr-1.5" /> Bạn bè
        </Button>
      );
    }

    if (status === "Pending") {
      if (isRequester) {
        return (
          <Button
            onClick={handleFriendAction}
            disabled={isActionLoading}
            variant="secondary"
            className="bg-gray-200 hover:bg-red-50 hover:text-red-600 text-gray-900 font-semibold h-9 shrink-0 transition-colors"
          >
            {isActionLoading ? (
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
            ) : (
              <UserX className="w-4 h-4 mr-1.5" />
            )}
            Hủy yêu cầu
          </Button>
        );
      } else {
        return (
          <Button
            onClick={handleFriendAction}
            disabled={isActionLoading}
            className="bg-[#0866ff] hover:bg-blue-700 text-white font-semibold h-9 shrink-0"
          >
            {isActionLoading ? (
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
            ) : (
              <Check className="w-4 h-4 mr-1.5" />
            )}
            Chấp nhận
          </Button>
        );
      }
    }

    // Mặc định (Chưa kết bạn)
    return (
      <Button
        onClick={handleFriendAction}
        disabled={isActionLoading}
        variant="secondary"
        className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold h-9 shrink-0"
      >
        {isActionLoading ? (
          <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
        ) : (
          <UserPlus className="w-4 h-4 mr-1.5" />
        )}
        Thêm bạn bè
      </Button>
    );
  };

  return (
    <Link
      to={`/profile/${user.id}`}
      className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <UserAvatar
          src={user.avatarUrl}
          name={user.fullName}
          className="w-14 h-14 shadow-sm"
        />
        <div>
          <span className="font-semibold text-[15px] text-gray-900 group-hover:underline">
            {user.fullName}
          </span>
          <p className="text-[13px] text-gray-500 line-clamp-1">
            {user.bio || "Thành viên InteractHub"}
          </p>
        </div>
      </div>

      <div>{renderFriendButton()}</div>
    </Link>
  );
}

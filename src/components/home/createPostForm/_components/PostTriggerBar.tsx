import UserAvatar from "@/components/common/UserAvatar";
import { Image as ImageIcon } from "lucide-react";
import { type User } from "@/types/user.type";

interface PostTriggerBarProps extends React.HTMLAttributes<HTMLDivElement> {
  // Thêm extends để nhận thuộc tính HTML
  user: User | null;
  onMediaClick: () => void;
}

export function PostTriggerBar({
  user,
  onMediaClick,
  ...props
}: PostTriggerBarProps) {
  return (
    <div
      {...props}
      // sm:p-3 p-2.5: Giảm padding trên mobile. sm:gap-3 gap-2: Giảm khoảng cách.
      className="bg-white rounded-xl shadow-sm border border-gray-200 sm:p-3 p-2.5 flex items-center sm:gap-3 gap-2 cursor-pointer hover:bg-gray-50 transition-colors"
    >
      <UserAvatar
        src={user?.avatarUrl}
        name={user?.fullName}
        className="sm:h-10 sm:w-10 h-9 w-9" // Thu nhỏ avatar một chút trên mobile
      />
      {/* text-sm sm:text-[15px]: Chữ nhỏ hơn trên mobile */}
      <div className="flex-1 bg-gray-100 rounded-full py-2 sm:py-2.5 px-4 text-gray-500 text-sm sm:text-[15px] truncate">
        {user?.fullName} ơi, bạn đang nghĩ gì thế?
      </div>
      <div className="flex gap-2 pr-1">
        <div
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onMediaClick();
          }}
        >
          <ImageIcon className="text-green-500 w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>
    </div>
  );
}

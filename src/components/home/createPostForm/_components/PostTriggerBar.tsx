import UserAvatar from "@/components/common/UserAvatar";
import { Image as ImageIcon } from "lucide-react";
import { type User } from "@/types/user.type";

interface PostTriggerBarProps {
  user: User | null;
  onMediaClick: () => void;
}

export function PostTriggerBar({ user, onMediaClick }: PostTriggerBarProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors">
      <UserAvatar src={user?.avatarUrl} name={user?.fullName} className="h-10 w-10" />
      <div className="flex-1 bg-gray-100 rounded-full py-2.5 px-4 text-gray-500 text-[15px]">
        {user?.fullName} ơi, bạn đang nghĩ gì thế?
      </div>
      <div className="flex gap-2 pr-2">
        <div 
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          onClick={(e) => {
            e.stopPropagation(); // Ngăn mở Dialog ngay lập tức
            onMediaClick();
          }}
        >
          <ImageIcon className="text-green-500 w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
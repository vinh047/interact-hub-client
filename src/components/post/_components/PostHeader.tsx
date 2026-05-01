import {
  MoreHorizontal,
  Globe,
  Lock,
  Users,
  Pencil,
  Trash2,
  Flag,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import type { Post } from "@/types/post.type";
import type { PostVisibility } from "@/types/enum.type";
import UserAvatar from "@/components/common/UserAvatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const VISIBILITY_MAP: Record<
  PostVisibility,
  { icon: LucideIcon; label: string }
> = {
  Public: { icon: Globe, label: "Công khai" },
  FriendsOnly: { icon: Users, label: "Bạn bè" },
  Private: { icon: Lock, label: "Chỉ mình tôi" },
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface PostHeaderProps {
  post: Post;
  isOwner: boolean;
  isDeleting: boolean;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onReportClick: () => void;
}

export default function PostHeader({
  post,
  isOwner,
  isDeleting,
  onEditClick,
  onDeleteClick,
  onReportClick,
}: PostHeaderProps) {
  const vConfig = VISIBILITY_MAP[post.visibility] || VISIBILITY_MAP.Public;
  const VIcon = vConfig.icon;

  return (
    <div className="p-4 flex items-center justify-between">
      {/* THÔNG TIN NGƯỜI DÙNG */}
      <div className="flex items-center gap-3">
        <UserAvatar
          src={post.authorAvatar}
          name={post.authorName}
          className="w-10 h-10"
        />
        <div className="flex flex-col">
          <span className="font-bold text-[15px] hover:underline cursor-pointer text-gray-900">
            {post.authorName}
          </span>
          <div
            className="flex items-center gap-1.5 text-gray-500 text-[12px]"
            title={vConfig.label}
          >
            <span>{formatTime(post.createdAt)}</span>
            <span>•</span>
            <VIcon className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* DROPDOWN MENU 3 CHẤM  */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={isDeleting}
            className="rounded-full text-gray-500 hover:bg-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0 h-9 w-9"
          >
            {isDeleting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <MoreHorizontal className="w-5 h-5" />
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-48 rounded-xl shadow-lg border-gray-100 p-1"
        >
          {isOwner ? (
            <>
              <DropdownMenuItem
                onClick={onEditClick}
                className="flex items-center gap-3 px-3 py-2.5 text-[14px] font-medium text-gray-700 cursor-pointer rounded-lg"
              >
                <Pencil className="w-4 h-4 text-gray-500" /> Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDeleteClick}
                className="flex items-center gap-3 px-3 py-2.5 text-[14px] font-medium text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-700 rounded-lg"
              >
                <Trash2 className="w-4 h-4" /> Xóa bài viết
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem
              onClick={onReportClick}
              className="flex items-center gap-3 px-3 py-2.5 text-[14px] font-medium text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-700 rounded-lg"
            >
              <Flag className="w-4 h-4" /> Báo cáo
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

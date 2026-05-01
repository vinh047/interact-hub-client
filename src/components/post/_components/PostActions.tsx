import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PostActionsProps {
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isLoadingLike: boolean;
  onToggleLike: () => void;
  onCommentClick: () => void;
  onShareClick: () => void;
}

export default function PostActions({
  likeCount,
  commentCount,
  isLiked,
  isLoadingLike,
  onToggleLike,
  onCommentClick,
  onShareClick,
}: PostActionsProps) {
  return (
    <div className="px-4 py-1">
      <div className="flex items-center justify-between py-2 border-b border-gray-50">
        <div className="flex items-center gap-1.5 text-gray-500 text-[13px]">
          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
            <ThumbsUp className="w-2.5 h-2.5 text-white fill-current" />
          </div>
          <span>{likeCount}</span>
        </div>
        <span
          onClick={onCommentClick}
          className="text-gray-500 text-[13px] hover:underline cursor-pointer"
        >
          {commentCount} bình luận
        </span>
      </div>

      <div className="flex gap-1 py-1">
        <Button
          variant="ghost"
          onClick={onToggleLike}
          disabled={isLoadingLike}
          className={cn(
            "flex-1 gap-2 font-semibold transition-colors",
            isLiked ? "text-blue-600" : "text-gray-600",
          )}
        >
          <ThumbsUp className={cn("w-5 h-5", isLiked && "fill-current")} />{" "}
          Thích
        </Button>

        <Button
          variant="ghost"
          onClick={onCommentClick}
          className="flex-1 gap-2 font-semibold text-gray-600"
        >
          <MessageCircle className="w-5 h-5" /> Bình luận
        </Button>
        <Button
          variant="ghost"
          onClick={onShareClick}
          className="flex-1 gap-2 font-semibold text-gray-600"
        >
          <Share2 className="w-5 h-5" /> Chia sẻ
        </Button>
      </div>
    </div>
  );
}

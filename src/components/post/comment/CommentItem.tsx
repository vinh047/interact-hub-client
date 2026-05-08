import { useEffect, useState } from "react";
import UserAvatar from "@/components/common/UserAvatar";
import { formatRelativeTime } from "@/utils/date";
import type { Comment } from "@/types/comment.type";
import { commentService } from "@/services/comment.service";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

import CommentMenu from "./_components/CommentMenu";
import CommentEditForm from "./_components/CommentEditForm";
import { Link } from "react-router-dom";
import { getFriendlyErrorMessage } from "@/utils/errorHandler";

interface CommentItemProps {
  comment: Comment;
  onReply: (commentId: string, authorName: string, content: string) => void;
  postAuthorId: string;
}

export default function CommentItem({
  comment,
  onReply,
  postAuthorId,
}: CommentItemProps) {
  const { user: currentUser } = useAuth();

  const isCommentOwner = currentUser?.id === comment.authorId;
  const isPostOwner = currentUser?.id === postAuthorId;
  const canEdit = isCommentOwner;
  const canDelete = isCommentOwner || isPostOwner;

  const [currentComment, setCurrentComment] = useState<Comment>(comment);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [replies, setReplies] = useState<Comment[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);

  useEffect(() => {
    const handleNewReply = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { parentId, newComment } = customEvent.detail;

      // Nếu bình luận mới này đúng là đang trả lời cho comment hiện tại
      if (currentComment.id === parentId) {
        // 1. Nhét bình luận mới vào cuối danh sách replies
        setReplies((prev) => [...prev, newComment]);

        // 2. Tự động mở danh sách phản hồi ra để user nhìn thấy ngay
        setShowReplies(true);

        // 3. Tăng số đếm "Xem X phản hồi" lên 1
        setCurrentComment((prev) => ({
          ...prev,
          replyCount: prev.replyCount + 1,
        }));
      }
    };

    window.addEventListener("newReply", handleNewReply);
    return () => window.removeEventListener("newReply", handleNewReply);
  }, [currentComment.id]);

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bình luận này không?"))
      return;
    try {
      await commentService.deleteComment(currentComment.id);
      setIsDeleted(true);
      toast.success("Đã xóa bình luận");
    } catch (error){
      const errorMessage = getFriendlyErrorMessage(error);
      toast.error("Lỗi khi xóa bình luận", {
        description: errorMessage,
      });
    }
  };

  const handleSaveEdit = async (newContent: string) => {
    try {
      setIsSaving(true);
      const updatedCmt = await commentService.updateComment(
        currentComment.id,
        newContent.trim(),
      );
      setCurrentComment(updatedCmt);
      setIsEditing(false);
      toast.success("Đã cập nhật bình luận");
    } catch (error) {
      const errorMessage = getFriendlyErrorMessage(error);
      toast.error("Lỗi khi cập nhật bình luận", {
        description: errorMessage,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleReplies = async () => {
    if (showReplies) {
      setShowReplies(false);
      return;
    }
    if (replies.length === 0) {
      try {
        setIsLoadingReplies(true);
        const res = await commentService.getRepliesByCommentId(
          currentComment.id,
          1,
          20,
        );
        setReplies(res.data);
      } catch (error) {
        const errorMessage = getFriendlyErrorMessage(error);
        toast.error("Lỗi khi tải phản hồi", {
          description: errorMessage,
        });
      } finally {
        setIsLoadingReplies(false);
      }
    }
    setShowReplies(true);
  };

  if (isDeleted) return null;

  return (
    <div className="flex gap-2 mb-4 group w-full relative">
      {/* AVATAR */}
      <Link to={`/profile/${currentComment.authorId}`}>
        <UserAvatar
          src={currentComment.authorAvatarUrl}
          name={currentComment.authorName}
          className="w-8 h-8 mt-1 shrink-0"
        />
      </Link>

      <div className="flex flex-col w-full min-w-0">
        <div className="flex items-start gap-2">
          {/* NỘI DUNG HOẶC FORM SỬA */}
          {isEditing ? (
            <CommentEditForm
              initialContent={currentComment.content}
              isSaving={isSaving}
              onCancel={() => setIsEditing(false)}
              onSave={handleSaveEdit}
            />
          ) : (
            <>
              <div className="bg-gray-100 rounded-2xl px-3 py-2 max-w-fit">
                <Link to={`/profile/${currentComment.authorId}`}>
                  <span className="font-semibold text-[13px] text-gray-800 mr-2 cursor-pointer hover:underline">
                    {currentComment.authorName}
                  </span>
                </Link>
                <span className="text-[14px] text-gray-800 wrap-break-word whitespace-pre-wrap">
                  {currentComment.content}
                </span>
              </div>

              {/* MENU 3 CHẤM */}
              <div className="mt-1">
                <CommentMenu
                  canEdit={canEdit}
                  canDelete={canDelete}
                  onEdit={() => setIsEditing(true)}
                  onDelete={handleDelete}
                />
              </div>
            </>
          )}
        </div>

        {/* FOOTER BÌNH LUẬN: Thời gian, Nút Phản hồi */}
        {!isEditing && (
          <div className="flex items-center gap-3 mt-1 ml-2 text-[12px] text-gray-500 font-semibold">
            <span className="font-normal text-gray-400 shrink-0">
              {formatRelativeTime(currentComment.createdAt.toString())}
              {currentComment.updatedAt && " (đã chỉnh sửa)"}
            </span>
            <button
              onClick={() =>
                onReply(
                  currentComment.id,
                  currentComment.authorName,
                  currentComment.content,
                )
              }
              className="hover:underline cursor-pointer shrink-0"
            >
              Phản hồi
            </button>
          </div>
        )}

        {/* NÚT TOGGLE REPLIES */}
        {!isEditing && currentComment.replyCount > 0 && (
          <div className="mt-1 ml-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleReplies}
              disabled={isLoadingReplies}
              className="h-7 px-2 text-[13px] font-semibold text-gray-500 hover:text-gray-700 rounded-full"
            >
              {isLoadingReplies ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Đang tải...
                </>
              ) : showReplies ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5 mr-1.5" />
                  Ẩn bớt phản hồi
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5 mr-1.5" />
                  Xem {currentComment.replyCount} phản hồi
                </>
              )}
            </Button>
          </div>
        )}

        {/* KHỐI HIỂN THỊ REPLIES */}
        {showReplies && (
          <div className="mt-2 w-full pl-2 border-l-[1.5px] border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
            {replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onReply={onReply}
                postAuthorId={postAuthorId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

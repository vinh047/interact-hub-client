import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";

import type { Post } from "@/types/post.type";
import type { Comment } from "@/types/comment.type";
import { postService } from "@/services/post.service";
import { commentService } from "@/services/comment.service";

import PostCard from "./PostCard";
import CommentItem from "./comment/CommentItem";
import PostModalInput from "./_components/PostModalInput"; // Import component mới

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { getFriendlyErrorMessage } from "@/utils/errorHandler";

export default function PostModal() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [post, setPost] = useState<Post | null>(
    (location.state?.post as Post) || null,
  );
  const [isLoadingPost, setIsLoadingPost] = useState(!location.state?.post);

  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Chỉ còn lại đúng 1 state quản lý việc Reply
  const [replyingTo, setReplyingTo] = useState<{
    id: string;
    name: string;
    content: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!postId) return;
      try {
        setIsLoading(true);

        const postRes = await postService.getPostById(postId);
        setPost(postRes);
        setIsLoadingPost(false);

        const cmtRes = await commentService.getRootComments(postId, 1, 20);
        setComments(cmtRes.data);
      } catch (error) {
        const errorMessage = getFriendlyErrorMessage(error);

        console.log("Lỗi khi tải bài viết hoặc bình luận: ", errorMessage);

        toast.error("Không thể tải bài viết", {
          description: errorMessage,
        });
        setIsLoadingPost(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [postId]);

  const handleClose = () => {
    if (location.state?.background) navigate(-1);
    else navigate("/", { replace: true });
  };

  // Hàm này sẽ truyền xuống component Input để nó gọi khi bấm Enter
  const handleSubmitComment = async (text: string, replyId?: string) => {
    if (!postId) return;
    try {
      const newComment = await commentService.createComment(
        postId,
        text,
        replyId,
      );

      if (!replyId) {
        // Nếu là bình luận gốc -> Cập nhật list ở Modal
        setComments((prev) => [newComment, ...prev]);
      } else {
        window.dispatchEvent(
          new CustomEvent("newReply", {
            detail: { parentId: replyId, newComment },
          }),
        );
      }
    } catch {
      toast.error("Đăng bình luận thất bại");
      throw new Error("Lỗi");
    }
  };

  if (isLoadingPost) {
    return (
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="bg-transparent border-none shadow-none flex justify-center items-center h-full w-full max-w-none [&>button]:hidden">
          <DialogTitle className="sr-only">Đang tải</DialogTitle>
          <Loader2 className="w-10 h-10 animate-spin text-white" />
        </DialogContent>
      </Dialog>
    );
  }

  if (!post) {
    return (
      <Dialog open={true} onOpenChange={handleClose}>
        <DialogContent className="max-w-100 text-center rounded-xl">
          <DialogTitle>Bài viết không tồn tại</DialogTitle>
          <button
            onClick={handleClose}
            className="mt-4 text-blue-600 hover:underline"
          >
            Quay về trang chủ
          </button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={true}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
    >
      <DialogContent
        className="p-0 bg-[#F0F2F5] sm:rounded-xl overflow-hidden shadow-2xl gap-0 w-full sm:max-w-180 md:max-w-180 h-full sm:h-[90vh] sm:max-h-225 flex flex-col [&>button]:hidden"
        aria-describedby={undefined}
      >
        <DialogHeader className="bg-white border-b border-gray-200 px-4 py-3.5 flex items-center justify-center shrink-0 z-10 shadow-sm relative m-0">
          <DialogTitle className="text-[17px] font-bold text-gray-800 text-center w-full">
            Bài viết của {post.authorName}
          </DialogTitle>
          <button
            onClick={handleClose}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto bg-[#F0F2F5] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
          <div className="bg-white border-b [&>div]:mb-0 [&>div]:border-none [&>div]:shadow-none">
            <PostCard post={post} />
          </div>

          <div className="bg-white mt-2 p-4 min-h-75 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4 text-[15px]">
              Bình luận nổi bật
            </h3>
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-7 h-7 animate-spin text-gray-400" />
              </div>
            ) : comments.length > 0 ? (
              <div className="flex flex-col gap-1">
                {comments.map((cmt) => (
                  <CommentItem
                    key={cmt?.id || Math.random()}
                    comment={cmt}
                    onReply={(id, name, content) =>
                      setReplyingTo({ id, name, content })
                    }
                    postAuthorId={post.authorId}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <span className="text-gray-400 font-medium text-[15px]">
                  Chưa có bình luận nào
                </span>
                <span className="text-gray-400 text-sm mt-1">
                  Hãy là người đầu tiên nêu lên góc nhìn của bạn!
                </span>
              </div>
            )}
          </div>
        </div>

        {/* GỌI COMPONENT INPUT ĐÃ TÁCH */}
        <PostModalInput
          authorAvatar={post.authorAvatar ?? ""}
          authorsName={post.authorName}
          replyingTo={replyingTo}
          onClearReply={() => setReplyingTo(null)}
          onSubmit={handleSubmitComment}
        />
      </DialogContent>
    </Dialog>
  );
}

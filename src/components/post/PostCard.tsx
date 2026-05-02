import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import type { Post } from "@/types/post.type";
import { cn } from "@/lib/utils";
import { likeService } from "@/services/like.service";
import { postService } from "@/services/post.service";
import { useAuth } from "@/contexts/AuthContext";

import EditPostModal from "@/components/post/EditPostModal";
import ReportPostModal from "@/components/post/ReportPostModal";
import PostHeader from "./_components/PostHeader";
import PostMedia from "./_components/PostMedia";
import PostActions from "./_components/PostActions";
import FormattedContent from "../common/FormattedContent";

export default function PostCard({ post: initialPost }: { post: Post }) {
  const [post, setPost] = useState<Post>(initialPost);
  const { user: currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // --- STATE ---
  const [isLiked, setIsLiked] = useState(post.isLikedByCurrentUser);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [isLoadingLike, setIsLoadingLike] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const isOwner = currentUser?.id === post.authorId;

  useEffect(() => {
    setPost(initialPost);
  }, [initialPost]);

  // --- HANDLERS ---
  const openCommentModal = () => {
    if (location.pathname.includes(`/post/${post.id}`)) {
      return;
    }
    navigate(`/post/${post.id}`, {
      state: { background: location, post: post },
    });
  };

  const handleToggleLike = async () => {
    if (isLoadingLike) return;
    const prevIsLiked = isLiked;
    const prevCount = likeCount;

    setIsLiked(!prevIsLiked);
    setLikeCount((prev) => (prevIsLiked ? prev - 1 : prev + 1));

    try {
      setIsLoadingLike(true);
      const result = await likeService.toggleLike(post.id);
      setIsLiked(result.isLiked);
    } catch {
      setIsLiked(prevIsLiked);
      setLikeCount(prevCount);
      toast.error("Không thể thực hiện thao tác.");
    } finally {
      setIsLoadingLike(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/post/${post.id}`,
      );
      toast.success("Đã sao chép liên kết bài viết!");
    } catch {
      toast.error("Không thể sao chép liên kết.");
    }
  };

  const handleDeletePost = async () => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.",
      )
    )
      return;

    try {
      setIsDeleting(true);
      await postService.deletePost(post.id);
      toast.success("Đã xóa bài viết thành công!");
      if (location.pathname.includes(`/post/${post.id}`))
        navigate("/", { replace: true });
      else setIsDeleted(true);
    } catch {
      toast.error("Không thể xóa bài viết lúc này.");
      setIsDeleting(false);
    }
  };

  if (isDeleted) return null;

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-4",
        isDeleting && "opacity-50 pointer-events-none",
      )}
    >
      {/* 1. Header & Menu */}
      <PostHeader
        post={post}
        isOwner={isOwner}
        isDeleting={isDeleting}
        onEditClick={() => setIsEditModalOpen(true)}
        onDeleteClick={handleDeletePost}
        onReportClick={() => setIsReportModalOpen(true)}
      />

      {/* 2. Body Text */}
      {post.content && (
        <div className="px-4 pb-3 text-[15px] leading-relaxed text-gray-800 whitespace-pre-wrap">
          <FormattedContent content={post.content} />
        </div>
      )}

      {/* 3. Media Grid */}
      <PostMedia mediaFiles={post.mediaFiles} />

      {/* 4. Actions (Like, Comment, Share) */}
      <PostActions
        likeCount={likeCount}
        commentCount={post.commentCount}
        isLiked={isLiked}
        isLoadingLike={isLoadingLike}
        onToggleLike={handleToggleLike}
        onCommentClick={openCommentModal}
        onShareClick={handleShare}
      />

      {/* 5. Modals */}
      <EditPostModal
        post={post}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSuccess={async () => {
          try {
            const freshPost = await postService.getPostById(post.id);
            setPost(freshPost);
          } catch (error) {
            console.error("Lỗi khi tải lại bài viết:", error);
          }
        }}
      />
      <ReportPostModal
        postId={post.id}
        open={isReportModalOpen}
        onOpenChange={setIsReportModalOpen}
      />
    </div>
  );
}

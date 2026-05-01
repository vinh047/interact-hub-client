import { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import PostCard from "@/components/post/PostCard";
import { postService } from "@/services/post.service";
import { type Post } from "@/types/post.type";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Dùng Ref làm "ổ khóa" để chặn tuyệt đối việc gọi API đè lên nhau
  const isFetchingRef = useRef(false);

  // Khởi tạo Intersection Observer để theo dõi phần cuối trang
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  const fetchPosts = async (currentPage: number) => {
    // Nếu cửa đang khóa (đang call API dở) thì không cho chạy tiếp
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoading(true);

    const limit = 5;

    try {
      const response = await postService.getFeedPosts(currentPage, limit);
      const newPosts = response.data;

      setPosts((prev) => {
        if (currentPage === 1) return newPosts;

        const existingIds = new Set(prev.map((p) => p.id));
        const uniqueNewPosts = newPosts.filter((p) => !existingIds.has(p.id));

        return [...prev, ...uniqueNewPosts];
      });

      if (newPosts.length < limit) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error("Lỗi khi tải bài viết:", error);
      toast.error("Không thể tải bài viết mới");
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false; // Mở khóa
    }
  };

  // --- LẦN ĐẦU TIÊN LOAD TRANG ---
  useEffect(() => {
    fetchPosts(1);
  }, []);

  // --- THEO DÕI CUỘN TRANG (INFINITE SCROLL) ---
  useEffect(() => {
    if (inView && !isLoading && hasMore && posts.length > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, isLoading, hasMore, posts.length]);

  return (
    <div className="mt-4 space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {/* Vạch đích và trạng thái Loading */}
      <div ref={ref} className="py-8 flex flex-col items-center justify-center">
        {isLoading && (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="text-sm text-gray-500">Đang tải bài viết...</span>
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
            <p className="text-gray-500 text-sm italic">
              Bạn đã xem hết tất cả bài viết.
            </p>
          </div>
        )}

        {!isLoading && posts.length === 0 && !hasMore && (
          <p className="text-gray-500">Chưa có bài viết nào được đăng.</p>
        )}
      </div>
    </div>
  );
}

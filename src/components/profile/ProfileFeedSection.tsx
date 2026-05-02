import { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";

import CreatePost from "../home/createPostForm/CreatePostForm";
import PostCard from "@/components/post/PostCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { postService } from "@/services/post.service";
import type { Post, PostQueryParameters } from "@/types/post.type";
import type { PostVisibility } from "@/types/enum.type";

interface ProfileFeedSectionProps {
  isCurrentUser: boolean;
  userId: string;
}

export default function ProfileFeedSection({
  isCurrentUser,
  userId,
}: ProfileFeedSectionProps) {
  // --- STATE BỘ LỌC ---
  const [sortFilter, setSortFilter] = useState<string>("desc");
  const [visibilityFilter, setVisibilityFilter] = useState<
    "all" | PostVisibility
  >("all");

  // --- STATE PHÂN TRANG & DỮ LIỆU ---
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // --- INTERSECTION OBSERVER ---
  // Hook này sẽ báo cho chúng ta biết khi nào phần tử dưới cùng xuất hiện trên màn hình
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "400px", // Load trước khi cuộn chạm đáy 400px cho mượt
  });

  // --- LOGIC FETCH DỮ LIỆU ---
  const fetchPosts = useCallback(
    async (currentPage: number, isReset: boolean = false) => {
      if (!userId || isFetching) return;

      try {
        setIsFetching(true);
        const queryParams: PostQueryParameters = {
          page: currentPage,
          limit: 5,
          sort: sortFilter,
          ...(isCurrentUser && visibilityFilter !== "all"
            ? { visibility: visibilityFilter as PostVisibility }
            : {}),
        };

        const response = await postService.getUserPosts(userId, queryParams);

        console.log(response)

        const newPosts = response.data || [];

        setPosts((prev) => (isReset ? newPosts : [...prev, ...newPosts]));

        // Cập nhật trạng thái xem còn bài để tải không
        setHasMore(currentPage < response.pagination!.totalPages);
      } catch (error) {
        console.error("Lỗi khi tải bài viết:", error);
      } finally {
        setIsFetching(false);
        setIsInitialLoad(false);
      }
    },
    [userId, sortFilter, visibilityFilter, isCurrentUser, isFetching],
  );

  // 1. CHẠY LẠI TỪ ĐẦU KHI ĐỔI BỘ LỌC HOẶC ĐỔI USER
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setIsInitialLoad(true);
    fetchPosts(1, true); // true = reset danh sách cũ
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, sortFilter, visibilityFilter]);

  // 2. TẢI THÊM KHI CUỘN CHẠM ĐÁY (inView)
  useEffect(() => {
    if (inView && hasMore && !isFetching && !isInitialLoad) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage, false); // false = nối thêm vào danh sách cũ
    }
  }, [inView, hasMore, isFetching, isInitialLoad, page, fetchPosts]);

  return (
    <div className="space-y-4">
      {/* 1. KHU VỰC ĐĂNG BÀI */}
      {isCurrentUser && <CreatePost />}

      {/* 2. HEADER KHU VỰC BÀI VIẾT (BỘ LỌC) */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Bài viết</h2>

        <div className="flex gap-2">
          {/* Bộ lọc Sắp xếp */}
          <Select value={sortFilter} onValueChange={setSortFilter}>
            <SelectTrigger className="w-30 h-9 bg-gray-200 hover:bg-gray-300 border-none font-semibold text-gray-900 transition-colors focus:ring-0">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc" className="font-medium">
                Mới nhất
              </SelectItem>
              <SelectItem value="asc" className="font-medium">
                Cũ nhất
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Bộ lọc Quyền riêng tư (Chỉ chủ tài khoản) */}
          {isCurrentUser && (
            <Select
              value={visibilityFilter}
              onValueChange={(val) =>
                setVisibilityFilter(val as "all" | PostVisibility)
              }
            >
              <SelectTrigger className="w-35 h-9 bg-gray-200 hover:bg-gray-300 border-none font-semibold text-gray-900 transition-colors focus:ring-0">
                <SelectValue placeholder="Chế độ xem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="font-medium">
                  Tất cả
                </SelectItem>
                <SelectItem value="Public" className="font-medium">
                  Công khai
                </SelectItem>
                <SelectItem value="FriendsOnly" className="font-medium">
                  Bạn bè
                </SelectItem>
                <SelectItem value="Private" className="font-medium">
                  Chỉ mình tôi
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* 3. DANH SÁCH BÀI VIẾT */}
      <div className="flex flex-col gap-4">
        {isInitialLoad ? (
          // Hiệu ứng Loading lần đầu tiên
          <div className="py-10 flex justify-center bg-white rounded-lg border border-gray-200 shadow-sm">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : posts.length > 0 ? (
          // Render danh sách PostCard
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          // Trạng thái trống
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200 text-gray-500 font-medium shadow-sm">
            Chưa có bài viết nào.
          </div>
        )}
      </div>

      {/* 4. CỤM OBSERVER (ĐIỂM KÍCH HOẠT CUỘN) */}
      {/* Thẻ div này được gán ref, khi nó lọt vào màn hình thì useInView sẽ trigger gọi trang tiếp theo */}
      {hasMore && !isInitialLoad && (
        <div ref={ref} className="py-4 flex justify-center">
          {isFetching && (
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          )}
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="py-6 text-center text-gray-500 text-sm font-medium">
          Bạn đã xem hết bài viết.
        </div>
      )}
    </div>
  );
}

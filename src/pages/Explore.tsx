import { useState, useEffect } from "react";
import { Search, Compass, Loader2 } from "lucide-react";
import PostCard from "@/components/post/PostCard";
import { postService } from "@/services/post.service";
import type { Post } from "@/types/post.type";
import { hashtagService } from "@/services/hashtag.service";
import type { TrendingTag } from "@/types/hashtag.type";
import { searchService } from "@/services/search.service";

export default function Explore() {
  const [activeTag, setActiveTag] = useState("#TatCa");
  const [trendingTags, setTrendingTags] = useState<string[]>(["#TatCa"]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch danh sách Trending Hashtags khi load trang
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await hashtagService.getTrendingHashtags();
        // res là mảng TrendingTag, ta format thêm dấu # lên UI
        const tagsFromApi = res.map((t: TrendingTag) => `#${t.name}`);
        setTrendingTags(["#TatCa", ...tagsFromApi]);
      } catch (error) {
        console.error("Lỗi lấy hashtag:", error);
      }
    };
    fetchTags();
  }, []);

  // 2. Fetch bài viết mỗi khi thay đổi Tab Hashtag
  useEffect(() => {
    const fetchExplorePosts = async () => {
      setIsLoading(true);
      try {
        let res;
        if (activeTag === "#TatCa") {
          // Tái sử dụng API NewsFeed cho mục Dành cho bạn
          res = await postService.getFeedPosts(1, 20);
        } else {
          // Gửi trực tiếp hashtag (VD: #ReactJS) xuống API Search
          // Thư viện Axios bên trong api.ts sẽ tự động encode chữ # thành %23 trên URL
          res = await searchService.searchPosts(activeTag, 1, 20);
        }

        // Cập nhật state bài viết
        // (Lưu ý: PaginatedResponse của bạn trả về data là mảng bài viết, nên ta lấy res.data)
        setPosts(res.data || []);
      } catch (error) {
        console.error("Lỗi lấy bài viết khám phá:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExplorePosts();
  }, [activeTag]);

  return (
    <div className="w-full max-w-500 mx-auto pt-0 pb-10">
      {/* KHỐI HEADER CHUNG NẰM TRÊN 1 DÒNG */}
      <div className="sticky top-14 z-30 bg-white border-b border-gray-200 shadow-sm sm:rounded-t-xl overflow-hidden">
        <div className="px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-3">
          {/* 1. Phần Tiêu đề (Cố định, không bị co lại) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            <h1 className="text-base sm:text-lg font-bold text-gray-900">
              Khám phá
            </h1>
          </div>

          {/* Vạch phân cách */}
          <div className="w-px h-5 sm:h-6 bg-gray-300 shrink-0 rounded-full"></div>

          {/* 2. Phần Thanh cuộn Hashtag (Chiếm phần còn lại bên phải và tự cuộn) */}
          <div className="flex-1 overflow-x-auto custom-scrollbar -my-2 py-2">
            <div className="flex gap-2 w-max pr-4">
              {trendingTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-3 sm:px-4 py-1.5 rounded-full text-[13px] sm:text-[14px] font-semibold whitespace-nowrap transition-all active:scale-95 ${
                    activeTag === tag
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tag === "#TatCa" ? "Dành cho bạn" : tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DANH SÁCH BÀI VIẾT */}
      <div className="mt-2 sm:mt-4 px-0 sm:px-4 lg:px-0 max-w-200 mx-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
            <p className="font-medium">Đang tìm kiếm bài viết...</p>
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="text-center py-12 bg-white sm:rounded-b-xl border-t-0 border-y sm:border border-gray-200">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              Không có bài viết nào cho {activeTag}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

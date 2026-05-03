import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Users, FileText, Loader2 } from "lucide-react";
import PostCard from "@/components/post/PostCard";

import { searchService } from "@/services/search.service";
import type { User } from "@/types/user.type";
import type { Post } from "@/types/post.type";
import UserResultItem from "@/components/search/UserResultItem";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const filterType = searchParams.get("type") || "all";

  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFilterChange = (type: string) => {
    setSearchParams({ q: query, type });
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setUsers([]);
        setPosts([]);
        return;
      }

      setIsLoading(true);
      try {
        if (filterType === "all") {
          const [usersRes, postsRes] = await Promise.all([
            searchService.searchUsers(query, 1, 3),
            searchService.searchPosts(query, 1, 5),
          ]);
          setUsers(usersRes.data || []);
          setPosts(postsRes.data || []);
        } else if (filterType === "users") {
          const res = await searchService.searchUsers(query, 1, 10);
          setUsers(res.data || []);
          setPosts([]);
        } else if (filterType === "posts") {
          const res = await searchService.searchPosts(query, 1, 10);
          setPosts(res.data || []);
          setUsers([]);
        }
      } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSearchResults();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, filterType]);

  return (
    <div className="bg-[#f0f2f5] min-h-screen pt-4">
      <div className="max-w-275 mx-auto px-4 flex flex-col md:flex-row gap-4 items-start">
        <div className="w-full md:w-[320px] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden md:sticky md:top-20 shrink-0">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">
              Kết quả tìm kiếm
            </h2>
            {query && (
              <p className="text-[15px] text-gray-500 mt-1 truncate">
                Cho từ khóa:{" "}
                <span className="font-semibold text-gray-900">"{query}"</span>
              </p>
            )}
          </div>
          <div className="p-2 space-y-1">
            <h3 className="px-3 py-2 text-[15px] font-bold text-gray-900">
              Bộ lọc
            </h3>
            <button
              onClick={() => handleFilterChange("all")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-medium transition-colors ${filterType === "all" ? "bg-blue-50 text-[#0866ff]" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <div
                className={`p-1.5 rounded-full ${filterType === "all" ? "bg-[#0866ff] text-white" : "bg-gray-200"}`}
              >
                <Search className="w-4 h-4" />
              </div>{" "}
              Tất cả
            </button>
            <button
              onClick={() => handleFilterChange("users")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-medium transition-colors ${filterType === "users" ? "bg-blue-50 text-[#0866ff]" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <div
                className={`p-1.5 rounded-full ${filterType === "users" ? "bg-[#0866ff] text-white" : "bg-gray-200"}`}
              >
                <Users className="w-4 h-4" />
              </div>{" "}
              Mọi người
            </button>
            <button
              onClick={() => handleFilterChange("posts")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-medium transition-colors ${filterType === "posts" ? "bg-blue-50 text-[#0866ff]" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <div
                className={`p-1.5 rounded-full ${filterType === "posts" ? "bg-[#0866ff] text-white" : "bg-gray-200"}`}
              >
                <FileText className="w-4 h-4" />
              </div>{" "}
              Bài viết
            </button>
          </div>
        </div>

        {/* CỘT PHẢI: KẾT QUẢ TÌM KIẾM */}
        <div className="w-full max-w-170 space-y-4">
          {!query ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">
                Nhập từ khóa để bắt đầu tìm kiếm.
              </p>
            </div>
          ) : isLoading ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 py-20 flex justify-center items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#0866ff]" />
              <span className="text-gray-500 font-medium text-[15px]">
                Đang tìm kiếm...
              </span>
            </div>
          ) : (
            <>
              {/* === BLOCK 1: HIỂN THỊ USERS === */}
              {(filterType === "all" || filterType === "users") &&
                users.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <h3 className="text-[17px] font-bold text-gray-900 mb-3">
                      Mọi người
                    </h3>
                    <div className="space-y-3">
                      {/* GỌI COMPONENT CON Ở ĐÂY */}
                      {users.map((user) => (
                        <UserResultItem key={user.id} user={user} />
                      ))}
                    </div>

                    {filterType === "all" && users.length >= 3 && (
                      <button
                        onClick={() => handleFilterChange("users")}
                        className="w-full mt-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-[15px] font-semibold text-gray-700 transition-colors"
                      >
                        Xem tất cả mọi người
                      </button>
                    )}
                  </div>
                )}

              {/* === BLOCK 2: HIỂN THỊ POSTS === */}
              {(filterType === "all" || filterType === "posts") && (
                <div className="space-y-4">
                  {filterType === "posts" && posts.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                      <h3 className="text-[17px] font-bold text-gray-900">
                        Bài viết liên quan
                      </h3>
                    </div>
                  )}

                  {posts.length > 0
                    ? posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))
                    : filterType === "posts" && (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-200 text-gray-500">
                          Không tìm thấy bài viết nào chứa "{query}"
                        </div>
                      )}
                </div>
              )}

              {/* Trạng thái trống toàn cục */}
              {!isLoading && users.length === 0 && posts.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-900 font-semibold text-[17px]">
                    Không tìm thấy kết quả
                  </p>
                  <p className="text-gray-500 mt-1">
                    Chúng tôi không tìm thấy kết quả nào cho "{query}". Vui lòng
                    thử lại với từ khóa khác.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { Story } from "@/types/story.type";
import { Button } from "@/components/ui/button";
import StoryCard from "./StoryCard";
import UserAvatar from "@/components/common/UserAvatar";

const MOCK_API_RESPONSE = {
  data: [
    {
      id: "d604f452-a029-4c85-a111-13e8878236c8",
      mediaUrl:
        "https://interacthub.blob.core.windows.net/media/stories/20260412_103346_cd55c2e7.mp4",
      createdAt: "2026-04-12T10:33:47.252",
      expiresAt: "2026-04-13T10:33:47.252",
      authorId: "b9482b9e-c269-406a-6234-08de9162145c",
      authorName: "Myron Upton",
      authorAvatarUrl:
        "https://ipfs.io/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1005.jpg",
    },
    {
      id: "4f76d874-3e80-41f0-b832-7421d621aff4",
      mediaUrl:
        "https://interacthub.blob.core.windows.net/media/stories/20260412_103346_cd55c2e7.mp4",
      createdAt: "2026-04-12T10:33:29.645",
      expiresAt: "2026-04-13T10:33:29.645",
      authorId: "b9482b9e-c269-406a-6234-08de9162145c",
      authorName: "Myron Upton",
      authorAvatarUrl:
        "https://ipfs.io/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1005.jpg",
    },
    {
      id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      mediaUrl:
        "https://interacthub.blob.core.windows.net/media/stories/20260412_103346_cd55c2e7.mp4",
      createdAt: "2026-04-12T09:15:00.000",
      expiresAt: "2026-04-13T09:15:00.000",
      authorId: "user-3",
      authorName: "Hải Đăng",
      authorAvatarUrl: "https://i.pravatar.cc/150?u=haidang",
    },
    {
      id: "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e",
      mediaUrl:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=300&auto=format&fit=crop",
      createdAt: "2026-04-12T08:30:00.000",
      expiresAt: "2026-04-13T08:30:00.000",
      authorId: "user-4",
      authorName: "Thanh Trúc",
      authorAvatarUrl: "https://i.pravatar.cc/150?u=thanhtruc",
    },
    {
      id: "c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f",
      mediaUrl:
        "https://images.unsplash.com/photo-1516542076529-1ea3854896f2?q=80&w=300&auto=format&fit=crop",
      createdAt: "2026-04-12T07:45:00.000",
      expiresAt: "2026-04-13T07:45:00.000",
      authorId: "user-5",
      authorName: "Tuấn Kiệt",
      authorAvatarUrl: "https://i.pravatar.cc/150?u=tuankiet",
    },
    {
      id: "d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a",
      mediaUrl:
        "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=300&auto=format&fit=crop",
      createdAt: "2026-04-12T06:20:00.000",
      expiresAt: "2026-04-13T06:20:00.000",
      authorId: "user-6",
      authorName: "Minh Châu",
      authorAvatarUrl: "https://i.pravatar.cc/150?u=minhchau",
    },
    {
      id: "e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b",
      mediaUrl:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=300&auto=format&fit=crop",
      createdAt: "2026-04-12T05:10:00.000",
      expiresAt: "2026-04-13T05:10:00.000",
      authorId: "user-7",
      authorName: "Hoàng Nam",
      authorAvatarUrl: "https://i.pravatar.cc/150?u=hoangnam",
    },
    {
      id: "f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c",
      mediaUrl:
        "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=300&auto=format&fit=crop",
      createdAt: "2026-04-12T04:05:00.000",
      expiresAt: "2026-04-13T04:05:00.000",
      authorId: "user-8",
      authorName: "Quỳnh Như",
      authorAvatarUrl: "https://i.pravatar.cc/150?u=quynhnhu",
    },
    {
      id: "a7b8c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d",
      mediaUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
      createdAt: "2026-04-12T03:00:00.000",
      expiresAt: "2026-04-13T03:00:00.000",
      authorId: "user-9",
      authorName: "Bảo Trâm",
      authorAvatarUrl: "https://i.pravatar.cc/150?u=baotram",
    },
  ],
  pagination: {
    currentPage: 1,
    limit: 10,
    totalItems: 9,
    totalPages: 1,
  },
};

export default function StoryFeed() {
  const { user } = useAuth();

  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(false); // Sửa mặc định thành false để tránh giật lúc đầu

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;

      setShowLeftBtn(Math.ceil(scrollLeft) > 20);

      setShowRightBtn(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 5);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = 250;

      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    async function fetchStories() {
      try {
        setTimeout(() => {
          setStories(MOCK_API_RESPONSE.data);
          setIsLoading(false);
          // Cho DOM 100ms để render xong mảng data rồi mới tính toán ẩn hiện nút
          setTimeout(handleScroll, 100);
        }, 500);
      } catch (error) {
        console.error("Lỗi khi lấy Story:", error);
        setIsLoading(false);
      }
    }

    fetchStories();
  }, []);

  return (
    <div className="relative w-full">
      {showLeftBtn && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer md:flex"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {showRightBtn && !isLoading && stories.length > 0 && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer md:flex"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex gap-2 p-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth"
      >
        {/* 1. ITEM CỦA TÔI (Create Story) */}
        <div className="relative flex-none w-27.5 h-50 rounded-xl overflow-hidden shadow-sm cursor-pointer snap-start bg-white border border-gray-200 group">
          <div className="h-32.5 w-full bg-gray-100 overflow-hidden">
            <UserAvatar
              src={user?.avatarUrl}
              name={user?.fullName}
              shape="square" 
              className="w-full h-full group-hover:scale-105 transition-transform duration-300 text-[200%]"
            />
          </div>
          <div className="relative h-17.5 bg-white flex flex-col items-center justify-end pb-3">
            <Button
              size="icon"
              className="absolute -top-5 bg-blue-600 hover:bg-blue-700 text-white rounded-full border-4 border-white group-hover:scale-110 transition-transform h-10 w-10 flex items-center justify-center"
            >
              <Plus size={20} strokeWidth={3} />
            </Button>
            <span className="text-[13px] font-semibold text-gray-900 mt-2">
              Tạo tin
            </span>
          </div>
        </div>

        {isLoading
          ? [1, 2, 3, 4, 5].map((skeleton) => (
              <div
                key={skeleton}
                className="flex-none w-27.5 h-50 rounded-xl bg-gray-200 animate-pulse snap-start"
              />
            ))
          : /* 3. MAP DỮ LIỆU TỪ MẢNG STORIES */
            stories.map((story) => <StoryCard key={story.id} story={story} />)}
      </div>
    </div>
  );
}

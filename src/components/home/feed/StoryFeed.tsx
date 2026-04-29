import { useState, useEffect, useRef } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { Story } from "@/types/story.type";
import { Button } from "@/components/ui/button";
import StoryCard from "./StoryCard";
import UserAvatar from "@/components/common/UserAvatar";
import { storyService } from "@/services/story.service";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import type { ApiErrorResponse } from "@/types/common.type";

export default function StoryFeed() {
  const { user } = useAuth();

  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(false);

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
      setIsLoading(true);
      try {
        const response = await storyService.getFeedStories(1, 50);

        // Gom nhóm tin theo ID tác giả
        const groupedMap = new Map<string, Story[]>();
        response.data.forEach((story) => {
          if (!groupedMap.has(story.authorId)) {
            groupedMap.set(story.authorId, []);
          }
          groupedMap.get(story.authorId)!.push(story);
        });

        // Chỉ lấy tin mới nhất từ mỗi nhóm
        const latestStoriesPerUser = Array.from(groupedMap.values()).map(
          (userStories) => {
            // Sắp xếp giảm dần theo ngày tạo và lấy phần tử đầu tiên
            return userStories.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )[0];
          },
        );

        // Sắp xếp lại toàn bộ Feed (Ai vừa đăng tin mới nhất thì lên đầu)
        const finalFeed = latestStoriesPerUser.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        setStories(finalFeed);
        setTimeout(handleScroll, 100);
      } catch (error: unknown) {
        const apiError = error as ApiErrorResponse;
        console.error("Lỗi khi lấy Story:", apiError.message || error);
        toast.error("Không thể tải tin mới. Vui lòng thử lại!");
      } finally {
        setIsLoading(false);
      }
    }

    fetchStories();
  }, []);

  return (
    <div className="relative w-full group">
      {showLeftBtn && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => scroll("left")}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white shadow-md border-gray-200 text-gray-600 hover:text-gray-900 md:flex hidden"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      )}

      {showRightBtn && !isLoading && stories.length > 0 && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => scroll("right")}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white shadow-md border-gray-200 text-gray-600 hover:text-gray-900 md:flex hidden"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      )}

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex gap-2 py-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth"
      >
        {/* THẺ TẠO TIN (CỦA TÔI) */}
        <Link
          to={"/story/create"}
          className="relative flex-none w-27.5 h-50 rounded-xl overflow-hidden shadow-sm cursor-pointer snap-start bg-white border border-gray-200 group/card"
        >
          <div className="h-32.5 w-full bg-gray-100 overflow-hidden">
            <UserAvatar
              src={user?.avatarUrl}
              name={user?.fullName}
              shape="square"
              className="w-full h-full group-hover/card:scale-105 transition-transform duration-300 text-[200%]"
            />
          </div>
          <div className="relative h-17.5 bg-white flex flex-col items-center justify-end pb-3">
            <Button
              size="icon"
              className="absolute -top-5 bg-blue-600 hover:bg-blue-700 text-white rounded-full border-4 border-white group-hover/card:scale-110 transition-transform h-10 w-10 flex items-center justify-center"
            >
              <Plus size={20} strokeWidth={3} />
            </Button>
            <span className="text-[13px] font-semibold text-gray-900 mt-2">
              Tạo tin
            </span>
          </div>
        </Link>

        {/* DANH SÁCH TIN (Hoặc Skeleton) */}
        {isLoading
          ? [1, 2, 3, 4, 5].map((skeleton) => (
              <div
                key={skeleton}
                className="flex-none w-27.5 h-50 rounded-xl bg-gray-200 animate-pulse snap-start"
              />
            ))
          : stories.map((story) => <StoryCard key={story.id} story={story} />)}
      </div>
    </div>
  );
}

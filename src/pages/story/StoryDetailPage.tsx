import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { storyService } from "@/services/story.service";
import { useAuth } from "@/contexts/AuthContext";
import StorySidebar from "@/components/story/StorySidebar";
import StoryViewer from "@/components/story/StoryViewer";
import type { Story } from "@/types/story.type";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GroupedStory {
  authorId: string;
  authorName: string;
  authorAvatarUrl: string | null;
  stories: Story[];
}

export default function StoryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [groupedStories, setGroupedStories] = useState<GroupedStory[]>([]);
  const [currentAuthorIndex, setCurrentAuthorIndex] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const [showEndScreen, setShowEndScreen] = useState(false);

  // Phân loại nhóm
  const myGroup = useMemo(
    () => groupedStories.find((g) => g.authorId === user?.id),
    [groupedStories, user?.id],
  );
  const otherGroups = useMemo(
    () => groupedStories.filter((g) => g.authorId !== user?.id),
    [groupedStories, user?.id],
  );

  useEffect(() => {
    async function fetchStories() {
      try {
        const response = await storyService.getFeedStories(1, 50);

        const grouped = response.data.reduce((acc: GroupedStory[], story) => {
          const group = acc.find((g) => g.authorId === story.authorId);
          if (group) group.stories.push(story);
          else {
            acc.push({
              authorId: story.authorId,
              authorName: story.authorName,
              authorAvatarUrl: story.authorAvatarUrl,
              stories: [story],
            });
          }
          return acc;
        }, []);

        // Ai có story mới nhất lên đầu
        const sortedGroups = grouped.sort((a, b) => {
          const maxA = Math.max(
            ...a.stories.map((s) => new Date(s.createdAt).getTime()),
          );
          const maxB = Math.max(
            ...b.stories.map((s) => new Date(s.createdAt).getTime()),
          );
          return maxB - maxA;
        });

        setGroupedStories(sortedGroups);

        // Tìm tin dựa vào ID trên URL lần đầu tiên
        if (id) {
          let foundAuthorIdx = -1;
          let foundStoryIdx = -1;
          sortedGroups.forEach((g, aIdx) => {
            const sIdx = g.stories.findIndex((s) => s.id === id);
            if (sIdx !== -1) {
              foundAuthorIdx = aIdx;
              foundStoryIdx = sIdx;
            }
          });
          if (foundAuthorIdx !== -1) {
            setCurrentAuthorIndex(foundAuthorIdx);
            setCurrentStoryIndex(foundStoryIdx);
          }
        }
      } catch (error) {
        console.error("Lỗi tải story:", error);
      }
    }
    fetchStories();
  }, []);

  const currentAuthor = groupedStories[currentAuthorIndex];
  const currentStory = currentAuthor?.stories[currentStoryIndex];

  // Đồng bộ URL mỗi khi currentStory thay đổi
  useEffect(() => {
    if (currentStory) {
      navigate(`/stories/${currentStory.id}`, { replace: true });
    }
  }, [currentStory, navigate]);

  // Logic chuyển tin
  const handleNext = () => {
    if (showEndScreen) {
      navigate("/");
      return;
    }

    if (currentStoryIndex < currentAuthor.stories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
    } else if (currentAuthorIndex < groupedStories.length - 1) {
      setCurrentAuthorIndex((prev) => prev + 1);
      setCurrentStoryIndex(0);
    } else {
      // Đã xem hết tin của người cuối cùng -> Hiện màn hình kêu gọi tạo tin
      setShowEndScreen(true);
    }
  };

  const handlePrev = () => {
    // Nếu đang ở màn hình kết thúc mà bấm Prev -> Quay lại xem lại tin cuối cùng
    if (showEndScreen) {
      setShowEndScreen(false);
      return;
    }

    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1);
    } else if (currentAuthorIndex > 0) {
      setCurrentAuthorIndex((prev) => prev - 1);
      setCurrentStoryIndex(
        groupedStories[currentAuthorIndex - 1].stories.length - 1,
      );
    }
  };

  const handleSelectAuthor = (authorId: string) => {
    if (currentAuthor?.authorId === authorId) return;
    const idx = groupedStories.findIndex((g) => g.authorId === authorId);
    setCurrentAuthorIndex(idx);
    setCurrentStoryIndex(0);
  };

  const handleClose = () => navigate("/");

  if (!currentAuthor || !currentStory)
    return <div className="h-screen bg-black" />;

  return (
    <div className="flex h-screen bg-black lg:bg-gray-900 overflow-hidden text-white">
      <StorySidebar
        myGroup={myGroup}
        otherGroups={otherGroups}
        currentAuthorId={currentAuthor.authorId}
        onSelectAuthor={handleSelectAuthor}
        onClose={handleClose}
      />
      {showEndScreen ? (
        <div className="flex-1 relative flex flex-col items-center justify-center bg-[#18191A] p-4 lg:p-8">
          {/* UI Màn hình tạo tin giống ảnh bạn gửi */}
          <div className="flex flex-col items-center text-center max-w-sm">
            <div className="w-24 h-36 bg-gray-200 rounded-xl mb-6 relative">
              {/* ... Chèn ảnh avatar hoặc icon minh họa vào đây ... */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white border-4 border-[#18191A]">
                +
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Tiếp tục tạo tin
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Bạn bè đang mong bạn lắm đấy. Hãy chia sẻ khoảnh khắc gần đây để
              họ biết tình hình hiện tại của bạn nhé.
            </p>
            <Button
              onClick={() => navigate("/story/create")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-lg"
            >
              Tạo tin
            </Button>
          </div>

          {/* Nút Prev/Next vẫn giữ nguyên để điều hướng */}
          <Button
            onClick={handlePrev}
            variant="ghost"
            size="icon"
            className="absolute left-4 lg:left-10 w-14 h-14 rounded-full hidden md:flex bg-white/10 hover:bg-white/20 text-white border-0 z-30"
          >
            <ChevronLeft className="w-8! h-8!" />
          </Button>
          <Button
            onClick={handleNext}
            variant="ghost"
            size="icon"
            className="absolute right-4 lg:right-10 w-14 h-14 rounded-full hidden md:flex bg-white/10 hover:bg-white/20 text-white border-0 z-30"
          >
            <ChevronRight className="w-8! h-8!" />
          </Button>
        </div>
      ) : (
        <StoryViewer
          currentAuthor={currentAuthor}
          currentStory={currentStory}
          currentStoryIndex={currentStoryIndex}
          onNext={handleNext}
          onPrev={handlePrev}
          onClose={handleClose}
          isFirstStory={currentAuthorIndex === 0 && currentStoryIndex === 0}
        />
      )}
    </div>
  );
}

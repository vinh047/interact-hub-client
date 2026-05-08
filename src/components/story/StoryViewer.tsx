import { useState, useEffect, useRef } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import UserAvatar from "@/components/common/UserAvatar";
import { formatRelativeTime } from "@/utils/date";
import type { GroupedStory, Story } from "@/types/story.type";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

interface StoryViewerProps {
  currentAuthor: GroupedStory;
  currentStory: Story;
  currentStoryIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  isFirstStory: boolean;
}

export default function StoryViewer({
  currentAuthor,
  currentStory,
  currentStoryIndex,
  onNext,
  onPrev,
  onClose,
  isFirstStory,
}: StoryViewerProps) {
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const animationRef = useRef<number>(null);

  // Logic tiến trình mượt mà (60FPS)
  useEffect(() => {
    const updateProgress = () => {
      if (videoRef.current && videoRef.current.duration > 0) {
        const current = videoRef.current.currentTime;
        const duration = videoRef.current.duration;
        setProgress((current / duration) * 100);
      }
      animationRef.current = requestAnimationFrame(updateProgress);
    };

    if (!isPaused) {
      animationRef.current = requestAnimationFrame(updateProgress);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPaused, currentStory.id]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPaused) videoRef.current.play();
      else videoRef.current.pause();
      setIsPaused(!isPaused);
    }
  };

  return (
    // 1. SỬA ĐỔI WRAPPER: p-0 trên mobile để tràn viền, sm:p-4 lg:p-8 trên desktop
    <div className="flex-1 relative flex items-center justify-center bg-black group p-0 sm:p-4 lg:p-8 overflow-hidden">
      
      {/* Nút Close hiển thị ngoài viền trên Tablet/Desktop */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-4 right-4 z-50 rounded-full bg-gray-800/50 hover:bg-gray-700/50 text-white hover:text-white border-0 hidden sm:flex lg:hidden"
      >
        <X className="w-5! h-5!" />
      </Button>

      {/* 2. SỬA ĐỔI KHUNG VIDEO: 
          - Mobile: w-full h-full, không bo góc (rounded-none), không viền (border-none)
          - Desktop (sm): Dùng sm:w-auto sm:aspect-[9/16], có bo góc, có viền 
      */}
      <div className="relative w-full h-full sm:w-auto sm:aspect-9/16 bg-black shadow-none sm:shadow-2xl rounded-none sm:rounded-xl overflow-hidden flex items-center justify-center z-20 sm:border border-gray-700">
        
        {/* Lớp phủ Header (Timeline + User Info) */}
        {/* Thêm pt-safe để tránh thanh trạng thái tai thỏ/đục lỗ của điện thoại */}
        <div className="absolute inset-x-0 top-0 z-30 p-3 pt-4 sm:p-4 flex flex-col gap-3 bg-linear-to-b from-black/80 via-black/40 to-transparent">
          {/* Thanh Timeline */}
          <div className="flex gap-1.5 px-0">
            {currentAuthor.stories.map((story: Story, idx: number) => (
              <div
                key={story.id}
                className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-white"
                  style={{
                    width:
                      idx < currentStoryIndex
                        ? "100%"
                        : idx === currentStoryIndex
                          ? `${progress}%`
                          : "0%",
                  }}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Link to={`/profile/${currentAuthor.authorId}`}>
                <UserAvatar
                  src={currentAuthor.authorAvatarUrl}
                  name={currentAuthor.authorName}
                  border
                  className="w-9 h-9 sm:w-10 sm:h-10 shadow-sm"
                />
              </Link>
              <div className="flex flex-col">
                <Link to={`/profile/${currentAuthor.authorId}`}>
                  <span className="font-bold text-[14px] sm:text-[15px] drop-shadow-lg text-white whitespace-nowrap">
                    {currentAuthor.authorName}
                  </span>
                </Link>
                <span className="text-[11px] sm:text-[12px] opacity-80 drop-shadow-lg text-white/90">
                  {formatRelativeTime(currentStory.createdAt)}
                </span>
              </div>
            </div>

            {/* CỤM NÚT ĐIỀU KHIỂN BÊN PHẢI */}
            <div className="flex items-center gap-0 sm:gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlayPause}
                className="rounded-full w-9 h-9 sm:w-10 sm:h-10 text-white hover:bg-white/20 hover:text-white drop-shadow-lg"
              >
                {isPaused ? (
                  <Play className="w-4! h-4! sm:w-5! sm:h-5! fill-current" />
                ) : (
                  <Pause className="w-4! h-4! sm:w-5! sm:h-5! fill-current" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                className="rounded-full w-9 h-9 sm:w-10 sm:h-10 text-white hover:bg-white/20 hover:text-white drop-shadow-lg"
              >
                {isMuted ? (
                  <VolumeX className="w-4! h-4! sm:w-5! sm:h-5!" />
                ) : (
                  <Volume2 className="w-4! h-4! sm:w-5! sm:h-5!" />
                )}
              </Button>

              {/* 3. NÚT CLOSE CHO MOBILE: Đưa vào cạnh nút Volume để dễ bấm và không đè timeline */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full w-9 h-9 text-white hover:bg-white/20 hover:text-white drop-shadow-lg sm:hidden ml-1"
              >
                <X className="w-5! h-5!" />
              </Button>
            </div>
          </div>
        </div>

        {/* Video Player */}
        <video
          ref={videoRef}
          src={currentStory.mediaUrl}
          className="absolute inset-0 w-full h-full object-contain z-10"
          autoPlay
          muted={isMuted}
          playsInline
          onLoadStart={() => setProgress(0)}
          onEnded={onNext}
          onPlay={() => setIsPaused(false)}
          onPause={() => setIsPaused(true)}
        />

        {/* Điều hướng Mobile (Chạm trái/phải màn hình) */}
        {!isFirstStory && (
          <div
            className="absolute inset-y-0 left-0 w-1/4 z-20 cursor-pointer md:hidden"
            onClick={onPrev}
          />
        )}
        <div
          className="absolute inset-y-0 right-0 w-3/4 z-20 cursor-pointer md:hidden"
          onClick={onNext}
        />
      </div>

      {/* Điều hướng Desktop (Nút bấm tròn) */}
      {!isFirstStory && (
        <Button
          onClick={onPrev}
          variant="ghost"
          size="icon"
          className="absolute left-4 lg:left-10 w-14 h-14 rounded-full hidden md:flex bg-white/10 hover:bg-white/20 text-white border-0 z-30"
        >
          <ChevronLeft className="w-8! h-8!" />
        </Button>
      )}
      <Button
        variant="secondary"
        size={"icon"}
        onClick={onNext}
        className="w-14 h-14 absolute right-4 lg:right-10 rounded-full hidden md:flex bg-white/10 hover:bg-white/20 text-white border-0"
      >
        <ChevronRight className="w-8! h-8!" />
      </Button>
    </div>
  );
}

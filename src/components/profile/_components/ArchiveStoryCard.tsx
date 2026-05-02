import { useEffect, useRef } from "react";
import { PlayCircle } from "lucide-react";
import type { StoryResponse } from "@/types/story.type";

interface ArchiveStoryCardProps {
  story: StoryResponse;
}

export default function ArchiveStoryCard({ story }: ArchiveStoryCardProps) {
  // Kiểm tra video an toàn
  const isVideo =
    String(story.mediaType).toLowerCase().includes("video") ||
    story.mediaUrl?.toLowerCase().endsWith(".mp4");

  const videoRef = useRef<HTMLVideoElement>(null);
  const playTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (isVideo && videoRef.current) {
      if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);
      videoRef.current.play().catch(() => {});
      playTimeoutRef.current = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }, 5000);
    }
  };

  const handleMouseLeave = () => {
    if (isVideo && videoRef.current) {
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
        playTimeoutRef.current = null;
      }
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    return () => {
      if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);
    };
  }, []);

  // Format ngày tháng năm
  const formattedDate = story.createdAt
    ? new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(story.createdAt))
    : "";

  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="relative aspect-9/16 overflow-hidden rounded-lg bg-gray-900 shadow-sm border border-gray-100 group cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isVideo ? (
          <>
            <video
              ref={videoRef}
              src={story.mediaUrl}
              muted
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Thêm Icon Play mờ để nhận diện Video trong kho lưu trữ */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors pointer-events-none">
              <PlayCircle className="w-8 h-8 text-white opacity-80 drop-shadow-md" />
            </div>
          </>
        ) : (
          <img
            src={story.mediaUrl}
            alt="Story archive"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>

      {/* Ngày đăng thay cho Tên/Avatar */}
      <span className="text-[13px] font-semibold text-gray-600 text-center">
        {formattedDate}
      </span>
    </div>
  );
}

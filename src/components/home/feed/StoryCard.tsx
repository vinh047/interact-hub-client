// StoryCard.tsx
import UserAvatar from "@/components/common/UserAvatar";
import type { Story } from "@/types/story.type";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

interface StoryCardProps {
  story: Story;
}

export default function StoryCard({ story }: StoryCardProps) {
  // Kiểm tra định dạng video
  const isVideo = story.mediaUrl.toLowerCase().endsWith(".mp4");

  const videoRef = useRef<HTMLVideoElement>(null);
  const playTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Logic phát video khi hover
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

  return (
    <Link
      to={`/stories/${story.id}`}
      // Khung chứa tỉ lệ 9:16 với nền đen để bù đắp khoảng trống cho video ngang
      className="relative flex-none w-27.5 h-50 rounded-xl overflow-hidden shadow-sm bg-black border border-gray-800 cursor-pointer snap-start group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isVideo ? (
        <video
          ref={videoRef}
          src={story.mediaUrl}
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 hover:scale-105"
        />
      ) : (
        <img
          src={story.mediaUrl}
          alt={story.authorName}
          className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 hover:scale-105"
        />
      )}

      <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />

      <UserAvatar
        src={story.authorAvatarUrl}
        name={story.authorName}
        border={true}
        className="absolute top-3 left-3 w-10 h-10 z-10 border-2 border-blue-600 shadow-lg"
      />

      <span className="absolute bottom-3 left-2 right-2 text-white text-[12px] font-semibold leading-tight line-clamp-2 drop-shadow-md z-10">
        {story.authorName}
      </span>
    </Link>
  );
}

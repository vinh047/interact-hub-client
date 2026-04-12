import type { Story } from "@/types/story.type";
import { useRef } from "react";

export default function StoryCard({ story }: { story: Story }) {
  const isVideo = story.mediaUrl.toLowerCase().endsWith(".mp4");
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (isVideo && videoRef.current) {
      // Khi rê chuột vào -> Chạy video
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (isVideo && videoRef.current) {
      // Khi bỏ chuột ra -> Dừng video và quay về giây đầu tiên (làm ảnh nền)
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className="relative flex-none w-27.5 h-50 rounded-xl overflow-hidden shadow-sm cursor-pointer snap-start group bg-gray-900"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isVideo ? (
        <video
          ref={videoRef}
          src={story.mediaUrl}
          muted
          playsInline
          loop // Cho phép lặp liên tục khi đang hover
          preload="metadata" // Tải trước thông tin để hiện được frame đầu làm ảnh nền
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
        />
      ) : (
        <img
          src={story.mediaUrl}
          alt={story.authorName}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
        />
      )}

      {/* Overlay và Avatar giữ nguyên để đảm bảo UI đúng chuẩn InteractHub [cite: 202, 208] */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />

      <div className="absolute top-3 left-3 w-10 h-10 rounded-full border-2 border-blue-500 overflow-hidden bg-white z-10">
        <img
          src={story.authorAvatarUrl}
          alt={story.authorName}
          className="w-full h-full object-cover"
        />
      </div>

      <span className="absolute bottom-3 left-2 right-2 text-white text-[12px] font-semibold leading-tight line-clamp-2 drop-shadow-md z-10">
        {story.authorName}
      </span>
    </div>
  );
}
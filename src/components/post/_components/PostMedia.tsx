import { cn } from "@/lib/utils";
import type { Post } from "@/types/post.type";

interface PostMediaProps {
  mediaFiles: Post["mediaFiles"];
}

export default function PostMedia({ mediaFiles }: PostMediaProps) {
  if (!mediaFiles || mediaFiles.length === 0) return null;

  return (
    <div
      className={cn(
        "grid gap-0.5 bg-gray-100",
        mediaFiles.length > 1 ? "grid-cols-2" : "grid-cols-1",
      )}
    >
      {mediaFiles.slice(0, 4).map((file, idx) => {
        const isVideo =
          String(file.mediaType).toLowerCase().includes("video") ||
          file.mediaUrl.toLowerCase().endsWith(".mp4");

        return (
          <div
            key={file.id}
            className={cn(
              "relative bg-gray-200 flex items-center justify-center overflow-hidden",
              mediaFiles.length === 1
                ? "aspect-auto max-h-150"
                : "aspect-square",
            )}
          >
            {isVideo ? (
              <video
                src={file.mediaUrl}
                controls
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={file.mediaUrl}
                alt="Post media"
                className="w-full h-full object-cover"
              />
            )}

            {idx === 3 && mediaFiles.length > 4 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xl font-bold pointer-events-none">
                +{mediaFiles.length - 4}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaPreviewProps {
  items: { url: string; type: string }[];
  onRemove: (index: number) => void;
}

export function MediaPreview({ items, onRemove }: MediaPreviewProps) {
  if (items.length === 0) return null;

  const checkIsVideo = (type: string, url: string) => {
    const typeStr = String(type).toLowerCase();
    const urlStr = String(url).toLowerCase();
    return (
      typeStr.includes("video") ||
      urlStr.endsWith(".mp4") ||
      urlStr.endsWith(".mov")
    );
  };

  return (
    <div className="relative border rounded-lg p-2 bg-gray-50 mt-2">
      <div
        className={cn(
          "grid gap-2",
          items.length === 1 ? "grid-cols-1" : "grid-cols-2",
        )}
      >
        {items.map((item, index) => {
          const isVideo = checkIsVideo(item.type, item.url);

          return (
            <div
              key={item.url}
              className="relative group aspect-video rounded-lg overflow-hidden border border-gray-200 bg-black"
            >
              {isVideo ? (
                <video
                  src={item.url}
                  className="w-full h-full object-contain"
                  controls
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={item.url}
                  alt="preview"
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                />
              )}
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer hover:bg-red-500"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

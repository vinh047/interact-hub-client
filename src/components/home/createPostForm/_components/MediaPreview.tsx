import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaPreviewProps {
  items: { url: string; type: string }[];
  onRemove: (index: number) => void;
}

export function MediaPreview({ items, onRemove }: MediaPreviewProps) {
  if (items.length === 0) return null;

  return (
    <div className="relative border rounded-lg p-2 bg-gray-50 mt-2">
      <div className={cn("grid gap-2", items.length === 1 ? "grid-cols-1" : "grid-cols-2")}>
        {items.map((item, index) => (
          <div key={item.url} className="relative group aspect-video rounded-lg overflow-hidden border border-gray-200 bg-black">
            {item.type.startsWith("video/") ? (
              <video src={item.url} className="w-full h-full object-cover" controls muted playsInline />
            ) : (
              <img src={item.url} alt="preview" className="object-cover w-full h-full group-hover:scale-105 transition-transform" />
            )}
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
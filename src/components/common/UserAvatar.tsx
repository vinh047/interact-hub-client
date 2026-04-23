import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Helper bóc tách tên và màu sắc
const getInitials = (name: string) => {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const stringToColor = (name: string) => {
  const colors = [
    "#71717a", // Zinc
    "#ef4444", // Red
    "#f97316", // Orange
    "#06b6d4", // Cyan
    "#3b82f6", // Blue
    "#8b5cf6", // Violet
    "#ec4899", // Pink
    "#10b981", // Emerald
  ];

  // Logic Hash để cùng một tên luôn ra cùng một màu trong mảng trên
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

interface UserAvatarProps {
  src?: string | null;
  name?: string;
  className?: string;
  border?: boolean;
  shape?: "circle" | "square";
}

export default function UserAvatar({
  src,
  name = "User",
  className,
  border,
  shape = "circle",
}: UserAvatarProps) {
  const initials = getInitials(name);
  const bgColor = stringToColor(name);

  return (
    <Avatar
      className={cn(
        "border-white bg-white shrink-0 overflow-hidden",
        shape === "circle" ? "rounded-full" : "rounded-none",
        border && "border-2 border-blue-500 p-0.5",
        className,
      )}
    >
      <AvatarImage
        src={src || undefined}
        alt={name}
        className={cn(
          "object-cover",
          shape === "circle" ? "rounded-full" : "rounded-none",
        )}
      />
      <AvatarFallback
        style={{ backgroundColor: bgColor }}
        className={cn(
          "text-white font-bold text-[80%] uppercase",
          shape === "circle" ? "rounded-full" : "rounded-none",
        )}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

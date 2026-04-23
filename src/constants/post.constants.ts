import { Globe, Users, Lock, type LucideIcon } from "lucide-react";
import type { PostVisibility } from "@/types/enum.type";

interface VisibilityConfig {
  label: string;
  icon: LucideIcon;
  description: string;
}

export const VISIBILITY_MAP: Record<PostVisibility, VisibilityConfig> = {
  Public: {
    label: "Công khai",
    icon: Globe,
    description: "Bất kỳ ai cũng có thể thấy",
  },
  FriendsOnly: {
    label: "Bạn bè",
    icon: Users,
    description: "Chỉ bạn bè trên InteractHub",
  },
  Private: {
    label: "Chỉ mình tôi",
    icon: Lock,
    description: "Chỉ mình bạn thấy bài viết này",
  },
};
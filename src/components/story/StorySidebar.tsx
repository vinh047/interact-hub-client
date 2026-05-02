import { X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import UserAvatar from "@/components/common/UserAvatar";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/utils/date";
import type { GroupedStory } from "@/types/story.type";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

interface StorySidebarProps {
  myGroup?: GroupedStory;
  otherGroups: GroupedStory[];
  currentAuthorId?: string;
  onSelectAuthor: (authorId: string) => void;
  onClose: () => void;
}

export default function StorySidebar({
  myGroup,
  otherGroups,
  currentAuthorId,
  onSelectAuthor,
  onClose,
}: StorySidebarProps) {
  const navigate = useNavigate();

  return (
    <div className="w-80 bg-white border-r border-gray-200 hidden lg:flex flex-col shadow-2xl shrink-0 z-40">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Tin</h2>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full text-gray-600"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div className="flex gap-3 text-sm font-semibold text-blue-600">
          <Link to={`/profile/${myGroup?.authorId}?tab=archive`}>
            <span className="cursor-pointer hover:underline">Kho lưu trữ</span>
          </Link>
        </div>
      </div>

      <ScrollArea className="flex-1 overflow-y-auto p-2 custom-scrollbar">
        {/* Tin của bạn */}
        <div className="mb-4">
          <h3 className="px-3 py-2 text-[17px] font-bold text-gray-900">
            Tin của bạn
          </h3>
          {myGroup ? (
            <StoryItem
              group={myGroup}
              isActive={currentAuthorId === myGroup.authorId}
              onClick={() => onSelectAuthor(myGroup.authorId)}
            />
          ) : (
            <div
              onClick={() => navigate("/story/create")}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer group transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-blue-600 group-hover:bg-gray-200 transition-colors">
                <span className="text-2xl font-light">+</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">Tạo tin</span>
                <span className="text-[12px] text-gray-500">
                  Bạn có thể chia sẻ ảnh hoặc video.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Tất cả tin */}
        <div>
          <h3 className="px-3 py-2 text-[17px] font-bold text-gray-900">
            Tất cả tin
          </h3>
          {otherGroups.map((group) => (
            <StoryItem
              key={group.authorId}
              group={group}
              isActive={currentAuthorId === group.authorId}
              onClick={() => onSelectAuthor(group.authorId)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

// Sub-component
function StoryItem({
  group,
  isActive,
  onClick,
}: {
  group: GroupedStory;
  isActive: boolean;
  onClick: () => void;
}) {
  // Lấy tin mới nhất (Tin cuối cùng trong mảng)
  const newestStory = group.stories[group.stories.length - 1];

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors",
        isActive ? "bg-blue-50" : "hover:bg-gray-100",
      )}
    >
      <UserAvatar
        src={group.authorAvatarUrl}
        name={group.authorName}
        border={isActive}
        className="w-12 h-12 shrink-0"
      />
      <div className="flex flex-col overflow-hidden">
        <span
          className={cn(
            "font-semibold text-sm truncate",
            isActive ? "text-blue-600" : "text-gray-900",
          )}
        >
          {group.authorName}
        </span>
        <div className="flex items-center gap-1 text-[12px] text-gray-500">
          <span className="text-blue-600 font-medium whitespace-nowrap">
            {group.stories.length} thẻ mới
          </span>
          <span>·</span>
          <span className="whitespace-nowrap">
            {formatRelativeTime(newestStory.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

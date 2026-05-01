import { useEffect, useRef, useState } from "react";
import { X, SendHorizonal, Loader2 } from "lucide-react";
import UserAvatar from "@/components/common/UserAvatar";

interface PostModalInputProps {
  authorAvatar: string;
  authorsName: string;
  replyingTo: { id: string; name: string; content: string } | null;
  onClearReply: () => void;
  onSubmit: (text: string, replyId?: string) => Promise<void>;
}

export default function PostModalInput({
  authorAvatar,
  authorsName,
  replyingTo,
  onClearReply,
  onSubmit,
}: PostModalInputProps) {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (replyingTo) {
      // Dùng setTimeout 10ms để đảm bảo React vẽ xong cái khung "Đang trả lời..." rồi mới focus
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    }
  }, [replyingTo]);

  const handleInputResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const handleSubmit = async () => {
    if (!commentText.trim() || isSubmitting) return;
    try {
      setIsSubmitting(true);
      await onSubmit(commentText.trim(), replyingTo?.id);
      setCommentText(""); // Clear text sau khi gửi thành công
      onClearReply();
      if (inputRef.current) inputRef.current.style.height = "auto"; // Reset height
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-3.5 shrink-0 flex flex-col z-10 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
      {/* KHỐI HIỂN THỊ "ĐANG TRẢ LỜI" */}
      {replyingTo && (
        <div className="flex items-start justify-between bg-gray-50 text-[13px] px-3 py-2.5 mb-3 rounded-lg ml-11 border-l-[3px] border-blue-500">
          <div className="flex flex-col overflow-hidden pr-3">
            <span className="text-gray-700 mb-0.5">
              Đang trả lời <strong>{replyingTo.name}</strong>
            </span>
            <span className="text-gray-500 truncate w-full max-w-62.5 sm:max-w-112.5">
              {replyingTo.content}
            </span>
          </div>
          <button
            onClick={onClearReply}
            className="hover:bg-gray-200 text-gray-400 p-1.5 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KHỐI NHẬP LIỆU */}
      <div className="flex items-end gap-2.5">
        <UserAvatar
          src={authorAvatar}
          name={authorsName}
          className="w-9 h-9 shrink-0 mb-1"
        />
        <div className="flex-1 flex items-end bg-[#F0F2F5] rounded-[20px] px-3 py-1.5 focus-within:ring-1 focus-within:ring-gray-300">
          <textarea
            ref={inputRef}
            value={commentText}
            onChange={handleInputResize}
            placeholder={
              replyingTo ? "Viết câu trả lời..." : "Viết bình luận..."
            }
            className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-30 py-1.5 text-[15px] outline-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={!commentText.trim() || isSubmitting}
            className="p-1.5 mb-0.5 ml-1 text-blue-600 hover:bg-blue-100 disabled:text-gray-400 rounded-full transition-colors"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <SendHorizonal className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

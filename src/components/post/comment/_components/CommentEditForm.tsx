import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CommentEditFormProps {
  initialContent: string;
  isSaving: boolean;
  onCancel: () => void;
  onSave: (newContent: string) => void;
}

export default function CommentEditForm({
  initialContent,
  isSaving,
  onCancel,
  onSave,
}: CommentEditFormProps) {
  const [content, setContent] = useState(initialContent);

  return (
    <div className="flex flex-col gap-2 w-full max-w-100">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        autoFocus
        className="w-full text-[14px] min-h-10 resize-none focus-visible:ring-blue-100 focus-visible:border-blue-400"
        rows={2}
      />
      <div className="flex items-center gap-2 text-[12px] font-semibold">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isSaving}
          className="h-8 px-3 text-gray-500 hover:bg-gray-100"
        >
          Hủy
        </Button>
        <Button
          size="sm"
          onClick={() => onSave(content)}
          disabled={isSaving || !content.trim() || content === initialContent}
          className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
        >
          {isSaving && <Loader2 className="w-3 h-3 animate-spin" />} Lưu
        </Button>
      </div>
    </div>
  );
}

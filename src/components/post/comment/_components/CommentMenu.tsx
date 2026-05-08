import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface CommentMenuProps {
  canEdit: boolean;
  canDelete: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export default function CommentMenu({
  canEdit,
  canDelete,
  onEdit,
  onDelete,
}: CommentMenuProps) {
  if (!canEdit && !canDelete) return null;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full text-gray-500 hover:bg-gray-100 focus:opacity-100 focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-36 rounded-xl shadow-lg border-gray-100 p-1"
      >
        {canEdit && (
          <DropdownMenuItem
            onClick={onEdit}
            className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-gray-700 cursor-pointer rounded-lg"
          >
            <Pencil className="w-3.5 h-3.5" /> Chỉnh sửa
          </DropdownMenuItem>
        )}
        {canDelete && (
          <DropdownMenuItem
            onClick={onDelete}
            className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-700 rounded-lg"
          >
            <Trash2 className="w-3.5 h-3.5" /> Xóa
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

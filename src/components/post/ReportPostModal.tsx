import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { postService } from "@/services/post.service";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const REPORT_REASONS = [
  "Ảnh khỏa thân hoặc nội dung tình dục",
  "Ngôn từ gây thù ghét",
  "Bạo lực hoặc tổn thương thể chất",
  "Thông tin sai sự thật",
  "Spam hoặc lừa đảo",
  "Khác",
];

interface ReportPostModalProps {
  postId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ReportPostModal({
  postId,
  open,
  onOpenChange,
}: ReportPostModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>(
    REPORT_REASONS[0],
  );
  const [customReason, setCustomReason] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async () => {
    const finalReason =
      selectedReason === "Khác" ? customReason.trim() : selectedReason;

    if (!finalReason) {
      toast.error("Vui lòng nhập lý do báo cáo.");
      return;
    }

    try {
      setIsPending(true);
      await postService.reportPost(postId, finalReason);

      toast.success("Báo cáo thành công. Quản trị viên sẽ xem xét!");

      // Reset form & đóng modal
      onOpenChange(false);
      setSelectedReason(REPORT_REASONS[0]);
      setCustomReason("");
    } catch {
      toast.error("Có lỗi xảy ra khi gửi báo cáo.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-bold border-b pb-3">
            Báo cáo bài viết
          </DialogTitle>
        </DialogHeader>

        <div className="py-2 space-y-4">
          <p className="text-[15px] text-gray-600 font-medium">
            Vui lòng chọn lý do bạn muốn báo cáo bài viết này:
          </p>

          {/* DÙNG RADIOGROUP */}
          <RadioGroup
            value={selectedReason}
            onValueChange={setSelectedReason}
            className="space-y-1.5"
          >
            {REPORT_REASONS.map((reason) => (
              <div
                key={reason}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RadioGroupItem
                  value={reason}
                  id={reason}
                  className="text-blue-600 border-gray-400"
                />
                <Label
                  htmlFor={reason}
                  className="text-[15px] text-gray-800 font-normal cursor-pointer w-full leading-relaxed"
                >
                  {reason}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {/* Ô nhập liệu hiện ra nếu user chọn "Khác" */}
          {selectedReason === "Khác" && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
              <Textarea
                placeholder="Vui lòng cung cấp thêm chi tiết (bắt buộc)..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="resize-none h-24 text-[14px] focus-visible:ring-blue-100 focus-visible:border-blue-400"
                autoFocus
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Hủy
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 font-semibold min-w-30"
            onClick={handleSubmit}
            disabled={
              isPending || (selectedReason === "Khác" && !customReason.trim())
            }
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Đang gửi...
              </span>
            ) : (
              "Gửi báo cáo"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

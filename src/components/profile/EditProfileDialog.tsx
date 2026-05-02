import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import type { User } from "@/types/user.type";
import { userService } from "@/services/user.service";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: User;
  onSuccess: (updatedData: Partial<User>) => void;
}

export default function EditProfileDialog({
  open,
  onOpenChange,
  userData,
  onSuccess,
}: EditProfileDialogProps) {
  const [fullName, setFullName] = useState(userData.fullName || "");
  const [bio, setBio] = useState(userData.bio || "");
  const [isSaving, setIsSaving] = useState(false);
  const { updateUser } = useAuth();

  useEffect(() => {
    if (open) {
      setFullName(userData.fullName || "");
      setBio(userData.bio || "");
    }
  }, [open, userData]);

  const handleSave = async () => {
    if (!fullName.trim()) {
      toast.error("Tên hiển thị không được để trống!");
      return;
    }

    try {
      setIsSaving(true);

      const formData = new FormData();
      formData.append("FullName", fullName);
      formData.append("Bio", bio);

      const updatedUser = await userService.updateProfile(formData);

      updateUser({ fullName: updatedUser.fullName, bio: updatedUser.bio });
      onSuccess({ fullName: updatedUser.fullName, bio: updatedUser.bio });

      toast.success("Cập nhật thông tin thành công!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Lỗi khi lưu thông tin.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-130 p-0 overflow-hidden bg-white border-none shadow-2xl rounded-xl">
        {/* HEADER: Sticky top để luôn hiển thị */}
        <DialogHeader className="px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <DialogTitle className="text-xl font-bold text-gray-900">
            Chỉnh sửa trang cá nhân
          </DialogTitle>
          <DialogDescription className="text-[15px] text-gray-500 mt-1.5">
            Cập nhật thông tin cá nhân để mọi người hiểu rõ hơn về bạn.
          </DialogDescription>
        </DialogHeader>

        {/* BODY: Khung cuộn mượt mà nếu nội dung dài */}
        <div className="px-6 py-6 space-y-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
          {/* Field: Full Name */}
          <div className="space-y-2.5">
            <Label
              htmlFor="fullName"
              className="text-[15px] font-semibold text-gray-900"
            >
              Tên hiển thị <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-11 bg-gray-50/50 border-gray-200 focus-visible:border-[#0866ff] focus-visible:ring-1 focus-visible:ring-[#0866ff] text-[15px] transition-all"
              placeholder="Nhập tên hiển thị của bạn..."
            />
          </div>

          {/* Field: Bio */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="bio"
                className="text-[15px] font-semibold text-gray-900"
              >
                Tiểu sử
              </Label>
              <span
                className={`text-[13px] font-medium ${bio.length >= 150 ? "text-red-500" : "text-gray-500"}`}
              >
                {bio.length}/150
              </span>
            </div>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="min-h-30 resize-none bg-gray-50/50 border-gray-200 focus-visible:border-[#0866ff] focus-visible:ring-1 focus-visible:ring-[#0866ff] text-[15px] leading-relaxed transition-all p-3"
              placeholder="Thêm tiểu sử để giới thiệu ngắn gọn về bản thân..."
              maxLength={150}
            />
          </div>
        </div>

        {/* FOOTER: Sticky bottom, nền xám nhẹ để tách biệt với body */}
        <DialogFooter className="px-6 py-4 border-t border-gray-100 bg-gray-50/80 sticky bottom-0 flex items-center justify-end gap-3 sm:space-x-0">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
            className="font-semibold text-gray-700 hover:bg-gray-200 hover:text-gray-900 h-10 px-5"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            // Disable nút nếu đang lưu hoặc tên bị bỏ trống
            disabled={isSaving || !fullName.trim()}
            className="bg-[#0866ff] hover:bg-[#075ce5] text-white font-semibold h-10 px-6 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Thêm import này
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
import { Loader2, LogOut } from "lucide-react"; // Thêm icon LogOut
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
  
  // Lấy thêm hàm logout từ AuthContext
  const { updateUser, logout } = useAuth();
  const navigate = useNavigate();

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

  // Hàm xử lý Đăng xuất
  const handleLogout = async () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất khỏi InteractHub?")) {
      try {
        await logout();
        navigate("/login");
      } catch {
        toast.error("Có lỗi xảy ra khi đăng xuất.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        // RESPONSIVE: Full màn hình trên Mobile, dạng Modal bo góc trên Desktop
        className="w-full h-full sm:h-auto sm:max-w-130 p-0 overflow-hidden bg-white border-none shadow-2xl rounded-none sm:rounded-xl flex flex-col max-h-screen sm:max-h-[90vh]"
      >
        {/* HEADER: Cố định (shrink-0) */}
        <DialogHeader className="px-5 py-4 sm:px-6 sm:py-5 border-b border-gray-100 bg-white shrink-0">
          <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900 text-center sm:text-left">
            Chỉnh sửa trang cá nhân
          </DialogTitle>
          <DialogDescription className="text-[14px] sm:text-[15px] text-gray-500 mt-1.5 text-center sm:text-left">
            Cập nhật thông tin cá nhân để mọi người hiểu rõ hơn về bạn.
          </DialogDescription>
        </DialogHeader>

        {/* BODY: Vùng cuộn (flex-1 overflow-y-auto) */}
        <div className="flex-1 px-5 py-5 sm:px-6 sm:py-6 space-y-5 sm:space-y-6 overflow-y-auto custom-scrollbar">
          
          {/* Field: Full Name */}
          <div className="space-y-2.5">
            <Label
              htmlFor="fullName"
              className="text-[14px] sm:text-[15px] font-semibold text-gray-900"
            >
              Tên hiển thị <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-12 sm:h-11 bg-gray-50/50 border-gray-200 focus-visible:border-[#0866ff] focus-visible:ring-1 focus-visible:ring-[#0866ff] text-[15px] transition-all"
              placeholder="Nhập tên hiển thị của bạn..."
            />
          </div>

          {/* Field: Bio */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="bio"
                className="text-[14px] sm:text-[15px] font-semibold text-gray-900"
              >
                Tiểu sử
              </Label>
              <span
                className={`text-[12px] sm:text-[13px] font-medium ${bio.length >= 150 ? "text-red-500" : "text-gray-500"}`}
              >
                {bio.length}/150
              </span>
            </div>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="min-h-30 sm:min-h-30 resize-none bg-gray-50/50 border-gray-200 focus-visible:border-[#0866ff] focus-visible:ring-1 focus-visible:ring-[#0866ff] text-[15px] leading-relaxed transition-all p-3"
              placeholder="Thêm tiểu sử để giới thiệu ngắn gọn về bản thân..."
              maxLength={150}
            />
          </div>

          {/* MỚI: NÚT ĐĂNG XUẤT CHO MOBILE */}
          <div className="pt-4 sm:hidden border-t border-gray-100 mt-8!">
            <Button
              type="button"
              variant="outline"
              onClick={handleLogout}
              className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold h-12 rounded-xl"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Đăng xuất khỏi tài khoản
            </Button>
          </div>
        </div>

        {/* FOOTER: Cố định (shrink-0) */}
        <DialogFooter 
          // Mobile: Các nút xếp dọc (Lưu ở trên, Hủy ở dưới). Desktop: Xếp ngang
          className="px-4 py-3 sm:px-6 sm:py-4 border-t border-gray-100 bg-gray-50/80 shrink-0 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 safe-area-pb"
        >
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
            className="font-semibold text-gray-700 hover:bg-gray-200 hover:text-gray-900 h-11 sm:h-10 px-5 rounded-xl sm:rounded-lg"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !fullName.trim()}
            className="bg-[#0866ff] hover:bg-[#075ce5] text-white font-semibold h-11 sm:h-10 px-6 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-xl sm:rounded-lg"
          >
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
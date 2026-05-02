import { useRef, useState, useEffect } from "react";
import {
  Camera,
  Edit2,
  Plus,
  UserPlus,
  Loader2,
  UserCheck,
  UserMinus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import UserAvatar from "../common/UserAvatar";
import { userService } from "@/services/user.service";
import { toast } from "sonner";
import { type User } from "@/types/user.type";
import type { ApiErrorResponse } from "@/types/common.type";
import { Link } from "react-router-dom";
import { friendshipService } from "@/services/friendship.service";
import EditProfileDialog from "./EditProfileDialog";

interface ProfileHeaderProps {
  isCurrentUser: boolean;
  userData: User;
  onAvatarChange: (newAvatarUrl: string) => void;
  onProfileUpdate: (updatedData: Partial<User>) => void;
}

export default function ProfileHeader({
  isCurrentUser,
  userData,
  onAvatarChange,
  onProfileUpdate,
}: ProfileHeaderProps) {
  const { updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Khởi tạo state từ dữ liệu Backend trả về (Sử dụng string cho FriendshipStatus)
  const [status, setStatus] = useState(userData.friendshipStatus || null);
  const [isRequester, setIsRequester] = useState(userData.isRequester);
  const [isProcessing, setIsProcessing] = useState(false);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    setStatus(userData.friendshipStatus || null);
    setIsRequester(userData.isRequester);
  }, [userData]);

  // Xử lý upload ảnh đại diện
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("AvatarFile", file);

    try {
      setIsUploading(true);
      const updatedData = await userService.updateProfile(formData);

      updateUser({ avatarUrl: updatedData.avatarUrl });
      onAvatarChange(updatedData.avatarUrl as string);
      toast.success("Cập nhật ảnh đại diện thành công!");
    } catch (error: unknown) {
      const apiError = error as ApiErrorResponse;
      toast.error(apiError.message || "Không thể cập nhật ảnh đại diện.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddFriend = async () => {
    try {
      setIsProcessing(true);
      await friendshipService.sendRequest(userData.id);
      setStatus("Pending");
      setIsRequester(true);
    } catch {
      toast.error("Không thể gửi lời mời.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAccept = async () => {
    try {
      setIsProcessing(true);
      await friendshipService.acceptRequest(userData.id);
      setStatus("Accepted");
      toast.success("Đã trở thành bạn bè!");
    } catch {
      toast.error("Lỗi khi chấp nhận kết bạn.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelOrUnfriend = async () => {
    // Nếu đã là bạn thì cần xác nhận trước khi hủy
    if (status === "Accepted" && !window.confirm("Xác nhận hủy kết bạn?"))
      return;

    try {
      setIsProcessing(true);
      await friendshipService.removeFriendship(userData.id);
      setStatus(null);
      setIsRequester(false);
    } catch {
      toast.error("Lỗi khi thực hiện thao tác.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        {/* KHU VỰC AVATAR */}
        <div className="relative shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div
            className={`relative ${isCurrentUser ? "cursor-pointer group" : ""}`}
            onClick={() => isCurrentUser && fileInputRef.current?.click()}
          >
            <UserAvatar
              src={userData.avatarUrl}
              name={userData.fullName}
              className="w-42 h-42 border-4 border-white shadow-sm transition group-hover:brightness-90"
              fontSize="text-6xl"
            />

            {isUploading && (
              <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </div>
            )}

            {isCurrentUser && !isUploading && (
              <div className="absolute bottom-3 right-3 p-2 bg-gray-200 hover:bg-gray-300 rounded-full border-2 border-white shadow-sm">
                <Camera className="w-5 h-5 fill-black text-gray-900" />
              </div>
            )}
          </div>
        </div>

        {/* THÔNG TIN CƠ BẢN */}
        <div className="flex flex-col justify-center">
          <h1 className="text-[32px] font-bold text-gray-900 leading-tight">
            {userData.fullName}
          </h1>

          <p className="text-[15px] text-gray-500 font-semibold mt-1 hover:underline cursor-pointer">
            {userData.friendCount ?? 0} người bạn
          </p>

          {userData.bio && (
            <p className="text-[15px] text-gray-800 mt-2 max-w-md">
              {userData.bio}
            </p>
          )}
        </div>
      </div>

      {/* CỤM NÚT TƯƠNG TÁC (ACTION BUTTONS) */}
      <div className="flex gap-2 shrink-0">
        {isCurrentUser ? (
          <>
            {/* Giao diện cho chủ trang cá nhân */}
            <Link to="/story/create">
              <Button className="bg-[#0866ff] hover:bg-blue-700 font-semibold h-9">
                <Plus className="w-4 h-4 mr-1.5 stroke-3" /> Thêm vào tin
              </Button>
            </Link>
            <Button
              onClick={() => setIsEditDialogOpen(true)}
              variant="secondary"
              className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold h-9"
            >
              <Edit2 className="w-4 h-4 mr-1.5" /> Chỉnh sửa trang cá nhân
            </Button>
          </>
        ) : (
          <>
            {/* Giao diện khi xem trang người khác */}
            {/* 1. Trường hợp: Chưa có quan hệ */}
            {status === null && (
              <Button
                onClick={handleAddFriend}
                disabled={isProcessing}
                className="bg-[#0866ff] hover:bg-blue-700 font-semibold h-9"
              >
                <UserPlus className="w-4 h-4 mr-1.5" /> Thêm bạn bè
              </Button>
            )}
            {/* 2. Trường hợp: Đang chờ xử lý (Pending) */}
            {status === "Pending" && (
              <>
                {isRequester ? (
                  // Bạn là người gửi: Hiện nút Hủy
                  <Button
                    onClick={handleCancelOrUnfriend}
                    disabled={isProcessing}
                    variant="secondary"
                    className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold h-9"
                  >
                    <UserMinus className="w-4 h-4 mr-1.5" /> Hủy lời mời
                  </Button>
                ) : (
                  // HỌ LÀ NGƯỜI GỬI: Hiện nút Xác nhận & Xóa
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAccept}
                      disabled={isProcessing}
                      className="bg-[#0866ff] hover:bg-blue-700 font-semibold h-9"
                    >
                      Xác nhận
                    </Button>
                    <Button
                      onClick={handleCancelOrUnfriend}
                      disabled={isProcessing}
                      variant="secondary"
                      className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold h-9"
                    >
                      Xóa lời mời
                    </Button>
                  </div>
                )}
              </>
            )}
            {/* 3. Trường hợp: Đã là bạn bè */}
            {status === "Accepted" && (
              <Button
                onClick={handleCancelOrUnfriend}
                disabled={isProcessing}
                variant="secondary"
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold h-9"
              >
                <UserCheck className="w-4 h-4 mr-1.5" /> Bạn bè
              </Button>
            )}
          </>
        )}
      </div>
      {isCurrentUser && (
        <EditProfileDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          userData={userData}
          onSuccess={onProfileUpdate}
        />
      )}
    </div>
  );
}

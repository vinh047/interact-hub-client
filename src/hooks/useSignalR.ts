import { useState, useEffect } from "react";
import {
  HubConnectionBuilder,
  LogLevel,
  HubConnection,
  HubConnectionState,
} from "@microsoft/signalr";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// 1. THÊM BIẾN LƯU ID CHỦ SỞ HỮU KẾT NỐI
let sharedConnection: HubConnection | null = null;
let connectedUserId: string | null = null;

export function useSignalR() {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Nếu user đăng xuất -> Đóng kết nối cũ
    if (!user) {
      if (sharedConnection) {
        sharedConnection.stop().catch(console.error);
        sharedConnection = null;
        connectedUserId = null;
      }
      return;
    }

    // 2. LOGIC DIỆT KẾT NỐI MA:
    // Nếu có kết nối tồn tại, nhưng ID chủ sở hữu không khớp với người đang đăng nhập
    // -> Ép buộc đóng kết nối cũ để trình duyệt gửi Cookie của tài khoản mới.
    if (sharedConnection && connectedUserId !== user.id) {
      console.log("Phát hiện Ghost Connection, đang dọn dẹp...");
      sharedConnection.stop().catch(console.error);
      sharedConnection = null;
    }

    // 3. Khởi tạo ống kết nối mới tinh
    if (!sharedConnection) {
      sharedConnection = new HubConnectionBuilder()
        .withUrl("http://localhost:5201/hubs/notification", {
          // .withUrl("https://interacthub-api-vinh047-ekbza7hjg3b8eyd2.southeastasia-01.azurewebsites.net/hubs/notification", {

          withCredentials: true,
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      connectedUserId = user.id; // Đánh dấu chủ quyền kết nối cho user hiện tại
    }

    // Hủy đăng ký sự kiện cũ trước khi đăng ký mới (chống duplicate khi React re-render)
    sharedConnection.off("ReceiveNotification");

    // Lắng nghe sự kiện mới
    sharedConnection.on("ReceiveNotification", (notification) => {
      console.log("Nhận được thông báo mới:", notification);
      setUnreadCount((prev) => prev + 1);

      const isFriendRelated =
        notification.type === "FriendRequest" ||
        notification.type === "FriendAccept" ||
        notification.type === 2 ||
        notification.type === 3;

      if (isFriendRelated) {
        toast.success("Lời mời kết bạn", {
          description: notification.content,
          position: "bottom-left",
          duration: 5000,
        });
      } else {
        toast("Tương tác mới", {
          description: notification.content,
          position: "top-right",
          duration: 3000,
        });
      }
    });

    // Bật kết nối
    if (sharedConnection.state === HubConnectionState.Disconnected) {
      sharedConnection
        .start()
        .then(() =>
          console.log(`SignalR: Kết nối thành công cho User [${user.id}]`),
        )
        .catch((error) => console.error("SignalR: Lỗi khi kết nối:", error));
    }

    // 4. CLEANUP FUNCTION KHI COMPONENT UNMOUNT
    return () => {
      // Khi component chứa Hook này (ví dụ: Header) bị hủy, ta chỉ cần gỡ sự kiện lắng nghe.
      // Không gọi .stop() ở đây để tránh bị đứt kết nối khi người dùng chuyển trang.
      if (sharedConnection) {
        sharedConnection.off("ReceiveNotification");
      }
    };
  }, [user]);

  return {
    unreadCount,
    setUnreadCount,
    connection: sharedConnection,
  };
}

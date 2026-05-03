import { useState, useEffect } from "react";
import {
  HubConnectionBuilder,
  LogLevel,
  HubConnection,
  HubConnectionState,
} from "@microsoft/signalr";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// 1. KHAI BÁO BÊN NGOÀI HOOK ĐỂ GIỮ KẾT NỐI DUY NHẤT CHO TOÀN ỨNG DỤNG
let sharedConnection: HubConnection | null = null;

export function useSignalR() {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Nếu user đăng xuất -> Đóng kết nối
    if (!user) {
      if (sharedConnection) {
        sharedConnection.stop();
        sharedConnection = null;
      }
      return;
    }

    // 2. Chỉ khởi tạo ống kết nối nếu nó chưa từng tồn tại
    if (!sharedConnection) {
      sharedConnection = new HubConnectionBuilder()
        .withUrl("https://interacthub-api-vinh047-ekbza7hjg3b8eyd2.southeastasia-01.azurewebsites.net/hubs/notification", {
          withCredentials: true,
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();
    }

    // 3. RẤT QUAN TRỌNG: Hủy đăng ký sự kiện cũ trước khi đăng ký mới
    sharedConnection.off("ReceiveNotification");

    // 4. Lắng nghe sự kiện mới
    sharedConnection.on("ReceiveNotification", (notification) => {
      console.log("Nhận được thông báo mới:", notification);
      setUnreadCount((prev) => prev + 1);

      // Phân loại vị trí dựa vào Type của thông báo
      // Giả sử NotificationType ở Backend của bạn trả về chuỗi: "FriendRequest", "FriendAccept", "Like", "Comment"
      const isFriendRelated =
        notification.type === "FriendRequest" ||
        notification.type === "FriendAccept" ||
        notification.type === 2 ||
        notification.type === 3; // (Check theo giá trị Enum của bạn)

      if (isFriendRelated) {
        toast.success("Lời mời kết bạn", {
          description: notification.content,
          position: "bottom-left", // Hiện ở dưới cùng bên trái
          duration: 5000,
        });
      } else {
        toast("Tương tác mới", {
          description: notification.content,
          position: "top-right", // Hiện ở trên cùng bên phải
          duration: 3000,
        });
      }
    });

    // 5. Chỉ bật kết nối nếu nó đang ở trạng thái ngắt
    if (sharedConnection.state === HubConnectionState.Disconnected) {
      sharedConnection
        .start()
        .then(() => console.log("SignalR: Kết nối thành công!"))
        .catch((error) => console.error("SignalR: Lỗi khi kết nối:", error));
    }
  }, [user]); // Chạy lại khi trạng thái user thay đổi (đăng nhập/đăng xuất)

  return {
    unreadCount,
    setUnreadCount,
    connection: sharedConnection,
  };
}

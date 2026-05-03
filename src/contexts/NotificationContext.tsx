import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function useNotificationSignalR(token: string) {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!token) return;

        // 1. Khởi tạo kết nối với Backend
        const connection = new HubConnectionBuilder()
            .withUrl(`import.meta.env.VITE_API_URL/hubs/notification`, {
                accessTokenFactory: () => token // Truyền JWT token để Backend biết là ai
            })
            .configureLogging(LogLevel.Information)
            .build();

        // 2. Lắng nghe sự kiện "ReceiveNotification" từ Backend bắn sang
        connection.on("ReceiveNotification", (notification) => {
            // Tăng số lượng thông báo chưa đọc lên 1
            setUnreadCount(prev => prev + 1);
            
            // Hiện popup nhỏ xíu ở góc màn hình (dùng Sonner)
            toast("Bạn có thông báo mới!", {
               description: notification.content
            });
        });

        // 3. Bắt đầu kết nối
        connection.start().catch(err => console.error("SignalR Connection Error: ", err));

        // Cleanup khi component unmount
        return () => {
            connection.stop();
        };
    }, [token]);

    return { unreadCount, setUnreadCount };
}
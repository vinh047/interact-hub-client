// src/components/layout/NotificationDropdown.tsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Bell, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserAvatar from "../../common/UserAvatar";

// 1. Import hàm xử lý thời gian từ helper date.ts

import { notificationService } from "@/services/notification.service";
import type { Notification as AppNotification } from "@/types/notification.type";
import { formatRelativeTime } from "@/utils/date";

interface NotificationDropdownProps {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
}

export default function NotificationDropdown({
  unreadCount,
  setUnreadCount,
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Xử lý click ra ngoài để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch dữ liệu
  const fetchNotifications = async (pageNum: number) => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const res = await notificationService.getNotifications(pageNum, 10);
      const newItems = res.data as AppNotification[];

      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setNotifications((prev) => {
          const existingIds = new Set(prev.map((n) => n.id));
          const filteredNewItems = newItems.filter(
            (n) => !existingIds.has(n.id),
          );
          return [...prev, ...filteredNewItems];
        });
      }
    } catch (error) {
      console.error("Lỗi tải thông báo", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mở dropdown & đánh dấu đã đọc
  const handleToggle = async () => {
    const willOpen = !isOpen;
    setIsOpen(willOpen);

    if (willOpen) {
      if (notifications.length === 0) {
        fetchNotifications(1);
      }
      if (unreadCount > 0) {
        try {
          setUnreadCount(0);
          await notificationService.markAllAsRead();
          setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        } catch (err) {
          console.error("Lỗi khi đánh dấu đã đọc", err);
        }
      }
    }
  };

  // Bắt sự kiện cuộn tới đáy
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      !isLoading &&
      hasMore
    ) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNotifications(nextPage);
    }
  };

  const getNotificationLink = (notif: AppNotification) => {
    if (notif.type === "FriendRequest" || notif.type === "FriendAccept") {
      return `/profile/${notif.issuerId}`;
    }
    if (
      (notif.type === "Like" || notif.type === "Comment") &&
      notif.referenceId
    ) {
      return `/post/${notif.referenceId}`;
    }
    return "#";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        onClick={handleToggle}
        variant="ghost"
        size="icon"
        className={`w-10 h-10 rounded-full relative hidden sm:flex transition-colors ${isOpen ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-900 hover:bg-gray-200"}`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-4 h-4 bg-red-500 rounded-full border-[1.5px] border-white text-white text-[10px] font-bold shadow-sm">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-90 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-200 z-50 overflow-hidden flex flex-col">
          <div className="p-4 flex justify-between items-center bg-white z-10 border-b">
            <h3 className="font-bold text-2xl text-gray-900 tracking-tight">
              Thông báo
            </h3>
          </div>

          <div
            className="overflow-y-auto max-h-112.5 overscroll-contain pb-2 custom-scrollbar"
            onScroll={handleScroll}
          >
            {notifications.length === 0 && !isLoading ? (
              <div className="py-12 text-center flex flex-col items-center">
                <Bell className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium text-[15px]">
                  Bạn chưa có thông báo nào.
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <Link
                  to={getNotificationLink(notif)}
                  key={notif.id}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-start gap-3 p-3 mx-2 mt-2 rounded-lg cursor-pointer transition-colors relative ${
                    !notif.isRead
                      ? "bg-blue-50/50 hover:bg-blue-50"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <UserAvatar
                    src={notif.issuerAvatar || undefined}
                    name={notif.issuerName || "User"}
                    className="w-14 h-14 shrink-0 shadow-sm border border-gray-100"
                  />
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-[15px] text-gray-900 leading-[1.3] line-clamp-3">
                      <span className="font-semibold">{notif.issuerName}</span>{" "}
                      {notif.content}
                    </p>
                    {/* 2. Sử dụng hàm từ file date.ts ở đây */}
                    <span
                      className={`text-[13px] font-medium mt-1 inline-block ${!notif.isRead ? "text-[#0866ff]" : "text-gray-500"}`}
                    >
                      {formatRelativeTime(notif.createdAt)}
                    </span>
                  </div>
                  {!notif.isRead && (
                    <div className="w-2.5 h-2.5 bg-[#0866ff] rounded-full shrink-0 self-center mx-1 shadow-sm"></div>
                  )}
                </Link>
              ))
            )}

            {isLoading && (
              <div className="py-4 flex justify-center">
                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

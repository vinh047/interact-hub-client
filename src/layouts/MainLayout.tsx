import { Outlet } from "react-router-dom";
import Header from "@/components/layout/Header";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import DesktopRightPanel from "@/components/layout/DesktopRightPanel";
import DesktopSidebar from "@/components/layout/DesktopSidebar";

export default function MainLayout() {
  return (
    // 1. Thêm overflow-x-hidden để chống lỗi cuộn ngang trên Mobile
    <div className="min-h-screen bg-gray-50 flex flex-col w-full font-sans">
      {/* 1. GLOBAL HEADER */}
      <Header />

      <div className="flex justify-between w-full max-w-625 mx-auto pt-14 px-0 lg:px-4">
        {/* LEFT PANEL (Cột trái - Sidebar)  */}
        <div className="hidden lg:block w-70 xl:w-[320px] shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] pt-24 pb-6 overflow-y-auto custom-scrollbar">
          <DesktopSidebar />
        </div>

        {/* MIDDLE PANEL (Cột giữa - Bảng tin/Feed)
         */}
        <div className="flex-1 w-full max-w-500 mx-auto px-0 sm:px-4 flex flex-col min-h-[calc(100vh-3.5rem)] items-center min-w-0">
          <main className="pb-24 lg:pb-8 w-full flex flex-col items-center mt-4 lg:mt-6">
            <Outlet />
          </main>

          {/* MOBILE BOTTOM NAV
           */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-60 bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom)]">
            <MobileBottomNav />
          </div>
        </div>

        {/* RIGHT PANEL (Cột phải - Trending) */}
        <div className="hidden xl:block w-70 xl:w-[320px] shrink-0 sticky top-14 h-[calc(900vh-3.5rem)] pt-6 pb-6 bg-transparent">
          <DesktopRightPanel />
        </div>
      </div>
    </div>
  );
}

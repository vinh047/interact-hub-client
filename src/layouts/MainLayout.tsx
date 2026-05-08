import { Outlet } from "react-router-dom";
import Header from "@/components/layout/Header";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import DesktopRightPanel from "@/components/layout/DesktopRightPanel";
import DesktopSidebar from "@/components/layout/DesktopSidebar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full font-sans">
      {/* 1. GLOBAL HEADER */}
      <Header />

      {/* 2. CONTAINER CHÍNH: 
          - Tăng max-w lên 1600px 
          - Dùng justify-between để đẩy Sidebar và Right Panel ra sát 2 rìa
          - Điều chỉnh px-4 lg:px-8 xl:px-12 để cách lề màn hình một khoảng vừa đẹp
      */}
      <div className="flex justify-between w-full max-w-625 mx-auto pt-14 px-4">
        
        {/* LEFT PANEL (Cột trái - Sidebar) */}
        <div className="hidden lg:block w-70 xl:w-[320px] shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] pt-24 pb-6 overflow-y-auto custom-scrollbar">
          <DesktopSidebar />
        </div>

        {/* MIDDLE PANEL (Cột giữa - Bảng tin/Feed) 
            Thêm mx-auto để nó luôn tự động căn giữa màn hình
        */}
        <div className="flex-1 w-full max-w-500 mx-auto px-0 sm:px-4 flex flex-col min-h-[calc(100vh-3.5rem)] items-center">
          <main className="pb-16 md:pb-8 w-full flex flex-col items-center mt-6">
            <Outlet />
          </main>

          {/* MOBILE BOTTOM NAV */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
            <MobileBottomNav />
          </div>
        </div>

        {/* RIGHT PANEL (Cột phải - Trending) */}
        <div className="hidden xl:block w-70 xl:w-[320px] shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] pt-6 pb-6 bg-transparent">
          <DesktopRightPanel />
        </div>

      </div>
    </div>
  );
}
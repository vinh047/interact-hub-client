import { Outlet } from "react-router-dom";
import MobileHeader from "@/components/layout/MobileHeader";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import DesktopSidebar from "@/components/layout/DesktopSidebar";
import DesktopRightPanel from "@/components/layout/DesktopRightPanel";

export default function MainLayout() {
  return (
    // 1. Giới hạn tổng độ rộng tối đa là 1200px và tự động canh giữa (mx-auto)
    <div className="min-h-screen bg-gray-50 flex justify-center w-full mx-auto">
      
      {/* 1. LEFT SIDEBAR */}
      {/* ĐÃ SỬA: Thay fixed bằng sticky, bỏ left-0, thêm shrink-0 để không bị bóp */}
      <div className="hidden md:block w-62.5 shrink-0 sticky top-0 h-screen border-r border-gray-100 bg-white">
        <DesktopSidebar />
      </div>

      {/* 2. MAIN CONTENT (Ở giữa) */}
      {/* ĐÃ SỬA: Bỏ w-150 và ml-64, dùng flex-1 w-full để nó tự lấp đầy khoảng trống */}
      <div className="flex-1 w-full max-w-full px-0 sm:px-4 md:px-8 lg:px-12 flex flex-col min-h-screen items-center">
        
        {/* MOBILE HEADER */}
        <div className="md:hidden sticky top-0 z-50 bg-white border-b">
           <MobileHeader />
        </div>

        {/* NỘI DUNG THAY ĐỔI */}
        <main className="pb-16 md:pb-0">
          <Outlet /> 
        </main>

        {/* MOBILE BOTTOM NAV */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t">
           <MobileBottomNav />
        </div>
      </div>

      {/* 3. RIGHT PANEL */}
      {/* ĐÃ SỬA: Thay fixed bằng sticky, bỏ right-0 */}
      <div className="hidden lg:block w-[320px] shrink-0 sticky top-0 h-screen border-l border-gray-100 bg-transparent">
         <DesktopRightPanel />
      </div>

    </div>
  );
}
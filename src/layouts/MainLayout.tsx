import { Outlet } from "react-router-dom";
import Header from "@/components/layout/Header";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import DesktopSidebar from "@/components/layout/DesktopSidebar";
import DesktopRightPanel from "@/components/layout/DesktopRightPanel";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      {/* 1. GLOBAL HEADER CHO DESKTOP & MOBILE */}
      <Header />

      {/* 2. CONTAINER CHÍNH NẰM DƯỚI HEADER  */}
      <div className="flex justify-center w-full max-w-480 mx-auto pt-14">
        {/* LEFT SIDEBAR  */}
        <div className="hidden md:block w-62.5 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] border-r border-gray-100 bg-white">
          <DesktopSidebar />
        </div>

        {/* MAIN CONTENT (Ở giữa) */}
        <div className="flex-1 w-full max-w-full px-0 sm:px-4 md:px-8 lg:px-12 flex flex-col min-h-[calc(100vh-3.5rem)] items-center">
          <main className="pb-16 md:pb-0 w-full flex justify-center">
            <Outlet />
          </main>

          {/* MOBILE BOTTOM NAV */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t">
            <MobileBottomNav />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="hidden lg:block w-[320px] shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] border-l border-gray-100 bg-transparent">
          <DesktopRightPanel />
        </div>
      </div>
    </div>
  );
}

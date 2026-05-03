import { Outlet } from "react-router-dom";
import Header from "@/components/layout/Header";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import DesktopRightPanel from "@/components/layout/DesktopRightPanel";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      {/* 1. GLOBAL HEADER */}
      <Header />

      {/* 2. CONTAINER CHÍNH */}
      <div className="flex justify-center w-full max-w-400 mx-auto pt-14 px-0 md:px-4 lg:gap-8">
        <div className="hidden lg:block w-[320px] shrink-0"></div>

        <div className="flex-1 w-full max-w-170 px-0 sm:px-4 flex flex-col min-h-[calc(100vh-3.5rem)] items-center">
          <main className="pb-16 md:pb-8 w-full flex justify-center mt-6">
            <Outlet />
          </main>

          {/* MOBILE BOTTOM NAV */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t">
            <MobileBottomNav />
          </div>
        </div>

        {/* RIGHT PANEL (Cột phải) */}
        <div className="hidden xl:block w-[320px] shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] bg-transparent pt-6">
          <DesktopRightPanel />
        </div>
      </div>
    </div>
  );
}

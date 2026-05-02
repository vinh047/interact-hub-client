import { Outlet } from "react-router-dom";
import Header from "@/components/layout/Header";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

export default function HeaderOnlyLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      <Header />

      <div className="flex justify-center w-full mx-auto pt-14">
        <main className="w-full pb-16 md:pb-0">
          <Outlet />
        </main>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t">
        <MobileBottomNav />
      </div>
    </div>
  );
}

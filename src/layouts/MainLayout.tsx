import { Outlet } from "react-router-dom";
// import Navbar from '@/components/common/Navbar';
// import Sidebar from '@/components/common/Sidebar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* <Navbar /> */}

      <div className="max-w-7xl mx-auto flex pt-4">
        {/* <Sidebar /> */}

        <main className="flex-1 px-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

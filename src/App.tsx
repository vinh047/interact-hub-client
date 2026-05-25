import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Layouts
import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "@/components/common/ProtectedRoute";

// Pages
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { Toaster } from "./components/ui/sonner";
import Home from "./pages/Home";
import CreateStoryPage from "./pages/story/CreateStoryPage";
import StoryDetailPage from "./pages/story/StoryDetailPage";

import PostModal from "./components/post/PostModal";
import { useEffect } from "react";
import { toast } from "sonner";
import ProfilePage from "./pages/ProfilePage";
import HeaderOnlyLayout from "./layouts/HeaderOnlyLayout";
import SearchPage from "./pages/SearchPage";
import Explore from "./pages/Explore";
import NotFound from "./pages/NotFound";

function AppRoutes() {
  const location = useLocation();

  // Kiểm tra xem URL hiện tại có phải là link bài viết không
  const isPostRoute = location.pathname.startsWith("/post/");

  // - Nếu đi từ Bảng tin vào (Soft Load): dùng location.state.background
  // - Nếu F5 hoặc dán link thẳng (Hard Load): giả lập background là "/"
  // -> Điều này ép Router chính LUÔN LUÔN render Trang chủ ở dưới nền.
  const background =
    location.state?.background || (isPostRoute ? { pathname: "/" } : null);

  return (
    <>
      {/* ROUTER CHÍNH: Render nền */}
      <Routes location={background || location}>
        {/* CÁC TRANG PUBLIC */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* CÁC TRANG PROTECTED */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route element={<HeaderOnlyLayout />}>
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/explore" element={<Explore />} />
          </Route>

          <Route path="/story/create" element={<CreateStoryPage />} />
          <Route path="/stories/:id" element={<StoryDetailPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* ROUTER PHỤ (MODAL): Render đè lên nếu đang ở link bài viết */}
      {isPostRoute && (
        <Routes location={location}>
          <Route element={<ProtectedRoute />}>
            {/* Modal bây giờ sẽ bắt mọi request vào /post/:postId */}
            <Route path="/post/:postId" element={<PostModal />} />
          </Route>
        </Routes>
      )}
    </>
  );
}

function App() {
  useEffect(() => {
    // Kiểm tra xem có thông báo nào đang chờ không
    const flashMessage = sessionStorage.getItem("flash_toast");

    if (flashMessage) {
      // Hiện thông báo lên
      toast.success(flashMessage);
      // Xóa đi để tránh F5 lần sau lại bị hiện tiếp
      sessionStorage.removeItem("flash_toast");
    }
  }, []);
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <Toaster position="top-right" richColors closeButton />
    </AuthProvider>
  );
}

export default App;

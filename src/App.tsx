import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/*CÁC TRANG PUBLIC */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/*  CÁC TRANG PROTECTED */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
            </Route>
          </Route>

          {/* Bắt lỗi 404 */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors closeButton />
    </AuthProvider>
  );
}

export default App;

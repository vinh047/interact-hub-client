# InteractHub - Social Media Web Application (Frontend Client)

InteractHub là một mạng xã hội hiện đại, cho phép người dùng kết nối, đăng bài, bình luận và chia sẻ những khoảnh khắc (Story) một cách nhanh chóng.

Đây là phần Frontend (Client-side) của dự án bài tập lớn môn **C# and .NET Development** (Học kỳ Spring 2026) tại Đại học Sài Gòn.

## 🚀 Công nghệ sử dụng (Technology Stack)

Dự án được xây dựng dưới dạng Single Page Application (SPA), tuân thủ nghiêm ngặt các tiêu chuẩn của môi trường Enterprise:

- **Core:** React 18+ & TypeScript (Strict Mode)
- **Build Tool:** Vite (Tối ưu hóa tốc độ build)
- **Styling & UI:** Tailwind CSS v4 (Mobile-first design) kết hợp cùng `shadcn/ui`
- **Routing:** React Router v6
- **State Management & API Integration:** \* Axios (Xử lý HTTP Requests & Interceptors)
  - Context API (Quản lý Global State cho Authentication)
- **Forms & Validation:** React Hook Form kết hợp Zod schema validation

## ✨ Các tính năng cốt lõi

- **🔐 Authentication & Security:** \* Form Đăng nhập/Đăng ký với validation chặt chẽ.
  - Quản lý JWT Token qua Local Storage và Axios Interceptors.
  - Phân quyền truy cập (Protected Routes).
- **📱 UI/UX & Responsive Design:**
  - Kiến trúc component tái sử dụng (Atomic Design).
  - Giao diện Responsive 100%, tối ưu hóa cho thiết bị di động (Mobile-friendly).
- **⚡ Hiệu năng & Trải nghiệm (Dynamic Features):**
  - Kỹ thuật Optimistic UI Updates (Cập nhật giao diện lập tức khi thả Like/Comment).
  - Lazy Loading và Loading Skeletons tăng trải nghiệm người dùng.
  - Tích hợp cơ chế Debouncing cho chức năng tìm kiếm.
  - Real-time notifications với SignalR.

## 📂 Cấu trúc thư mục (Folder Structure)

```text
src/
├── assets/         # Hình ảnh, SVG, fonts tĩnh
├── components/     # UI Components
│   ├── ui/         # Components cơ sở nguyên tử (Button, Input, Form từ shadcn/ui)
│   └── common/     # Components lắp ráp phức tạp (PostCard, Navbar, Sidebar)
├── contexts/       # Global State (AuthContext, ThemeContext)
├── hooks/          # Custom Hooks (useAuth, useDebounce)
├── layouts/        # Khung giao diện (MainLayout, AuthLayout)
├── pages/          # Các trang chính tương ứng với Router (Home, Login, Profile)
├── services/       # Cấu hình gọi API (api.ts, auth.service.ts)
├── types/          # Định nghĩa TypeScript Interfaces & Types lấy từ Backend DTOs
└── utils/          # Hàm tiện ích (errorHandler, formatDate)
```

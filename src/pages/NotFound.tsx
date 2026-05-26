import { Link } from "react-router-dom";
import { useLottie } from "lottie-react";

import tRexAnimation from "@/assets/404-page-not-found.json";

export default function NotFound() {
  const options = {
    animationData: tRexAnimation,
    loop: true,
    autoplay: true,
  };

  // Hook sẽ tự động bọc animation vào một View hợp lệ của React
  const { View } = useLottie(options);

  return (
    <div className="flex flex-col items-center justify-center max-h-[90vh] bg-white text-gray-800 px-4">
      {/* Animation từ file JSON */}
      <div className="w-full max-w-[500px]">
        {View}
      </div>

      {/* Nội dung thông báo */}
      <div className="text-center mt-8 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          404 - Trang không tìm thấy
        </h1>

        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Chú khủng long T-Rex đã đi lạc và trang bạn tìm kiếm cũng vậy.
        </p>

        {/* Nút quay về trang chủ */}
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

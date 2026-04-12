import StoryFeed from "@/components/home/feed/StoryFeed";

export default function Home() {
  return (
    <div className="max-w-150 pt-4 min-w-170 mx-auto">
      {" "}
      {/* Giới hạn độ rộng như PC */}
      {/* KHỐI 1: STORY */}
      <StoryFeed />
      {/* KHỐI 2: ĐĂNG BÀI (CREATE POST) - Sẽ làm tiếp theo */}
      <div className="p-4 mt-4 bg-white rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
        [Khu vực Form đăng bài sẽ nằm ở đây]
      </div>
      {/* KHỐI 3: DANH SÁCH BÀI VIẾT (FEED) */}
      <div className="mt-4 space-y-4">
        <div className="h-64 bg-white rounded-xl shadow-sm border border-gray-100"></div>
        <div className="h-64 bg-white rounded-xl shadow-sm border border-gray-100"></div>
      </div>
    </div>
  );
}

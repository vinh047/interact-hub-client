import CreatePostForm from "@/components/home/createPostForm/CreatePostForm";
import StoryFeed from "@/components/home/feed/StoryFeed";

export default function Home() {
  return (
    <div className="max-w-150 pt-4 min-w-170 mx-auto pb-10">
      {/* KHỐI 1: STORY */}
      <StoryFeed />

      {/* KHỐI 2: ĐĂNG BÀI (CREATE POST) */}
      <div className="mt-4">
        <CreatePostForm />
      </div>

      {/* KHỐI 3: DANH SÁCH BÀI VIẾT (FEED) */}
      <div className="mt-4 space-y-4">
        {/* Placeholder cho PostCard sau này */}
        <div className="h-64 bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse"></div>
        <div className="h-64 bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse"></div>
      </div>
    </div>
  );
}
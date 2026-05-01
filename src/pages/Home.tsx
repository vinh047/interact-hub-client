import CreatePostForm from "@/components/home/createPostForm/CreatePostForm";
import StoryFeed from "@/components/home/feed/StoryFeed";
import PostFeed from "@/components/home/feed/PostFeed"; // Import component vừa tạo

export default function Home() {
  return (
    <div className="max-w-150 pt-4 min-w-170 mx-auto pb-10">
      {/* KHỐI 1: STORY FEED */}
      <StoryFeed />

      {/* KHỐI 2: FORM ĐĂNG BÀI */}
      <div className="mt-4">
        <CreatePostForm />
      </div>

      {/* KHỐI 3: DANH SÁCH BÀI VIẾT (FEED) */}
      <PostFeed />
    </div>
  );
}
import CreatePostForm from "@/components/home/createPostForm/CreatePostForm";
import StoryFeed from "@/components/home/feed/StoryFeed";
import PostFeed from "@/components/home/feed/PostFeed";

export default function Home() {
  return (
    <div className="w-full lg:max-w-200 lg:min-w-170 pt-2 sm:pt-4 mx-auto pb-10 px-2 sm:px-4 lg:px-0">
      {/* KHỐI 1: STORY FEED */}
      <StoryFeed />

      {/* KHỐI 2: FORM ĐĂNG BÀI */}
      <div className="mt-2 sm:mt-4">
        <CreatePostForm />
      </div>

      {/* KHỐI 3: DANH SÁCH BÀI VIẾT (FEED) */}
      <PostFeed />
    </div>
  );
}

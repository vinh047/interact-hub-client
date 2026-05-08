import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileFriendsGrid from "@/components/profile/ProfileFriendsGrid";
import ProfileFeedSection from "@/components/profile/ProfileFeedSection";
import type { User } from "@/types/user.type";
import { userService } from "@/services/user.service";
import { toast } from "sonner";
import ProfileFriendsSection from "@/components/profile/ProfileFriendsSection";
import ProfilePhotosSection from "@/components/profile/ProfilePhotosSection";
import StoryArchiveSection from "@/components/profile/StoryArchiveSection";

export default function ProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "all";

  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const isCurrentUser = !id || id === currentUser?.id;
  const [isLoading, setIsLoading] = useState(true);

  const [profileUser, setProfileUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);

        // Lấy ID từ URL, nếu không có thì lấy ID của user đang đăng nhập
        const targetId = id || currentUser?.id;

        if (!targetId) return;

        const data = await userService.getProfile(targetId);
        setProfileUser(data);
      } catch {
        toast.error("Không thể tải thông tin người dùng");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [id, currentUser?.id]);

  const handleTabChange = (value: string) => {
    if (value === "all") {
      searchParams.delete("tab");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ tab: value });
    }
  };

  if (isLoading)
    return <div className="text-center py-20">Đang tải trang cá nhân...</div>;

  return (
    <>
      <div className="bg-white shadow-sm pt-8 min-h-screen">
        <div className="max-w-5xl mx-auto px-4">
          <ProfileHeader
            isCurrentUser={isCurrentUser}
            userData={profileUser || currentUser!}
            onAvatarChange={(newUrl) => {
              setProfileUser((prev) =>
                prev ? { ...prev, avatarUrl: newUrl } : null,
              );
            }}
            onProfileUpdate={(updatedData) => {
              setProfileUser((prev) =>
                prev ? { ...prev, ...updatedData } : null,
              );
            }}
          />

          {/* Menu Tabs */}
          <Tabs
            value={currentTab}
            onValueChange={handleTabChange}
            defaultValue="all"
            className="w-full mt-1"
          >
            <TabsList className="flex w-full justify-start h-14 bg-transparent p-0 gap-2 overflow-x-auto scrollbar-hide border-none">
              <TabsTrigger
                value="all"
                className="h-full rounded-none px-4 text-[15px] font-semibold text-gray-600 bg-transparent border-transparent border-b-[3px] hover:bg-gray-100 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#0866ff] data-[state=active]:border-b-[#0866ff] focus-visible:ring-0"
              >
                Tất cả
              </TabsTrigger>

              <TabsTrigger
                value="friends"
                className="h-full rounded-none px-4 text-[15px] font-semibold text-gray-600 bg-transparent border-transparent border-b-[3px] hover:bg-gray-100 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#0866ff] data-[state=active]:border-b-[#0866ff] focus-visible:ring-0"
              >
                Bạn bè
              </TabsTrigger>

              <TabsTrigger
                value="photos"
                className="h-full rounded-none px-4 text-[15px] font-semibold text-gray-600 bg-transparent border-transparent border-b-[3px] hover:bg-gray-100 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#0866ff] data-[state=active]:border-b-[#0866ff] focus-visible:ring-0"
              >
                Ảnh
              </TabsTrigger>

              {isCurrentUser && (
                <TabsTrigger
                  value="archive"
                  className="h-full rounded-none px-4 text-[15px] font-semibold text-gray-600 bg-transparent border-transparent border-b-[3px] hover:bg-gray-100 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#0866ff] data-[state=active]:border-b-[#0866ff] focus-visible:ring-0"
                >
                  Kho lưu trữ tin
                </TabsTrigger>
              )}
            </TabsList>

            {/* 2. Phần Body 2 cột (Nền xám) */}
            <div className="bg-gray-100 -mx-4 px-4 border-t border-gray-200">
              <div className="max-w-5xl mx-auto py-4">
                <TabsContent value="all" className="mt-0 outline-none">
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    {/* CỘT TRÁI (40%) - ĐÃ THÊM THUỘC TÍNH STICKY */}
                    <div className="w-full md:w-[40%] space-y-4 md:sticky md:top-20 h-fit">
                      <ProfileFriendsGrid
                        userId={profileUser?.id || currentUser?.id || ""}
                        friendCount={profileUser?.friendCount || 0}
                      />
                    </div>

                    {/* CỘT PHẢI (60%) */}
                    <div className="w-full md:w-[60%] space-y-4">
                      <ProfileFeedSection
                        isCurrentUser={isCurrentUser}
                        userId={profileUser?.id || ""}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="friends" className="mt-0 outline-none">
                  <div className="w-full">
                    <ProfileFriendsSection
                      userId={profileUser?.id || id || currentUser?.id || ""}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="photos" className="mt-0 outline-none">
                  <div className="w-full">
                    <ProfilePhotosSection
                      userId={profileUser?.id || id || currentUser?.id || ""}
                    />
                  </div>
                </TabsContent>

                {isCurrentUser && (
                  <TabsContent value="archive" className="mt-0 outline-none">
                    <div className="w-full">
                      {/* Gọi Component thay vì HTML tĩnh */}
                      <StoryArchiveSection />
                    </div>
                  </TabsContent>
                )}
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </>
  );
}

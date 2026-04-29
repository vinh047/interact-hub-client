import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { storyService } from "@/services/story.service";
import { toast } from "sonner";
import { Video, X, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { ApiErrorResponse } from "@/types/common.type";

const MAX_STORY_DURATION = 30;

export default function CreateStoryPage() {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 1. Logic dọn dẹp bộ nhớ khi chọn file mới hoặc thoát trang
  useEffect(() => {
    return () => {
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [videoPreview]);

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "video/mp4") {
      toast.error("Vui lòng chỉ chọn tệp tin định dạng MP4");
      return;
    }

    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      if (video.duration > MAX_STORY_DURATION) {
        toast.error(`Video không được quá ${MAX_STORY_DURATION} giây!`);
        handleRemoveVideo();
      } else {
        setSelectedVideo(file);
        // Tạo URL blob mới
        setVideoPreview(URL.createObjectURL(file));
      }
    };
    video.src = URL.createObjectURL(file);
  };

  const handleRemoveVideo = () => {
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setSelectedVideo(null);
    setVideoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!selectedVideo) return;
    setIsPending(true);
    try {
      await storyService.create({ mediaFile: selectedVideo });
      toast.success("Đã đăng tin thành công!");
      navigate("/");
    } catch (error: unknown) {
      const apiError = error as ApiErrorResponse;
      toast.error(apiError.message || "Lỗi khi đăng tin");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden font-sans">
      {/* SIDEBAR ĐIỀU KHIỂN */}
      <div className="w-80 bg-white text-gray-900 p-6 flex flex-col shadow-xl z-10">
        <div
          className="flex items-center gap-2 mb-8 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <ChevronLeft className="w-5 h-5" />
          <h1 className="text-xl font-bold">Tạo tin video</h1>
        </div>

        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-6 italic">
            Gợi ý: Video ngắn dưới {MAX_STORY_DURATION}s giúp bạn bè dễ theo dõi
            hơn.
          </p>

          {!selectedVideo ? (
            <Button
              className="w-full h-40 border-2 border-dashed border-gray-300 flex flex-col gap-3 hover:bg-gray-50 hover:border-blue-400 transition-all rounded-xl"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="p-4 bg-blue-50 rounded-full">
                <Video className="w-8 h-8 text-blue-600" />
              </div>
              <span className="font-medium">Chọn video MP4 từ máy tính</span>
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl flex justify-between items-center border border-blue-100">
                <div className="flex items-center gap-3 overflow-hidden">
                  <Video className="w-5 h-5 text-blue-600 shrink-0" />
                  <span className="truncate text-sm font-semibold text-blue-900">
                    {selectedVideo.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveVideo}
                  className="hover:bg-blue-200 rounded-full shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-6 text-lg rounded-xl shadow-lg"
                onClick={handleUpload}
                disabled={isPending}
              >
                {isPending ? "Đang xử lý..." : "Chia sẻ lên tin"}
              </Button>
            </div>
          )}
        </div>
        <input
          type="file"
          hidden
          ref={fileInputRef}
          accept="video/mp4"
          onChange={handleVideoChange}
        />
      </div>

      {/* KHU VỰC PREVIEW */}
      <div className="flex-1 flex items-center justify-center bg-[#0d0d0d] p-10 relative">
        <div className="w-full max-w-85 aspect-9/16 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-2xl border-2 border-gray-800 overflow-hidden relative bg-gray-900">
          {videoPreview ? (
            <video
              key={videoPreview} // Buộc load lại khi đổi file
              ref={videoRef}
              src={videoPreview}
              className="w-full h-full object-contain"
              autoPlay
              muted
              playsInline
              loop
              onCanPlay={(e) => e.currentTarget.play()} // Đảm bảo phát ngay khi load xong
            />
          ) : (
            /* Trạng thái chờ */
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-4">
              <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 mb-2">
                <Video className="w-10 h-10 text-gray-600" />
              </div>
              <p className="font-medium">Xem trước tin của bạn</p>
              <p className="text-xs text-gray-600 px-10 text-center">
                Video sẽ xuất hiện tại đây sau khi bạn chọn tệp
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

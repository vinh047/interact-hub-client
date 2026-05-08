import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { storyService } from "@/services/story.service";
import { toast } from "sonner";
import { Video, X, ChevronLeft, Loader2 } from "lucide-react";
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
    // 1. Chuyển flex thành flex-col trên mobile, flex-row trên desktop
    <div className="flex flex-col lg:flex-row h-screen bg-gray-900 text-white overflow-hidden font-sans">
      {/* SIDEBAR ĐIỀU KHIỂN (Mobile: Nằm dưới - Desktop: Nằm trái) */}
      <div className="w-full lg:w-80 bg-white text-gray-900 p-5 lg:p-6 flex flex-col shadow-xl z-10 order-2 lg:order-1 shrink-0">
        {/* Header thu gọn trên mobile */}
        <div
          className="flex items-center gap-2 mb-4 lg:mb-8 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <h1 className="text-lg lg:text-xl font-bold">Tạo tin video</h1>
        </div>

        <div className="flex-1">
          <p className="text-[13px] lg:text-sm text-gray-500 mb-4 lg:mb-6 italic leading-relaxed">
            Gợi ý: Video ngắn dưới {MAX_STORY_DURATION}s giúp bạn bè dễ theo dõi
            hơn.
          </p>

          {!selectedVideo ? (
            <Button
              // sm:h-40 h-28: Thu ngắn chiều cao nút chọn video trên mobile
              className="w-full h-28 lg:h-40 border-2 border-dashed border-gray-300 flex flex-col gap-2 lg:gap-3 hover:bg-gray-50 hover:border-blue-400 transition-all rounded-xl"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="p-3 lg:p-4 bg-blue-50 rounded-full">
                <Video className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600" />
              </div>
              <span className="font-medium text-sm lg:text-base">
                Chọn video MP4
              </span>
            </Button>
          ) : (
            <div className="space-y-3 lg:space-y-4">
              <div className="p-3 lg:p-4 bg-blue-50 rounded-xl flex justify-between items-center border border-blue-100">
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
                  className="hover:bg-blue-200 rounded-full shrink-0 h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <Button
                // p-5 lg:p-6: Tăng kích thước nút chia sẻ
                className="w-full bg-blue-600 hover:bg-blue-700 font-bold p-5 lg:p-6 text-base lg:text-lg rounded-xl shadow-lg active:scale-95 transition-transform"
                onClick={handleUpload}
                disabled={isPending}
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang xử lý...</span>
                  </div>
                ) : (
                  "Chia sẻ lên tin"
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Safe area cho mobile */}
        <div className="h-2 lg:hidden" />

        <input
          type="file"
          hidden
          ref={fileInputRef}
          accept="video/mp4"
          onChange={handleVideoChange}
        />
      </div>

      {/* KHU VỰC PREVIEW (Mobile: Nằm trên - Desktop: Nằm phải) */}
      <div className="flex-1 flex items-center justify-center bg-[#0d0d0d] p-4 lg:p-10 relative order-1 lg:order-2 overflow-hidden">
        {/* Mobile: Giới hạn chiều cao max-h-[50vh] để không đẩy control panel xuống quá sâu 
          Desktop: Trở lại aspect-9/16 và max-w-85 
      */}
        <div className="w-full max-w-70 lg:max-w-85 aspect-9/16 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-2xl border-2 border-gray-800 overflow-hidden relative bg-gray-900 mx-auto">
          {videoPreview ? (
            <video
              key={videoPreview}
              ref={videoRef}
              src={videoPreview}
              className="w-full h-full object-contain"
              autoPlay
              muted
              playsInline
              loop
              onCanPlay={(e) => e.currentTarget.play()}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-3 lg:gap-4 p-6">
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 mb-2">
                <Video className="w-8 h-8 lg:w-10 lg:h-10 text-gray-600" />
              </div>
              <p className="font-bold text-sm lg:text-base">Xem trước tin</p>
              <p className="text-[11px] lg:text-xs text-gray-600 text-center leading-relaxed">
                Video sẽ xuất hiện tại đây sau khi bạn chọn tệp
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

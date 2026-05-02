import { useState, useEffect, useCallback, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { Loader2, History, X } from "lucide-react";
import { storyService } from "@/services/story.service";
import type { StoryResponse } from "@/types/story.type";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export default function StoryArchiveSection() {
  const [stories, setStories] = useState<StoryResponse[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Thêm state để quản lý Modal xem chi tiết
  const [selectedStory, setSelectedStory] = useState<StoryResponse | null>(
    null,
  );

  const isFetchingRef = useRef(false);
  const { ref, inView } = useInView({ threshold: 0, rootMargin: "300px" });

  const fetchArchive = useCallback(
    async (currentPage: number, isReset: boolean = false) => {
      if (isFetchingRef.current) return;

      try {
        isFetchingRef.current = true;
        setIsFetching(true);

        const response = await storyService.getStoryArchive({
          page: currentPage,
          limit: 10,
        });

        const newStories = response.data || [];
        setStories((prev) => (isReset ? newStories : [...prev, ...newStories]));

        const totalPages = response.pagination?.totalPages || 1;
        setHasMore(currentPage < totalPages);
      } catch (error) {
        console.error("Lỗi khi tải kho lưu trữ tin:", error);
      } finally {
        isFetchingRef.current = false;
        setIsFetching(false);
        setIsInitialLoad(false);
      }
    },
    [],
  );

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setIsInitialLoad(true);
    fetchArchive(1, true);
  }, [fetchArchive]);

  useEffect(() => {
    if (inView && hasMore && !isFetching && !isInitialLoad) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchArchive(nextPage, false);
    }
  }, [inView, hasMore, isFetching, isInitialLoad, page, fetchArchive]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  // Hàm kiểm tra định dạng an toàn
  const checkIsVideo = (story: StoryResponse) => {
    return (
      String(story.mediaType).toLowerCase().includes("video") ||
      story.mediaUrl.toLowerCase().endsWith(".mp4")
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-[20px] font-bold text-gray-900 leading-tight">
          Kho lưu trữ tin
        </h2>
        <p className="text-[15px] text-gray-500 mt-1">
          Chỉ bạn mới có thể xem kho lưu trữ tin của mình.
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {isInitialLoad ? (
          <div className="col-span-full py-10 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : stories.length > 0 ? (
          stories.map((story, idx) => {
            const isVideo = checkIsVideo(story);

            return (
              <div key={`${story.id}-${idx}`} className="flex flex-col gap-1.5">
                <div
                  onClick={() => setSelectedStory(story)}
                  className="relative aspect-9/18 overflow-hidden rounded-lg bg-black shadow-sm border border-gray-100 group cursor-pointer flex items-center justify-center"
                >
                  {isVideo ? (
                    <>
                      <video
                        src={story.mediaUrl}
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </>
                  ) : (
                    <img
                      src={story.mediaUrl}
                      alt="Story archive"
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  )}

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none" />
                </div>

                <span className="text-[13px] font-semibold text-gray-600 text-center">
                  {formatDate(story.createdAt)}
                </span>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              Bạn chưa có tin lưu trữ nào.
            </p>
          </div>
        )}
      </div>

      {hasMore && !isInitialLoad && (
        <div ref={ref} className="py-4 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      )}

      {/* MODAL XEM CHI TIẾT STORY */}
      <Dialog
        open={!!selectedStory}
        onOpenChange={(open) => !open && setSelectedStory(null)}
      >
        <DialogContent className="max-w-100 w-full p-0 bg-transparent border-none shadow-none [&>button]:hidden">
          {/* Dùng class sr-only để ẩn title mà không bị báo lỗi console */}
          <DialogTitle className="sr-only">
            Xem chi tiết tin lưu trữ
          </DialogTitle>

          {selectedStory && (
            <div className="relative w-full aspect-9/16 bg-black rounded-xl overflow-hidden flex items-center justify-center shadow-2xl">
              {/* Nút đóng tự chế */}
              <button
                onClick={() => setSelectedStory(null)}
                className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {checkIsVideo(selectedStory) ? (
                <video
                  src={selectedStory.mediaUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={selectedStory.mediaUrl}
                  alt="Story Detail"
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

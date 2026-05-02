import { useState, useEffect, useCallback, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { Loader2, ImageIcon } from "lucide-react";
import { postService } from "@/services/post.service";
import type { PostMediaResponse } from "@/types/post.type";

interface ProfilePhotosSectionProps {
  userId: string;
}

export default function ProfilePhotosSection({
  userId,
}: ProfilePhotosSectionProps) {
  const [photos, setPhotos] = useState<PostMediaResponse[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const isFetchingRef = useRef(false);

  const { ref, inView } = useInView({ threshold: 0, rootMargin: "300px" });

  const fetchPhotos = useCallback(
    async (currentPage: number, isReset: boolean = false) => {
      if (!userId || isFetchingRef.current) return;

      try {
        isFetchingRef.current = true;
        setIsFetching(true);

        const response = await postService.getUserMedia(userId, {
          page: currentPage,
          limit: 12,
        });

        const newPhotos = response.data || [];
        setPhotos((prev) => (isReset ? newPhotos : [...prev, ...newPhotos]));
        setHasMore(currentPage < (response.pagination?.totalPages || 1));
      } catch (error) {
        console.error("Lỗi khi tải ảnh:", error);
      } finally {
        isFetchingRef.current = false;
        setIsFetching(false);
      }
    },
    [userId],
  );

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchPhotos(1, true);
  }, [userId, fetchPhotos]);

  useEffect(() => {
    if (inView && hasMore && !isFetching) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPhotos(nextPage, false);
    }
  }, [inView, hasMore, isFetching, page, fetchPhotos]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Ảnh</h2>

      <div className="grid grid-cols-3 gap-2">
        {photos.length > 0
          ? photos.map((photo, idx) => {
              const isVideo =
                String(photo.mediaType).toLowerCase().includes("video") ||
                photo.mediaUrl.toLowerCase().endsWith(".mp4");

              return (
                <div
                  key={`${photo.postId}-${idx}`}
                  className="relative aspect-square overflow-hidden rounded-md border border-gray-100 bg-gray-900"
                >
                  {isVideo ? (
                    <video
                      src={photo.mediaUrl}
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={photo.mediaUrl}
                      alt="Post content"
                      className="w-full h-full object-cover transition group-hover:scale-105 cursor-pointer"
                    />
                  )}
                </div>
              );
            })
          : !isFetching && (
              <div className="col-span-3 py-20 text-center">
                <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">
                  Chưa có ảnh/video nào để hiển thị.
                </p>
              </div>
            )}
      </div>

      {hasMore && (
        <div ref={ref} className="py-4 flex justify-center">
          {isFetching && (
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          )}
        </div>
      )}
    </div>
  );
}

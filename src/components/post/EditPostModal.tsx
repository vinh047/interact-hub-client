import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { createPostSchema } from "@/validations/post.validation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import UserAvatar from "@/components/common/UserAvatar";
import { toast } from "sonner";
import { postService } from "@/services/post.service";

import { VisibilitySelect } from "../home/createPostForm/_components/VisibilitySelect";
import { MediaPreview } from "../home/createPostForm/_components/MediaPreview";
import type { Post, UpdatePostRequest } from "@/types/post.type";
import type z from "zod";
import type { PostVisibility } from "@/types/enum.type";

interface EditPostModalProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function EditPostModal({
  post,
  open,
  onOpenChange,
  onSuccess,
}: EditPostModalProps) {
  const { user: currentUser } = useAuth();
  const [isPending, setIsPending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // THÊM: Ref để thao tác trực tiếp với thẻ textarea
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [existingMedia, setExistingMedia] = useState(post.mediaFiles || []);
  const [deletedMediaIds, setDeletedMediaIds] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<
    { url: string; type: string }[]
  >([]);

  const form = useForm({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: post.content || "",
      visibility: post.visibility as PostVisibility,
    },
  });

  // Reset và Focus khi mở Modal
  useEffect(() => {
    if (open) {
      setExistingMedia(post.mediaFiles || []);
      setDeletedMediaIds([]);
      setNewFiles([]);
      setNewPreviews([]);
      form.reset({
        content: post.content || "",
        visibility: post.visibility as PostVisibility,
      });

      // XỬ LÝ FOCUS VÀ CO GIÃN TEXTAREA
      setTimeout(() => {
        if (textareaRef.current) {
          // Co giãn theo nội dung hiện có
          textareaRef.current.style.height = "auto";
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;

          // Đặt con trỏ chuột ở vị trí cuối cùng của đoạn text
          const length = textareaRef.current.value.length;
          textareaRef.current.setSelectionRange(length, length);
          textareaRef.current.focus();
        }
      }, 50); // Delay nhẹ để Dialog render xong
    }
  }, [open, post, form]);

  const contentValue = useWatch({
    control: form.control,
    name: "content",
    defaultValue: "",
  });

  const isSubmitDisabled =
    !contentValue?.trim() &&
    existingMedia.length === 0 &&
    newFiles.length === 0;

  const allPreviews = [
    ...existingMedia.map((m) => ({ url: m.mediaUrl, type: m.mediaType })),
    ...newPreviews,
  ];

  const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setNewFiles((prev) => [...prev, ...files]);
      const previews = files.map((file) => ({
        url: URL.createObjectURL(file),
        type: file.type,
      }));
      setNewPreviews((prev) => [...prev, ...previews]);
    }
    e.target.value = "";
  };

  const handleRemoveMedia = (index: number) => {
    if (index < existingMedia.length) {
      const mediaToRemove = existingMedia[index];
      setDeletedMediaIds((prev) => [...prev, mediaToRemove.id]);
      setExistingMedia((prev) => prev.filter((_, i) => i !== index));
    } else {
      const newIdx = index - existingMedia.length;
      URL.revokeObjectURL(newPreviews[newIdx].url);
      setNewFiles((prev) => prev.filter((_, i) => i !== newIdx));
      setNewPreviews((prev) => prev.filter((_, i) => i !== newIdx));
    }
  };

  // Cập nhật lại chiều cao khi user gõ phím
  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    e.currentTarget.style.height = "auto";
    e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
  };

  type EditFormValues = z.infer<typeof createPostSchema>;

  const onSubmit = async (data: EditFormValues) => {
    setIsPending(true);
    try {
      const payload: UpdatePostRequest = {
        content: data.content || "",
        visibility: data.visibility as PostVisibility,
        newMediaFiles: newFiles,
        deletedMediaIds: deletedMediaIds,
      };
      await postService.updatePost(post.id, payload);

      toast.success("Cập nhật bài viết thành công!");
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch {
      toast.error("Có lỗi xảy ra khi cập nhật bài viết.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 p-0 gap-0 bg-white border-none shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <DialogHeader className="p-4 border-b border-gray-100 shrink-0">
          <DialogTitle className="text-center text-lg font-bold">
            Chỉnh sửa bài viết
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-4 space-y-4 overflow-y-auto flex-1 custom-scrollbar"
          >
            <div className="flex items-center gap-3">
              <UserAvatar
                src={currentUser?.avatarUrl}
                name={currentUser?.fullName}
                className="h-11 w-11"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">
                  {currentUser?.fullName}
                </span>
                <VisibilitySelect control={form.control} />
              </div>
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      // THÊM: Gắn ref và sự kiện onInput
                      ref={(e) => {
                        field.ref(e);
                        textareaRef.current = e;
                      }}
                      onInput={handleInput}
                      placeholder="Bạn đang nghĩ gì?"
                      className="border-none focus-visible:ring-0 text-xl p-0 min-h-10 resize-none w-full wrap-break-word whitespace-pre-wrap overflow-hidden bg-transparent"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {allPreviews.length > 0 && (
              <MediaPreview items={allPreviews} onRemove={handleRemoveMedia} />
            )}

            <div className="border border-gray-300 rounded-lg p-3 flex items-center justify-between">
              <span className="text-[15px] font-semibold text-gray-700 ml-1">
                Thêm vào bài viết
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full h-9 w-9"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="text-green-500" />
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 font-bold h-10"
              disabled={isSubmitDisabled || isPending}
            >
              {isPending ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </form>
        </Form>
      </DialogContent>
      <input
        type="file"
        multiple
        accept="image/*,video/mp4"
        className="hidden"
        ref={fileInputRef}
        onChange={handleMediaChange}
      />
    </Dialog>
  );
}

import { useState, useRef, type ChangeEvent } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { createPostSchema } from "@/validations/post.validation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import UserAvatar from "@/components/common/UserAvatar";
import type { CreatePostRequest } from "@/types/post.type";
import { toast } from "sonner";
import { postService } from "@/services/post.service";

// Tách nhỏ các phần giao diện để Component chính gọn gàng hơn
import { VisibilitySelect } from "./_components/VisibilitySelect";
import { MediaPreview } from "./_components/MediaPreview";
import { PostTriggerBar } from "./_components/PostTriggerBar";
import { getFriendlyErrorMessage } from "@/utils/errorHandler";

export default function CreatePost() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ url: string; type: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CreatePostRequest>({
    resolver: zodResolver(createPostSchema),
    defaultValues: { content: "", visibility: "Public", mediaFiles: [] },
  });

  const contentValue = useWatch({
    control: form.control,
    name: "content",
    defaultValue: "",
  });
  const isSubmitDisabled = !contentValue?.trim() && selectedMedia.length === 0;

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
      setPreviews([]);
      setSelectedMedia([]);
      form.reset();
    }
  };

  const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const updatedMedia = [...selectedMedia, ...files];
      setSelectedMedia(updatedMedia);
      form.setValue("mediaFiles", updatedMedia, { shouldValidate: true });

      const newPreviews = files.map((file) => ({
        url: URL.createObjectURL(file),
        type: file.type,
      }));
      setPreviews((prev) => [...prev, ...newPreviews]);
      setOpen(true);
    }
    e.target.value = "";
  };

  const removeMedia = (index: number) => {
    URL.revokeObjectURL(previews[index].url);
    const newMedia = selectedMedia.filter((_, i) => i !== index);
    setSelectedMedia(newMedia);
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    form.setValue("mediaFiles", newMedia, { shouldValidate: true });
  };

  const onSubmit = async (data: CreatePostRequest) => {
    setIsPending(true);
    try {
      await postService.create(data);
      toast.success("Đăng bài viết thành công!");

      handleOpenChange(false);
    } catch (error) {
      const apiError = getFriendlyErrorMessage(error);
      toast.error(apiError);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full">
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <PostTriggerBar
            user={user}
            onMediaClick={() => fileInputRef.current?.click()}
          />
        </DialogTrigger>

        <DialogContent className="sm:max-w-125 p-0 gap-0 bg-white border-none shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
          <DialogHeader className="p-4 border-b border-gray-100 shrink-0">
            <DialogTitle className="text-center text-lg font-bold">
              Tạo bài viết
            </DialogTitle>
            <DialogDescription className="sr-only">
              Chia sẻ nội dung lên InteractHub.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-4 space-y-4 overflow-y-auto flex-1 custom-scrollbar"
            >
              <div className="flex items-center gap-3">
                <UserAvatar
                  src={user?.avatarUrl}
                  name={user?.fullName}
                  className="h-11 w-11"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900">
                    {user?.fullName}
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
                        placeholder={`${user?.fullName} ơi, bạn đang nghĩ gì thế?`}
                        className="border-none focus-visible:ring-0 text-xl p-0 min-h-20 resize-none w-full break-all whitespace-pre-wrap overflow-hidden"
                        autoFocus
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <MediaPreview items={previews} onRemove={removeMedia} />

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
                {isPending ? "Đang đăng..." : "Đăng"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <input
        type="file"
        multiple
        accept="image/*,video/mp4"
        className="hidden"
        ref={fileInputRef}
        onChange={handleMediaChange}
      />
    </div>
  );
}

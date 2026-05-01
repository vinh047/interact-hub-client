export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt?: string | null;

  authorId: string;
  authorName: string;
  authorAvatarUrl?: string | null;

  postId: string;

  parentCommentId?: string | null;

  replyCount: number;
}

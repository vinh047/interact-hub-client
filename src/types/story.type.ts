export interface Story {
  id: string;
  mediaUrl: string;
  createdAt: string;
  expiresAt: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string;
}

export interface CreateStoryRequest {
  mediaFile: File;
}

export interface GroupedStory {
  authorId: string;
  authorName: string;
  authorAvatarUrl: string | null;
  stories: Story[];
}

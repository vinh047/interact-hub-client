import type { MediaType } from "./enum.type";

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

export interface StoryResponse {
  id: string;
  mediaUrl: string;
  mediaType: MediaType | string;
  createdAt: string;
  expiresAt: string;
}

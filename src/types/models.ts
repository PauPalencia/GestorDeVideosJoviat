export type VideoSource = 'youtube' | 'instagram';

export type Video = {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl: string;
  duration?: string;
  authorName?: string;
  authorAvatarUrl?: string;
  uploadedAt?: number;
  createdAt: number;
  source: VideoSource;
  listIds: string[];
  ownerUid: string;
};

export type VideoList = {
  id: string;
  title: string;
  description: string;
  coverUrl?: string;
  createdAt: number;
  ownerUid: string;
  isFavorite: boolean;
  videoIds: string[];
  memberUids: string[];
};

export type AppUser = {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
};

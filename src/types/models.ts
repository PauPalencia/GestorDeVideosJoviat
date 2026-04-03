export type VideoSource = 'youtube' | 'instagram';

export type Video = {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  duration?: string;
  authorName?: string;
  createdAt: number;
  source: VideoSource;
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
};

export type AppUser = {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
};

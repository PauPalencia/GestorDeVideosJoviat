import { VideoSource } from '../types/models';

export const detectSource = (url: string): VideoSource =>
  url.includes('instagram.com') ? 'instagram' : 'youtube';

export const buildEmbedUrl = (url: string): string => {
  if (url.includes('youtube.com/watch')) {
    const id = url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${id}?autoplay=1`;
  }
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${id}?autoplay=1`;
  }
  if (url.includes('youtube.com/shorts/')) {
    const id = url.split('shorts/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${id}?autoplay=1`;
  }
  return url;
};

export const extractThumbnail = (url: string): string => {
  if (url.includes('youtube.com/watch')) {
    const id = url.split('v=')[1]?.split('&')[0];
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split('?')[0];
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }
  if (url.includes('youtube.com/shorts/')) {
    const id = url.split('shorts/')[1]?.split('?')[0];
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }
  return 'https://placehold.co/320x180/1b5f2f/ffffff?text=Video';
};

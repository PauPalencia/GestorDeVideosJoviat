import { VideoSource } from '../types/models';

export const detectSource = (url: string): VideoSource =>
  url.includes('instagram.com') ? 'instagram' : 'youtube';

export const buildEmbedUrl = (url: string) => {
  if (url.includes('youtube.com/watch')) {
    const id = url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  return url;
};

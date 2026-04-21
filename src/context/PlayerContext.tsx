import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Video, VideoList } from '../types/models';
import { useAuth } from './AuthContext';
import { fetchLists } from '../services/firebaseService';

type PlayerContextValue = {
  currentVideo: Video | null;
  setCurrentVideo: (v: Video | null) => void;
  activeList: VideoList | null;
  setActiveList: (l: VideoList | null) => void;
  allLists: VideoList[];
  setAllLists: React.Dispatch<React.SetStateAction<VideoList[]>>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  refreshLists: () => Promise<void>;
};

const PlayerContext = createContext<PlayerContextValue>({} as PlayerContextValue);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [activeList, setActiveList] = useState<VideoList | null>(null);
  const [allLists, setAllLists] = useState<VideoList[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const refreshLists = useCallback(async () => {
    if (!user) return;
    try {
      const data = await fetchLists(user.uid);
      setAllLists(data as VideoList[]);
    } catch (e) {
      console.warn('refreshLists error', e);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refreshLists();
    } else {
      setAllLists([]);
      setCurrentVideo(null);
      setActiveList(null);
    }
  }, [user]);

  const value = useMemo(
    () => ({
      currentVideo, setCurrentVideo,
      activeList, setActiveList,
      allLists, setAllLists,
      isPlaying, setIsPlaying,
      refreshLists,
    }),
    [currentVideo, activeList, allLists, isPlaying, refreshLists]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};

export const usePlayer = () => useContext(PlayerContext);

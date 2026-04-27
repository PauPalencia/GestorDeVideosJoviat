import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FloatingMenu } from '../components/FloatingMenu';
import { NowPlayingBar } from '../components/NowPlayingBar';
import { VideoPlayer } from '../components/VideoPlayer';
import { VideoEditorModal } from '../components/VideoEditorModal';
import { colors } from '../theme/colors';
import { Video } from '../types/models';
import { fetchFavoriteVideos } from '../services/firebaseService';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';

export const HomeScreen = () => {
  const { user } = useAuth();
  const { currentVideo, setCurrentVideo, setActiveList, allLists } = usePlayer();
  const insets = useSafeAreaInsets();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await fetchFavoriteVideos(user.uid);
      setVideos(data as Video[]);
      if (data.length > 0 && !currentVideo) {
        setCurrentVideo(data[0] as Video);
      }
    } catch (e) {
      console.warn('HomeScreen load error', e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const handleVideoPress = (video: Video) => {
    setCurrentVideo(video);
    const list = allLists.find((l) => video.listIds?.includes(l.id));
    if (list) setActiveList(list);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <VideoPlayer
        url={currentVideo?.url}
        onFullscreenChange={setIsFullscreen}
      />

      {!isFullscreen && (
        <>
          <View style={styles.videoInfo}>
            <View style={styles.avatarWrap}>
              {currentVideo?.authorAvatarUrl ? (
                <Image source={{ uri: currentVideo.authorAvatarUrl }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarLetter}>
                    {currentVideo?.title?.[0]?.toUpperCase() ?? 'A'}
                  </Text>
                </View>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.videoTitle} numberOfLines={2}>
                {currentVideo?.title ?? 'Selecciona un vídeo per reproduir-lo'}
              </Text>
              <View style={styles.metaRow}>
                {!!currentVideo?.duration && (
                  <Text style={styles.meta}>{currentVideo.duration}</Text>
                )}
                {!!currentVideo?.createdAt && (
                  <Text style={styles.meta}>
                    {new Date(currentVideo.createdAt).toLocaleDateString()}
                  </Text>
                )}
              </View>
            </View>
            <Pressable onPress={() => setEditorOpen(true)} style={styles.editIconBtn}>
              <Ionicons name="pencil" size={18} color={colors.text} />
            </Pressable>
          </View>

          <FlatList
            data={videos}
            keyExtractor={(item) => item.id}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.success} />}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <Text style={styles.sectionTitle}>Favorits</Text>
            }
            ListEmptyComponent={
              !loading ? (
                <View style={styles.emptyWrap}>
                  <Ionicons name="videocam-outline" size={48} color={colors.muted} />
                  <Text style={styles.emptyText}>
                    Afegeix un vídeo a la llista o selecciona una existent
                  </Text>
                </View>
              ) : null
            }
            renderItem={({ item }) => (
              <Pressable
                style={[styles.card, currentVideo?.id === item.id && styles.cardActive]}
                onPress={() => handleVideoPress(item)}
              >
                <Image
                  source={{ uri: item.thumbnailUrl || 'https://placehold.co/120x90/1b5f2f/fff?text=Vid' }}
                  style={styles.thumb}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                  {!!item.description && (
                    <Text style={styles.cardDesc} numberOfLines={1}>{item.description}</Text>
                  )}
                  <Text style={styles.cardDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                </View>
                {currentVideo?.id === item.id && (
                  <Ionicons name="play-circle" size={22} color={colors.success} />
                )}
              </Pressable>
            )}
          />

          <NowPlayingBar showEditor />
          <FloatingMenu />
        </>
      )}

      <VideoEditorModal
        visible={editorOpen}
        onClose={() => setEditorOpen(false)}
        onVideoCreated={load}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  videoInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    gap: 10,
    backgroundColor: colors.card,
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 12,
  },
  avatarWrap: { paddingTop: 2 },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.cardSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: { color: colors.text, fontWeight: '700', fontSize: 16 },
  videoTitle: { color: colors.text, fontWeight: '700', fontSize: 14 },
  metaRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  meta: { color: colors.muted, fontSize: 12 },
  editIconBtn: { padding: 4 },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  listContent: {
    padding: 12,
    paddingBottom: 80,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    color: colors.muted,
    textAlign: 'center',
    fontSize: 14,
    maxWidth: 240,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  cardActive: { borderWidth: 1, borderColor: colors.success },
  thumb: { width: 90, height: 60, borderRadius: 8, backgroundColor: '#2e2e2e' },
  cardTitle: { color: colors.text, fontWeight: '700', fontSize: 13 },
  cardDesc: { color: colors.muted, fontSize: 12, marginTop: 2 },
  cardDate: { color: '#8fc18e', fontSize: 11, marginTop: 4 },
});

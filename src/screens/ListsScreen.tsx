import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FloatingMenu } from '../components/FloatingMenu';
import { NowPlayingBar } from '../components/NowPlayingBar';
import { colors } from '../theme/colors';
import { Video, VideoList } from '../types/models';
import { fetchVideosByList, toggleFavoriteList } from '../services/firebaseService';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';

export const ListsScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { allLists, setAllLists, refreshLists, setCurrentVideo, setActiveList } = usePlayer();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [detailList, setDetailList] = useState<VideoList | null>(null);
  const [detailVideos, setDetailVideos] = useState<Video[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await refreshLists();
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(
    () => allLists.filter((l) => l.title.toLowerCase().includes(query.toLowerCase())),
    [allLists, query]
  );

  const handleToggleFavorite = async (list: VideoList) => {
    const next = !list.isFavorite;
    setAllLists((p) => p.map((l) => (l.id === list.id ? { ...l, isFavorite: next } : l)));
    await toggleFavoriteList(list.id, next);
  };

  const openDetail = async (list: VideoList) => {
    setDetailList(list);
    setActiveList(list);
    setDetailLoading(true);
    try {
      const vids = await fetchVideosByList(list.id);
      setDetailVideos(vids as Video[]);
    } catch {
      setDetailVideos([]);
    } finally {
      setDetailLoading(false);
    }
  };

  const handlePlayVideo = (video: Video) => {
    setCurrentVideo(video);
    router.replace('/(tabs)/');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <Text style={styles.heading}>{user?.displayName ?? 'Les meves llistes'}</Text>

        <View style={styles.searchWrap}>
          <Ionicons name="search" size={16} color={colors.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar una llista"
            placeholderTextColor={colors.muted}
            style={styles.search}
          />
          {!!query && (
            <Pressable onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.muted} />
            </Pressable>
          )}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={() => { setLoading(true); refreshLists().finally(() => setLoading(false)); }} tintColor={colors.success} />
          }
          contentContainerStyle={{ gap: 10, paddingBottom: 80 }}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Ionicons name="list-outline" size={48} color={colors.muted} />
              <Text style={styles.emptyText}>
                {query ? 'Sense resultats...' : 'No tens cap llista. Crea\'n una!'}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => openDetail(item)}>
              {item.coverUrl ? (
                <Image source={{ uri: item.coverUrl }} style={styles.cover} />
              ) : (
                <View style={styles.coverPlaceholder}>
                  <Ionicons name="musical-notes" size={20} color={colors.muted} />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
                <Text style={styles.cardDate}>
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
                </Text>
              </View>
              <Pressable onPress={() => handleToggleFavorite(item)} style={{ padding: 4 }}>
                <Ionicons
                  name={item.isFavorite ? 'star' : 'star-outline'}
                  size={22}
                  color={item.isFavorite ? '#ffd24a' : colors.muted}
                />
              </Pressable>
            </Pressable>
          )}
        />
      </View>

      <NowPlayingBar />
      <FloatingMenu />

      <Modal visible={!!detailList} animationType="slide" onRequestClose={() => setDetailList(null)}>
        <View style={[styles.detailContainer, { paddingTop: insets.top }]}>
          <View style={styles.detailHeader}>
            <Pressable onPress={() => setDetailList(null)} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={22} color={colors.text} />
            </Pressable>
            <Text style={styles.detailTitle} numberOfLines={1}>{detailList?.title}</Text>
            <Pressable onPress={() => detailList && handleToggleFavorite(detailList)} style={{ padding: 6 }}>
              <Ionicons
                name={detailList?.isFavorite ? 'star' : 'star-outline'}
                size={22}
                color={detailList?.isFavorite ? '#ffd24a' : colors.muted}
              />
            </Pressable>
          </View>

          {!!detailList?.description && (
            <Text style={styles.detailDesc}>{detailList.description}</Text>
          )}

          <FlatList
            data={detailVideos}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: 10, padding: 12, paddingBottom: 40 }}
            refreshing={detailLoading}
            onRefresh={() => detailList && openDetail(detailList)}
            ListEmptyComponent={
              !detailLoading ? (
                <View style={styles.emptyWrap}>
                  <Ionicons name="videocam-outline" size={48} color={colors.muted} />
                  <Text style={styles.emptyText}>Aquesta llista no té vídeos.</Text>
                </View>
              ) : null
            }
            renderItem={({ item }) => (
              <Pressable style={styles.card} onPress={() => handlePlayVideo(item)}>
                <Image
                  source={{ uri: item.thumbnailUrl || 'https://placehold.co/90x60/1b5f2f/fff?text=Vid' }}
                  style={styles.videoThumb}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                  {!!item.description && (
                    <Text style={styles.cardDesc} numberOfLines={1}>{item.description}</Text>
                  )}
                  <Text style={styles.cardDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                </View>
                <Ionicons name="play-circle-outline" size={24} color={colors.success} />
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, padding: 12, gap: 10 },
  heading: { color: colors.text, fontSize: 18, fontWeight: '700' },
  searchWrap: {
    backgroundColor: colors.cardSoft,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 6,
  },
  search: { flex: 1, color: colors.text, paddingVertical: 10 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 10,
    padding: 10,
    alignItems: 'center',
  },
  cover: { width: 54, height: 54, borderRadius: 10 },
  coverPlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 10,
    backgroundColor: colors.cardSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { color: colors.text, fontWeight: '700', fontSize: 14 },
  cardDesc: { color: colors.muted, fontSize: 12, marginTop: 2 },
  cardDate: { color: '#8fc18e', fontSize: 11, marginTop: 4 },
  emptyWrap: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  emptyText: { color: colors.muted, textAlign: 'center', maxWidth: 220 },
  detailContainer: { flex: 1, backgroundColor: colors.bg },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  backBtn: { padding: 4 },
  detailTitle: { color: colors.text, fontWeight: '700', fontSize: 17, flex: 1 },
  detailDesc: { color: colors.muted, padding: 12, fontSize: 13 },
  videoThumb: { width: 90, height: 60, borderRadius: 8, backgroundColor: '#2e2e2e' },
});

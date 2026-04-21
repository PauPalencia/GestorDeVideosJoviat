import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { usePlayer } from '../context/PlayerContext';
import { toggleFavoriteList } from '../services/firebaseService';
import { FavoriteListsEditorModal } from './FavoriteListsEditorModal';

type Props = {
  showEditor?: boolean;
};

export const NowPlayingBar: React.FC<Props> = ({ showEditor = false }) => {
  const { currentVideo, activeList, isPlaying, setIsPlaying, setAllLists } = usePlayer();
  const [editorVisible, setEditorVisible] = useState(false);

  const handleToggleFavorite = async () => {
    if (!activeList) return;
    const next = !activeList.isFavorite;
    setAllLists((prev) => prev.map((l) => (l.id === activeList.id ? { ...l, isFavorite: next } : l)));
    await toggleFavoriteList(activeList.id, next);
  };

  return (
    <>
      <View style={styles.container}>
        {showEditor && (
          <Pressable style={styles.editBtn} onPress={() => setEditorVisible(true)}>
            <Ionicons name="list" size={18} color={colors.text} />
          </Pressable>
        )}

        {activeList?.coverUrl ? (
          <Image source={{ uri: activeList.coverUrl }} style={styles.thumb} />
        ) : (
          <View style={styles.thumbPlaceholder}>
            <Ionicons name="musical-notes" size={16} color={colors.muted} />
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {currentVideo?.title ?? 'Cap vídeo seleccionat'}
          </Text>
          <Text style={styles.sub} numberOfLines={1}>
            {activeList?.title ?? currentVideo?.authorName ?? ''}
          </Text>
        </View>

        <Pressable onPress={() => setIsPlaying((p) => !p)} style={styles.iconBtn}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={20} color={colors.text} />
        </Pressable>

        <Pressable onPress={handleToggleFavorite} style={styles.iconBtn}>
          <Ionicons
            name={activeList?.isFavorite ? 'star' : 'star-outline'}
            size={20}
            color={activeList?.isFavorite ? '#ffd24a' : colors.muted}
          />
        </Pressable>
      </View>

      {showEditor && (
        <FavoriteListsEditorModal visible={editorVisible} onClose={() => setEditorVisible(false)} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: '#1b3e24',
    borderTopWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 8,
  },
  editBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumb: { width: 40, height: 40, borderRadius: 6 },
  thumbPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: colors.cardSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  title: { color: colors.text, fontWeight: '600', fontSize: 13 },
  sub: { color: colors.muted, fontSize: 11, marginTop: 1 },
  iconBtn: { padding: 6 },
});

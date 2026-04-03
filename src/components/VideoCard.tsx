import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Video } from '../types/models';
import { colors } from '../theme/colors';

type Props = {
  video: Video;
  onPress: () => void;
};

export const VideoCard: React.FC<Props> = ({ video, onPress }) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={{ uri: video.thumbnailUrl || 'https://placehold.co/120x90' }} style={styles.thumb} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{video.title}</Text>
        <Text style={styles.subtitle}>{new Date(video.createdAt).toLocaleDateString()}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 8,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center'
  },
  thumb: { width: 80, height: 60, borderRadius: 8, backgroundColor: '#2e2e2e' },
  title: { color: colors.text, fontWeight: '700' },
  subtitle: { color: colors.muted, marginTop: 4 }
});

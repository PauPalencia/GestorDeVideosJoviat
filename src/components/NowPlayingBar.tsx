import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

type Props = {
  title?: string;
  author?: string;
};

export const NowPlayingBar: React.FC<Props> = ({ title = 'Title', author = 'Artist' }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
      <Text style={styles.author}>{author}</Text>
      <Pressable>
        <Ionicons name="pause" size={20} color={colors.text} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: '#1b3e24',
    borderTopWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12
  },
  text: { color: colors.text, flex: 1 },
  author: { color: colors.muted, flex: 1 }
});

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { buildEmbedUrl } from '../utils/video';

type Props = {
  url?: string;
};

export const VideoPlayer: React.FC<Props> = ({ url }) => {
  if (!url) return <View style={styles.placeholder} />;

  return <WebView source={{ uri: buildEmbedUrl(url) }} style={styles.web} allowsFullscreenVideo />;
};

const styles = StyleSheet.create({
  web: { height: 210, borderRadius: 12, overflow: 'hidden' },
  placeholder: { height: 210, borderRadius: 12, backgroundColor: '#101010' }
});

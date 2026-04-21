import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import * as ScreenOrientation from 'expo-screen-orientation';
import { buildEmbedUrl } from '../utils/video';

type Props = {
  url?: string;
  onFullscreenChange?: (isFullscreen: boolean) => void;
};

export const VideoPlayer: React.FC<Props> = ({ url, onFullscreenChange }) => {
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const sub = ScreenOrientation.addOrientationChangeListener(({ orientationInfo }) => {
      const landscape =
        orientationInfo.orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
        orientationInfo.orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT;
      setIsLandscape(landscape);
      onFullscreenChange?.(landscape);
    });
    return () => ScreenOrientation.removeOrientationChangeListener(sub);
  }, [onFullscreenChange]);

  const { width, height } = Dimensions.get('window');

  if (!url) return <View style={styles.placeholder} />;

  return (
    <View
      style={
        isLandscape
          ? { position: 'absolute', top: 0, left: 0, width, height, zIndex: 100, backgroundColor: '#000' }
          : styles.normal
      }
    >
      <WebView
        source={{ uri: buildEmbedUrl(url) }}
        style={{ flex: 1 }}
        allowsFullscreenVideo
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
      />
    </View>
  );
};

const styles = StyleSheet.create({
  normal: { height: 210, borderRadius: 12, overflow: 'hidden', backgroundColor: '#000' },
  placeholder: { height: 210, borderRadius: 12, backgroundColor: '#101010' },
});

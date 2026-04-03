import React, { useRef, useState } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

type Props = {
  onHome: () => void;
  onUser: () => void;
  onLists: () => void;
};

export const FloatingMenu: React.FC<Props> = ({ onHome, onUser, onLists }) => {
  const [expanded, setExpanded] = useState(false);
  const pan = useRef(new Animated.ValueXY({ x: 280, y: 560 })).current;

  const responder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
    onPanResponderRelease: () => {
      pan.flattenOffset();
    },
    onPanResponderGrant: () => pan.extractOffset()
  });

  return (
    <Animated.View style={[styles.host, { transform: pan.getTranslateTransform() }]} {...responder.panHandlers}>
      {expanded && (
        <View style={styles.bubbles}>
          <IconButton icon="star" onPress={onHome} />
          <IconButton icon="person" onPress={onUser} />
          <IconButton icon="menu" onPress={onLists} />
        </View>
      )}
      <IconButton icon={expanded ? 'close' : 'home'} onPress={() => setExpanded((p) => !p)} primary />
    </Animated.View>
  );
};

const IconButton: React.FC<{ icon: keyof typeof Ionicons.glyphMap; onPress: () => void; primary?: boolean }> = ({
  icon,
  onPress,
  primary
}) => (
  <Pressable onPress={onPress} style={[styles.btn, primary ? styles.primary : styles.secondary]}>
    <Ionicons name={icon} color="#fff" size={20} />
  </Pressable>
);

const styles = StyleSheet.create({
  host: { position: 'absolute', zIndex: 60 },
  bubbles: { gap: 8, marginBottom: 8, alignItems: 'center' },
  btn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3
  },
  primary: { backgroundColor: colors.accent },
  secondary: { backgroundColor: colors.success }
});

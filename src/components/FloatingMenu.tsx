import React, { useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../theme/colors';

const { width: SW, height: SH } = Dimensions.get('window');

export const FloatingMenu: React.FC = () => {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const pan = useRef(new Animated.ValueXY({ x: SW - 80, y: SH - 200 })).current;

  const responder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => pan.extractOffset(),
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
    onPanResponderRelease: () => pan.flattenOffset(),
  });

  return (
    <Animated.View
      style={[styles.host, { transform: pan.getTranslateTransform() }]}
      {...responder.panHandlers}
    >
      {expanded && (
        <View style={styles.bubbles}>
          <NavButton icon="star" onPress={() => { setExpanded(false); router.replace('/(tabs)/'); }} />
          <NavButton icon="person" onPress={() => { setExpanded(false); router.replace('/(tabs)/user'); }} />
          <NavButton icon="menu" onPress={() => { setExpanded(false); router.replace('/(tabs)/lists'); }} />
        </View>
      )}
      <Pressable
        style={[styles.btn, styles.primary]}
        onPress={() => setExpanded((p) => !p)}
      >
        <Ionicons name={expanded ? 'close' : 'home'} color="#fff" size={22} />
      </Pressable>
    </Animated.View>
  );
};

const NavButton: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}> = ({ icon, onPress }) => (
  <Pressable onPress={onPress} style={[styles.btn, styles.secondary]}>
    <Ionicons name={icon} color="#fff" size={20} />
  </Pressable>
);

const styles = StyleSheet.create({
  host: { position: 'absolute', zIndex: 60, alignItems: 'center' },
  bubbles: { gap: 8, marginBottom: 8, alignItems: 'center' },
  btn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  primary: { backgroundColor: colors.accent },
  secondary: { backgroundColor: colors.success },
});

import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../src/theme/colors';

export default function LandingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.logoWrap}>
        <Ionicons name="play-circle" size={80} color={colors.success} />
        <Text style={styles.appName}>VideoLlistes</Text>
        <Text style={styles.tagline}>Gestiona els teus vídeos favorits</Text>
      </View>
      <View style={styles.actions}>
        <Pressable style={styles.primaryBtn} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.primaryBtnText}>Iniciar sessió</Text>
        </Pressable>
        <Pressable style={styles.secondaryBtn} onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.secondaryBtnText}>Registrar-se</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, justifyContent: 'space-between', padding: 32 },
  logoWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  appName: { color: colors.text, fontSize: 32, fontWeight: '800', letterSpacing: 1 },
  tagline: { color: colors.muted, fontSize: 14 },
  actions: { gap: 14 },
  primaryBtn: { backgroundColor: colors.success, borderRadius: 30, paddingVertical: 16, alignItems: 'center' },
  primaryBtnText: { color: '#000', fontSize: 17, fontWeight: '700' },
  secondaryBtn: { backgroundColor: colors.cardSoft, borderRadius: 30, paddingVertical: 16, alignItems: 'center' },
  secondaryBtnText: { color: colors.text, fontSize: 17, fontWeight: '600' },
});

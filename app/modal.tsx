import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function ModalScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modal</Text>
      <Pressable onPress={() => router.back()} style={styles.btn}>
        <Text style={styles.btnText}>Tancar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#3e3f42' },
  title: { color: '#f2f5f4', fontSize: 20, fontWeight: '700', marginBottom: 16 },
  btn: { backgroundColor: '#8923d6', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 24 },
  btnText: { color: '#fff', fontWeight: '700' },
});

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { loginWithEmail, resetPassword } from '../../src/services/firebaseService';
import { colors } from '../../src/theme/colors';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetModalVisible, setResetModalVisible] = useState(false);

  const submit = async () => {
    if (!email.includes('@')) return setError('Format de correu incorrecte');
    if (!password) return setError('Introdueix la contrasenya');
    try {
      setError('');
      await loginWithEmail(email.trim(), password);
    } catch {
      setError('El correu o la contrasenya són incorrectes');
    }
  };

  const onReset = async () => {
    if (!email.includes('@')) return setError('Introdueix un correu vàlid primer');
    await resetPassword(email.trim());
    setResetModalVisible(true);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </Pressable>
      <Text style={styles.heading}>Iniciar sessió</Text>
      <View style={styles.card}>
        <TextInput placeholder="Correu electrònic" placeholderTextColor="#a0aea7" style={styles.input} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <TextInput placeholder="Contrasenya" placeholderTextColor="#a0aea7" secureTextEntry style={styles.input} onChangeText={setPassword} />
        {!!error && <Text style={styles.error}>{error}</Text>}
        <Pressable onPress={onReset}>
          <Text style={styles.link}>Has oblidat la contrasenya?</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={submit}>
          <Text style={styles.btnText}>Accedir</Text>
        </Pressable>
      </View>

      <Modal visible={resetModalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Ionicons name="mail-outline" size={40} color={colors.success} />
            <Text style={styles.modalTitle}>Correu enviat</Text>
            <Text style={styles.modalText}>S'ha enviat un enllaç de recuperació a {email}</Text>
            <Pressable style={styles.btn} onPress={() => setResetModalVisible(false)}>
              <Text style={styles.btnText}>D'acord</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 16 },
  backBtn: { padding: 4, marginBottom: 16, alignSelf: 'flex-start' },
  heading: { color: colors.text, fontSize: 26, fontWeight: '800', marginBottom: 24 },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 16, gap: 10 },
  input: { backgroundColor: '#dce9de', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, color: '#000' },
  link: { color: '#74a9ff', textDecorationLine: 'underline', fontSize: 13 },
  btn: { backgroundColor: colors.accent, borderRadius: 10, paddingVertical: 13, alignItems: 'center', marginTop: 4 },
  btnText: { color: colors.text, fontWeight: '700' },
  error: { color: colors.danger, fontWeight: '600', fontSize: 13 },
  modalBackdrop: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000090' },
  modalContent: { width: '80%', backgroundColor: colors.card, borderRadius: 20, padding: 24, alignItems: 'center', gap: 12 },
  modalTitle: { color: colors.text, fontSize: 20, fontWeight: '700' },
  modalText: { color: colors.muted, textAlign: 'center', lineHeight: 20 },
});

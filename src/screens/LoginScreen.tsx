import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { loginWithEmail, resetPassword } from '../services/firebaseService';
import { colors } from '../theme/colors';

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async () => {
    try {
      setError('');
      await loginWithEmail(email.trim(), password);
    } catch {
      setError('El correu o la contrasenya són incorrectes');
    }
  };

  const onReset = async () => {
    if (!email.includes('@')) {
      setError('Format de correu incorrecte');
      return;
    }
    await resetPassword(email.trim());
    Alert.alert('Correu enviat', 'S\'ha enviat un enllaç de recuperació.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TextInput placeholder="Correu electrònic" placeholderTextColor="#a0aea7" style={styles.input} onChangeText={setEmail} />
        <TextInput placeholder="Contrasenya" placeholderTextColor="#a0aea7" secureTextEntry style={styles.input} onChangeText={setPassword} />
        {!!error && <Text style={styles.error}>{error}</Text>}
        <Pressable onPress={onReset}>
          <Text style={styles.link}>Has oblidat la contrasenya?</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={submit}>
          <Text style={styles.btnText}>Accedir</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', padding: 16 },
  card: { backgroundColor: colors.card, borderRadius: 12, padding: 14, gap: 8 },
  input: { backgroundColor: '#dce9de', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 10 },
  link: { color: colors.muted, textDecorationLine: 'underline' },
  btn: { backgroundColor: colors.cardSoft, borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  btnText: { color: colors.text, fontWeight: '700' },
  error: { color: colors.danger, fontWeight: '600' }
});

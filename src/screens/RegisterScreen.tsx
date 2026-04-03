import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { registerWithEmail } from '../services/firebaseService';
import { colors } from '../theme/colors';

export const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!email.includes('@')) return setError('Format de correu incorrecte');
    if (password !== confirm) return setError('Les contrasenyes no coincideixen');
    if (!acceptTerms) return setError('Has d’acceptar els termes i condicions');

    await registerWithEmail(email.trim(), password, email.split('@')[0]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TextInput placeholder="Correu electrònic" placeholderTextColor="#a0aea7" style={styles.input} onChangeText={setEmail} />
        <TextInput placeholder="Contrasenya" placeholderTextColor="#a0aea7" secureTextEntry style={styles.input} onChangeText={setPassword} />
        <TextInput placeholder="Confirma contrasenya" placeholderTextColor="#a0aea7" secureTextEntry style={styles.input} onChangeText={setConfirm} />
        {!!error && <Text style={styles.error}>{error}</Text>}

        <Pressable onPress={() => setOpenTerms(true)}>
          <Text style={styles.link}>He llegit i accepto els termes i condicions</Text>
        </Pressable>
        <Text style={styles.termsState}>{acceptTerms ? '✔ Termes acceptats' : '✖ Termes pendents'}</Text>

        <Pressable style={styles.btn} onPress={submit}>
          <Text style={styles.btnText}>Registrar-me</Text>
        </Pressable>
      </View>

      <Modal visible={openTerms} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Polítiques de privacitat</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              <Text style={styles.modalText}>
                Aquest és un text de mostra llarg per representar els termes i condicions. Pots substituir-lo pel text real
                de l'assignatura o del projecte. En acceptar, el camp de registre quedarà marcat automàticament.
              </Text>
            </ScrollView>
            <View style={styles.modalBtns}>
              <Pressable style={styles.modalBtnGhost} onPress={() => setOpenTerms(false)}>
                <Text style={styles.btnText}>Denegar</Text>
              </Pressable>
              <Pressable
                style={styles.modalBtn}
                onPress={() => {
                  setAcceptTerms(true);
                  setOpenTerms(false);
                }}
              >
                <Text style={styles.btnText}>Acceptar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', padding: 16 },
  card: { backgroundColor: colors.card, borderRadius: 12, padding: 14, gap: 8 },
  input: { backgroundColor: '#dce9de', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 10 },
  link: { color: '#74a9ff', textDecorationLine: 'underline' },
  termsState: { color: colors.muted },
  btn: { backgroundColor: colors.accent, borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  btnText: { color: colors.text, fontWeight: '700' },
  error: { color: colors.danger, fontWeight: '600' },
  modalBackdrop: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000090' },
  modalContent: { width: '88%', backgroundColor: colors.cardSoft, borderRadius: 16, padding: 16, gap: 12 },
  modalTitle: { color: colors.text, fontSize: 18, fontWeight: '700' },
  modalText: { color: colors.text, lineHeight: 20 },
  modalBtns: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  modalBtn: { backgroundColor: colors.accent, borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10 },
  modalBtnGhost: { backgroundColor: '#2c633f', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10 }
});

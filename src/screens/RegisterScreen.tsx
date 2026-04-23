import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { registerWithEmail } from '../services/firebaseService';
import { colors } from '../theme/colors';

export const RegisterScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email.includes('@')) return setError('Format de correu incorrecte');
    if (password.length < 6) return setError('La contrasenya ha de tenir mínim 6 caràcters');
    if (password !== confirm) return setError('Les contrasenyes no coincideixen');
    if (!acceptTerms) return setError('Has d\'acceptar els termes i condicions');

    setError('');
    setLoading(true);
    try {
      await registerWithEmail(email.trim(), password, email.split('@')[0]);
    } catch (e: any) {
      if (e?.code === 'auth/email-already-in-use') {
        setError('Aquest correu ja està registrat');
      } else {
        setError('Error en el registre. Torna-ho a provar.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </Pressable>

      <Text style={styles.heading}>Registrar-se</Text>

      <View style={styles.card}>
        <TextInput
          placeholder="Correu electrònic"
          placeholderTextColor="#a0aea7"
          style={styles.input}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Contrasenya"
          placeholderTextColor="#a0aea7"
          secureTextEntry
          style={styles.input}
          onChangeText={setPassword}
        />
        <TextInput
          placeholder="Confirma la contrasenya"
          placeholderTextColor="#a0aea7"
          secureTextEntry
          style={styles.input}
          onChangeText={setConfirm}
        />
        {!!error && <Text style={styles.error}>{error}</Text>}

        <Pressable style={styles.termsRow} onPress={() => setOpenTerms(true)}>
          <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
            {acceptTerms && <Ionicons name="checkmark" size={14} color="#fff" />}
          </View>
          <Text style={styles.link}>
            He llegit i accepto els{' '}
            <Text style={styles.linkUnderline}>termes i condicions</Text>
          </Text>
        </Pressable>

        <Pressable style={[styles.btn, loading && { opacity: 0.6 }]} onPress={submit} disabled={loading}>
          <Text style={styles.btnText}>{loading ? 'Registrant...' : 'Registrar-me'}</Text>
        </Pressable>
      </View>

      <Modal visible={openTerms} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Polítiques de privacitat</Text>
            <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator>
              <Text style={styles.modalText}>
                {'Benvingut/da a VideoLlistes. En registrar-te, acceptes les nostres polítiques de privacitat i condicions d\'ús.\n\n' +
                  'Les teves dades personals s\'utilitzen únicament per oferir-te el servei de l\'aplicació i no es compartiran amb tercers sense el teu consentiment.\n\n' +
                  'Tens dret a accedir, modificar i eliminar les teves dades en qualsevol moment des de la configuració del teu compte.\n\n' +
                  'En fer ús de l\'aplicació acceptes el funcionament correcte de l\'app. Pots sol·licitar en qualsevol moment l\'accés, rectificació, modificació o eliminació de les teves dades.\n\n' +
                  'L\'ús de l\'aplicació implica l\'acceptació íntegra d\'aquesta política de privacitat.'}
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
  container: { flex: 1, backgroundColor: colors.bg, padding: 16 },
  backBtn: { padding: 4, marginBottom: 16, alignSelf: 'flex-start' },
  heading: { color: colors.text, fontSize: 26, fontWeight: '800', marginBottom: 24 },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 16, gap: 10 },
  input: {
    backgroundColor: '#dce9de',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: '#000',
  },
  termsRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: colors.success, borderColor: colors.success },
  link: { color: colors.muted, flex: 1, fontSize: 13 },
  linkUnderline: { color: '#74a9ff', textDecorationLine: 'underline' },
  btn: { backgroundColor: colors.accent, borderRadius: 10, paddingVertical: 13, alignItems: 'center', marginTop: 4 },
  btnText: { color: colors.text, fontWeight: '700' },
  error: { color: colors.danger, fontWeight: '600', fontSize: 13 },
  modalBackdrop: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000090' },
  modalContent: {
    width: '88%',
    backgroundColor: colors.cardSoft,
    borderRadius: 20,
    padding: 20,
    gap: 14,
  },
  modalTitle: { color: colors.text, fontSize: 18, fontWeight: '700' },
  modalText: { color: colors.text, lineHeight: 22, fontSize: 13 },
  modalBtns: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  modalBtn: { backgroundColor: colors.accent, borderRadius: 24, paddingHorizontal: 18, paddingVertical: 10 },
  modalBtnGhost: { backgroundColor: '#2c633f', borderRadius: 24, paddingHorizontal: 18, paddingVertical: 10 },
});

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { registerWithEmail } from '../../src/services/firebaseService';
import { colors } from '../../src/theme/colors';

const TERMS = `Termes i Condicions\n\nBenvingut a VideoLlistes. En registrar-te a l'aplicació acceptes els presents termes i condicions.\n\n1. ÚS DE L'APLICACIÓ\nAquesta aplicació és per a ús personal i no comercial. No pots distribuir, modificar ni explotar el contingut sense el consentiment previ.\n\n2. COMPTES D'USUARI\nEts responsable de mantenir la confidencialitat del teu compte i contrasenya. Has de notificar immediatament qualsevol ús no autoritzat.\n\n3. PRIVACITAT\nLes teves dades personals es tractaran d'acord amb la nostra Política de Privacitat. No vendrem ni compartirem les teves dades amb tercers sense el teu consentiment.\n\n4. CONTINGUT\nEl contingut de vídeos és responsabilitat de l'usuari. Queda prohibit publicar contingut il·legal, ofensiu o que vulneri drets de tercers.\n\n5. MODIFICACIONS\nEns reservem el dret de modificar aquests termes en qualsevol moment. Els canvis s'aplicaran amb efecte immediat.\n\n6. RESCISSIÓ\nPodrem suspendre o cancelar el teu compte si s'infringeixen els presents termes.\n\n7. LLEI APLICABLE\nAquests termes es regiran per les lleis vigents a l'Estat Espanyol.\n\nPer a qualsevol consulta posa't en contacte amb nosaltres.`;

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [termsVisible, setTermsVisible] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!email.includes('@')) return setError('Format de correu incorrecte');
    if (password.length < 6) return setError('La contrasenya ha de tenir almenys 6 caràcters');
    if (password !== confirm) return setError('Les contrasenyes no coincideixen');
    if (!accepted) return setError('Has d\'acceptar els termes i condicions');
    try {
      setError('');
      await registerWithEmail(email.trim(), password, email.split('@')[0]);
    } catch (e: any) {
      if (e?.code === 'auth/email-already-in-use') setError('Ja existeix un compte amb aquest correu');
      else setError('No s\'ha pogut crear el compte');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </Pressable>
      <Text style={styles.heading}>Registrar-se</Text>
      <View style={styles.card}>
        <TextInput placeholder="Correu electrònic" placeholderTextColor="#a0aea7" style={styles.input} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <TextInput placeholder="Contrasenya" placeholderTextColor="#a0aea7" secureTextEntry style={styles.input} onChangeText={setPassword} />
        <TextInput placeholder="Confirmar contrasenya" placeholderTextColor="#a0aea7" secureTextEntry style={styles.input} onChangeText={setConfirm} />
        {!!error && <Text style={styles.error}>{error}</Text>}
        <Pressable onPress={() => setTermsVisible(true)}>
          <Text style={styles.link}>Llegir Termes i Condicions</Text>
        </Pressable>
        <Pressable style={styles.checkRow} onPress={() => setAccepted((v) => !v)}>
          <Ionicons name={accepted ? 'checkbox' : 'square-outline'} size={22} color={accepted ? colors.success : colors.muted} />
          <Text style={styles.checkLabel}>Accepto els Termes i Condicions</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={submit}>
          <Text style={styles.btnText}>Crear compte</Text>
        </Pressable>
      </View>

      <Modal visible={termsVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.termsModal}>
            <Text style={styles.modalTitle}>Termes i Condicions</Text>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator>
              <Text style={styles.termsText}>{TERMS}</Text>
            </ScrollView>
            <Pressable style={styles.btn} onPress={() => { setAccepted(true); setTermsVisible(false); }}>
              <Text style={styles.btnText}>Acceptar</Text>
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
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkLabel: { color: colors.text, fontSize: 14 },
  btn: { backgroundColor: colors.accent, borderRadius: 10, paddingVertical: 13, alignItems: 'center', marginTop: 4 },
  btnText: { color: colors.text, fontWeight: '700' },
  error: { color: colors.danger, fontWeight: '600', fontSize: 13 },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: '#00000090' },
  termsModal: { height: '80%', backgroundColor: colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, gap: 14 },
  modalTitle: { color: colors.text, fontSize: 20, fontWeight: '700' },
  termsText: { color: colors.muted, fontSize: 14, lineHeight: 22 },
});

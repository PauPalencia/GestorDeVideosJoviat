import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { FloatingMenu } from '../components/FloatingMenu';
import { logout, updateUserData } from '../services/firebaseService';
import { colors } from '../theme/colors';

export const UserScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDisplayName(user?.displayName ?? '');
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserData(user.uid, { displayName, phone });
      Alert.alert('Guardat', 'Les dades s\'han actualitzat correctament.');
    } catch {
      Alert.alert('Error', 'No s\'han pogut guardar les dades.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: user?.photoURL ?? 'https://i.pravatar.cc/150?img=5' }}
          style={styles.avatar}
        />

        <View style={styles.card}>
          <View style={styles.field}>
            <Text style={styles.label}>Nom d'usuari</Text>
            <View style={styles.inputRow}>
              <TextInput
                value={displayName}
                onChangeText={setDisplayName}
                style={styles.input}
                placeholderTextColor={colors.muted}
                placeholder="El teu nom"
              />
              <Ionicons name="pencil-outline" size={16} color={colors.muted} />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Correu electrònic</Text>
            <View style={styles.inputRow}>
              <TextInput
                value={user?.email ?? ''}
                editable={false}
                style={[styles.input, styles.inputDisabled]}
              />
              <Ionicons name="lock-closed-outline" size={16} color={colors.muted} />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Contacte</Text>
            <View style={styles.inputRow}>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
                placeholderTextColor={colors.muted}
                placeholder="+34 123 45 67 89"
                keyboardType="phone-pad"
              />
              <Ionicons name="pencil-outline" size={16} color={colors.muted} />
            </View>
          </View>

          <Pressable style={styles.saveBtn} onPress={handleSave} disabled={saving}>
            <Text style={styles.saveBtnText}>{saving ? 'Guardant...' : 'Guardar canvis'}</Text>
          </Pressable>

          <Pressable style={styles.logout} onPress={logout}>
            <Ionicons name="log-out-outline" size={18} color={colors.text} />
            <Text style={styles.logoutText}>Tanca sessió</Text>
          </Pressable>
        </View>
      </ScrollView>

      <FloatingMenu
        onHome={() => navigation.navigate('Inici')}
        onUser={() => navigation.navigate('Usuari')}
        onLists={() => navigation.navigate('Llistes')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 16, paddingBottom: 80, alignItems: 'center', gap: 16 },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: colors.success,
  },
  card: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  field: { gap: 4 },
  label: { color: colors.muted, fontSize: 12, fontWeight: '600' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dce9de',
    borderRadius: 10,
    paddingHorizontal: 12,
    gap: 6,
  },
  input: { flex: 1, color: '#000', paddingVertical: 10 },
  inputDisabled: { color: '#666' },
  saveBtn: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  saveBtnText: { color: colors.text, fontWeight: '700' },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.cardSoft,
    borderRadius: 12,
    paddingVertical: 12,
  },
  logoutText: { color: colors.text, fontWeight: '700' },
});

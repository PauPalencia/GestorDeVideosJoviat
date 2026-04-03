import React from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { FloatingMenu } from '../components/FloatingMenu';
import { logout } from '../services/firebaseService';
import { colors } from '../theme/colors';

export const UserScreen = ({ navigation }: any) => {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={{ uri: 'https://i.pravatar.cc/150?img=5' }} style={styles.avatar} />

        <Text style={styles.label}>Nom d'usuari</Text>
        <TextInput value={user?.displayName || ''} editable={false} style={styles.input} />

        <Text style={styles.label}>Correu electrònic</Text>
        <TextInput value={user?.email || ''} editable={false} style={styles.input} />

        <Text style={styles.label}>Contacte</Text>
        <TextInput value={user?.phoneNumber || '+34 123 45 67 89'} editable={false} style={styles.input} />

        <Pressable style={styles.logout} onPress={logout}>
          <Text style={styles.logoutText}>Tanca sessió</Text>
        </Pressable>
      </View>

      <FloatingMenu
        onHome={() => navigation.navigate('Inici')}
        onUser={() => navigation.navigate('Usuari')}
        onLists={() => navigation.navigate('Llistes')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 14 },
  content: { backgroundColor: colors.card, borderRadius: 12, padding: 14, marginTop: 40 },
  avatar: { width: 110, height: 110, borderRadius: 55, alignSelf: 'center', marginBottom: 14 },
  label: { color: colors.muted, marginBottom: 4 },
  input: { backgroundColor: '#dce9de', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 10, marginBottom: 10 },
  logout: { marginTop: 10, backgroundColor: colors.cardSoft, borderRadius: 10, alignItems: 'center', paddingVertical: 12 },
  logoutText: { color: colors.text, fontWeight: '700' }
});

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export const AuthLandingScreen = ({ navigation }: any) => (
  <View style={styles.container}>
    <Pressable style={styles.btn} onPress={() => navigation.navigate('Login')}>
      <Text style={styles.text}>Iniciar sessió</Text>
    </Pressable>
    <Pressable style={styles.btn} onPress={() => navigation.navigate('Register')}>
      <Text style={styles.text}>Registrar-se</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', gap: 30 },
  btn: {
    width: 240,
    borderRadius: 30,
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: colors.cardSoft
  },
  text: { color: colors.text, fontSize: 17, fontWeight: '600' }
});

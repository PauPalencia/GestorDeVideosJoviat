import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { FloatingMenu } from '../components/FloatingMenu';
import { NowPlayingBar } from '../components/NowPlayingBar';
import { colors } from '../theme/colors';
import { VideoList } from '../types/models';
import { createList, fetchLists, toggleFavoriteList } from '../services/firebaseService';
import { useAuth } from '../context/AuthContext';

export const ListsScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [lists, setLists] = useState<VideoList[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const data = await fetchLists(user.uid);
      setLists(data as VideoList[]);
    };
    load();
  }, [user]);

  const filtered = useMemo(
    () => lists.filter((l) => l.title.toLowerCase().includes(query.toLowerCase())),
    [lists, query]
  );

  const addList = async () => {
    if (!user) return;
    const created: VideoList = {
      id: `${Date.now()}`,
      title: `Nova llista ${lists.length + 1}`,
      description: 'Descripció de mostra',
      createdAt: Date.now(),
      isFavorite: false,
      ownerUid: user.uid,
      videoIds: []
    };
    setLists((p) => [created, ...p]);
    await createList(created);
  };

  const toggleFavorite = async (list: VideoList) => {
    setLists((p) => p.map((l) => (l.id === list.id ? { ...l, isFavorite: !l.isFavorite } : l)));
    await toggleFavoriteList(list.id, !list.isFavorite);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>"{user?.displayName || 'NomUsuariActual'}"</Text>
        <View style={styles.searchWrap}>
          <TextInput value={query} onChangeText={setQuery} placeholder="Buscar una lista" style={styles.search} />
          <Pressable onPress={() => setQuery('')}>
            <Text style={styles.clear}>x</Text>
          </Pressable>
        </View>

        <Pressable style={styles.addBtn} onPress={addList}>
          <Text style={{ color: colors.text, fontWeight: '700' }}>Crear nova llista</Text>
        </Pressable>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 10, paddingBottom: 140 }}
          ListEmptyComponent={<Text style={styles.empty}>Sin listas encontradas...</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cover} />
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDesc}>{item.description}</Text>
                <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
              </View>
              <Pressable onPress={() => toggleFavorite(item)}>
                <Text style={{ color: item.isFavorite ? '#ffd24a' : '#ffffff' }}>★</Text>
              </Pressable>
            </View>
          )}
        />
      </View>

      <NowPlayingBar />
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
  content: { flex: 1, padding: 12, gap: 10 },
  title: { color: colors.text, fontSize: 18, fontWeight: '700' },
  searchWrap: {
    backgroundColor: colors.cardSoft,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12
  },
  search: { flex: 1, color: colors.text, paddingVertical: 8 },
  clear: { color: colors.text, fontWeight: '700' },
  addBtn: { backgroundColor: colors.accent, borderRadius: 10, alignItems: 'center', paddingVertical: 10 },
  card: { backgroundColor: colors.card, borderRadius: 10, flexDirection: 'row', gap: 10, padding: 8, alignItems: 'center' },
  cover: { width: 52, height: 52, borderRadius: 8, backgroundColor: '#d6d6d6' },
  cardTitle: { color: colors.text, fontWeight: '700' },
  cardDesc: { color: colors.muted, fontSize: 12 },
  date: { color: '#8fc18e', fontSize: 11, marginTop: 4 },
  empty: { color: colors.text }
});

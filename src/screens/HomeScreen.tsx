import React, { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { FloatingMenu } from '../components/FloatingMenu';
import { NowPlayingBar } from '../components/NowPlayingBar';
import { VideoCard } from '../components/VideoCard';
import { VideoPlayer } from '../components/VideoPlayer';
import { colors } from '../theme/colors';
import { detectSource } from '../utils/video';
import { Video } from '../types/models';
import { createVideo } from '../services/firebaseService';
import { useAuth } from '../context/AuthContext';

const seed: Video[] = [];

export const HomeScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [currentVideo, setCurrentVideo] = useState<Video | undefined>(seed[0]);
  const [videos, setVideos] = useState<Video[]>(seed);
  const [editorOpen, setEditorOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');

  const subtitle = useMemo(() => currentVideo?.authorName ?? 'Sense vídeo seleccionat', [currentVideo]);

  const addVideo = async () => {
    if (!user || !url || !title) return;
    const created: Video = {
      id: `${Date.now()}`,
      url,
      title,
      thumbnailUrl: 'https://placehold.co/120x90',
      createdAt: Date.now(),
      source: detectSource(url)
    };
    setVideos((p) => [created, ...p]);
    setCurrentVideo(created);
    setEditorOpen(false);

    await createVideo({ ...created, ownerUid: user.uid, listIds: ['favorites'] });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <VideoPlayer url={currentVideo?.url} />
        <Text style={styles.title}>{currentVideo?.title ?? 'Selecciona un vídeo per reproduir-lo'}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <Pressable style={styles.editBtn} onPress={() => setEditorOpen(true)}>
          <Text style={styles.btnText}>Editar / Afegir vídeo</Text>
        </Pressable>

        <Text style={styles.section}>Favorits</Text>
        <FlatList
          data={videos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 10, paddingBottom: 140 }}
          ListEmptyComponent={<Text style={styles.empty}>Afegeix un vídeo a la llista o selecciona una existent.</Text>}
          renderItem={({ item }) => <VideoCard video={item} onPress={() => setCurrentVideo(item)} />}
        />
      </View>

      <NowPlayingBar title={currentVideo?.title} author={currentVideo?.authorName} />
      <FloatingMenu
        onHome={() => navigation.navigate('Inici')}
        onUser={() => navigation.navigate('Usuari')}
        onLists={() => navigation.navigate('Llistes')}
      />

      <Modal visible={editorOpen} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Gestor de vídeos</Text>
            <TextInput value={url} onChangeText={setUrl} placeholder="URL de YouTube o Instagram" style={styles.input} />
            <TextInput value={title} onChangeText={setTitle} placeholder="Títol del vídeo" style={styles.input} />
            <Pressable style={styles.editBtn} onPress={addVideo}>
              <Text style={styles.btnText}>Guardar en favorits</Text>
            </Pressable>
            <Pressable onPress={() => setEditorOpen(false)}>
              <Text style={styles.cancel}>Tancar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, padding: 12, gap: 8 },
  title: { color: colors.text, fontSize: 16, fontWeight: '700' },
  subtitle: { color: colors.muted },
  section: { color: colors.text, fontSize: 20, fontWeight: '700', marginTop: 8 },
  empty: { color: colors.text, backgroundColor: colors.card, borderRadius: 12, padding: 12 },
  editBtn: { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  btnText: { color: colors.text, fontWeight: '700' },
  modalBackdrop: { flex: 1, backgroundColor: '#00000080', justifyContent: 'flex-end' },
  modal: { backgroundColor: colors.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, gap: 10 },
  modalTitle: { color: colors.text, fontSize: 18, fontWeight: '700' },
  input: { backgroundColor: '#dce9de', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 10 },
  cancel: { color: colors.muted, textAlign: 'center', marginTop: 8 }
});

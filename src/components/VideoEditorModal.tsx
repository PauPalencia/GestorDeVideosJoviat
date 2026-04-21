import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { VideoList } from '../types/models';
import { detectSource, extractThumbnail } from '../utils/video';
import { createVideo } from '../services/firebaseService';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';

type Props = {
  visible: boolean;
  onClose: () => void;
  onVideoCreated: () => void;
};

export const VideoEditorModal: React.FC<Props> = ({ visible, onClose, onVideoCreated }) => {
  const { user } = useAuth();
  const { allLists } = usePlayer();
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedListIds, setSelectedListIds] = useState<string[]>(['favorites']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleList = (id: string) => {
    setSelectedListIds((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!user) return;
    if (!url.trim()) return setError('Has d\'introduir una URL');
    if (!title.trim()) return setError('Has d\'introduir un títol');
    if (selectedListIds.length === 0) return setError('Selecciona almenys una llista');

    setError('');
    setLoading(true);
    try {
      const thumbnailUrl = extractThumbnail(url.trim());
      await createVideo(user.uid, {
        url: url.trim(),
        title: title.trim(),
        description: description.trim(),
        thumbnailUrl,
        source: detectSource(url.trim()),
        listIds: selectedListIds,
      });
      setUrl('');
      setTitle('');
      setDescription('');
      setSelectedListIds(['favorites']);
      onVideoCreated();
      onClose();
    } catch (e) {
      setError('Error en desar el vídeo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Afegir vídeo</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            <TextInput
              value={url}
              onChangeText={setUrl}
              placeholder="URL de YouTube o Instagram"
              placeholderTextColor={colors.muted}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="url"
            />
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Títol del vídeo"
              placeholderTextColor={colors.muted}
              style={styles.input}
            />
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Descripció (opcional)"
              placeholderTextColor={colors.muted}
              style={styles.input}
            />

            {!!error && <Text style={styles.error}>{error}</Text>}

            <Text style={styles.sectionLabel}>Afegir a les llistes:</Text>

            <Pressable
              style={[styles.listRow, selectedListIds.includes('favorites') && styles.listRowSelected]}
              onPress={() => toggleList('favorites')}
            >
              <Ionicons
                name={selectedListIds.includes('favorites') ? 'checkbox' : 'square-outline'}
                size={20}
                color={colors.success}
              />
              <Text style={styles.listName}>⭐ Favorits</Text>
            </Pressable>

            {allLists.map((list: VideoList) => (
              <Pressable
                key={list.id}
                style={[styles.listRow, selectedListIds.includes(list.id) && styles.listRowSelected]}
                onPress={() => toggleList(list.id)}
              >
                <Ionicons
                  name={selectedListIds.includes(list.id) ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={colors.success}
                />
                <Text style={styles.listName}>{list.title}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <Pressable style={styles.saveBtn} onPress={handleSave} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <Text style={styles.saveBtnText}>Desar vídeo</Text>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: '#00000090', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    maxHeight: '85%',
    gap: 12,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: colors.text, fontSize: 18, fontWeight: '700' },
  input: {
    backgroundColor: '#dce9de',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#000',
  },
  sectionLabel: { color: colors.muted, fontWeight: '600' },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.cardSoft,
  },
  listRowSelected: { backgroundColor: '#1e6b35' },
  listName: { color: colors.text, flex: 1 },
  saveBtn: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  saveBtnText: { color: colors.text, fontWeight: '700', fontSize: 16 },
  error: { color: colors.danger, fontWeight: '600' },
});

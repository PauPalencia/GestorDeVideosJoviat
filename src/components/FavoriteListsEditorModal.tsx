import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { VideoList } from '../types/models';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import {
  addMemberToList,
  createList,
  fetchListById,
  getVideoById,
  toggleFavoriteList,
} from '../services/firebaseService';

type View = 'main' | 'addById' | 'createList';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const FavoriteListsEditorModal: React.FC<Props> = ({ visible, onClose }) => {
  const { user } = useAuth();
  const { allLists, setAllLists, refreshLists } = usePlayer();
  const [currentView, setCurrentView] = useState<View>('main');

  const [addByIdInput, setAddByIdInput] = useState('');
  const [addByIdError, setAddByIdError] = useState('');
  const [addByIdLoading, setAddByIdLoading] = useState(false);

  const [newListTitle, setNewListTitle] = useState('');
  const [newListVideoIds, setNewListVideoIds] = useState<string[]>([]);
  const [newVideoIdInput, setNewVideoIdInput] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  const favoriteLists = allLists.filter((l) => l.isFavorite);

  const handleToggleFavorite = async (list: VideoList) => {
    const next = !list.isFavorite;
    setAllLists((prev) => prev.map((l) => (l.id === list.id ? { ...l, isFavorite: next } : l)));
    await toggleFavoriteList(list.id, next);
  };

  const handleAddById = async () => {
    if (!user || !addByIdInput.trim()) return;
    setAddByIdError('');
    setAddByIdLoading(true);
    try {
      const found = await fetchListById(addByIdInput.trim());
      if (!found) {
        setAddByIdError('No s\'ha trobat cap llista amb aquest ID');
        return;
      }
      await addMemberToList(found.id, user.uid);
      await refreshLists();
      setAddByIdInput('');
      setCurrentView('main');
    } catch {
      setAddByIdError('Error en afegir la llista');
    } finally {
      setAddByIdLoading(false);
    }
  };

  const handleAddVideoToNewList = async () => {
    if (!newVideoIdInput.trim()) return;
    const vid = await getVideoById(newVideoIdInput.trim());
    if (vid && !newListVideoIds.includes(vid.id)) {
      setNewListVideoIds((prev) => [...prev, vid.id]);
    }
    setNewVideoIdInput('');
  };

  const handleCreateList = async () => {
    if (!user || !newListTitle.trim()) {
      setCreateError('Has d\'introduir un nom per a la llista');
      return;
    }
    setCreateLoading(true);
    setCreateError('');
    try {
      await createList(user.uid, newListTitle.trim(), '', newListVideoIds);
      await refreshLists();
      setNewListTitle('');
      setNewListVideoIds([]);
      setCurrentView('main');
    } catch {
      setCreateError('Error en crear la llista');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentView('main');
    setAddByIdInput('');
    setAddByIdError('');
    setNewListTitle('');
    setNewListVideoIds([]);
    setCreateError('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          {currentView === 'main' && (
            <>
              <View style={styles.topActions}>
                <Pressable style={styles.actionBtn} onPress={() => setCurrentView('addById')}>
                  <Ionicons name="link" size={16} color={colors.text} />
                  <Text style={styles.actionBtnText}>Afegir per ID</Text>
                </Pressable>
                <Pressable style={[styles.actionBtn, { backgroundColor: colors.success }]} onPress={() => setCurrentView('createList')}>
                  <Ionicons name="add" size={16} color="#000" />
                  <Text style={[styles.actionBtnText, { color: '#000' }]}>Crear llista</Text>
                </Pressable>
                <Pressable onPress={handleClose}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </Pressable>
              </View>

              <Text style={styles.sectionTitle}>Les meves llistes favorites</Text>

              <FlatList
                data={allLists}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ gap: 8 }}
                ListEmptyComponent={
                  <Text style={styles.empty}>No tens cap llista. Crea'n una o afegeix per ID.</Text>
                }
                renderItem={({ item }) => (
                  <View style={styles.listRow}>
                    <View style={styles.listCover} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.listTitle}>{item.title}</Text>
                      <Text style={styles.listSub} numberOfLines={1}>
                        {item.videoIds?.length
                          ? `${item.videoIds.length} vídeo${item.videoIds.length !== 1 ? 's' : ''}`
                          : 'Sense vídeos'}
                      </Text>
                    </View>
                    <Pressable onPress={() => handleToggleFavorite(item)}>
                      <Ionicons
                        name={item.isFavorite ? 'star' : 'star-outline'}
                        size={22}
                        color={item.isFavorite ? '#ffd24a' : colors.muted}
                      />
                    </Pressable>
                  </View>
                )}
              />
            </>
          )}

          {currentView === 'addById' && (
            <>
              <View style={styles.backRow}>
                <Pressable onPress={() => setCurrentView('main')} style={styles.backBtn}>
                  <Ionicons name="arrow-back" size={20} color={colors.text} />
                </Pressable>
                <Text style={styles.sectionTitle}>Afegir llista per ID</Text>
              </View>

              <TextInput
                value={addByIdInput}
                onChangeText={setAddByIdInput}
                placeholder="ID de la llista..."
                placeholderTextColor={colors.muted}
                style={styles.input}
                autoCapitalize="none"
              />
              {!!addByIdError && <Text style={styles.error}>{addByIdError}</Text>}

              <Pressable style={styles.saveBtn} onPress={handleAddById} disabled={addByIdLoading}>
                {addByIdLoading ? (
                  <ActivityIndicator color={colors.text} />
                ) : (
                  <Text style={styles.saveBtnText}>Afegir llista</Text>
                )}
              </Pressable>
            </>
          )}

          {currentView === 'createList' && (
            <>
              <View style={styles.createHeader}>
                <Pressable onPress={() => setCurrentView('main')} style={styles.backBtn}>
                  <Ionicons name="arrow-back" size={20} color={colors.text} />
                </Pressable>
                <TextInput
                  value={newListTitle}
                  onChangeText={setNewListTitle}
                  placeholder="Nom de la llista"
                  placeholderTextColor={colors.muted}
                  style={[styles.input, { flex: 1, marginHorizontal: 8 }]}
                />
                <Pressable onPress={handleCreateList} disabled={createLoading}>
                  {createLoading ? (
                    <ActivityIndicator color={colors.success} />
                  ) : (
                    <Ionicons name="checkmark-circle" size={28} color={colors.success} />
                  )}
                </Pressable>
              </View>

              {!!createError && <Text style={styles.error}>{createError}</Text>}

              <Text style={styles.sectionTitle}>Vídeos a la nova llista ({newListVideoIds.length})</Text>

              <FlatList
                data={newListVideoIds}
                keyExtractor={(item) => item}
                style={{ maxHeight: 160 }}
                contentContainerStyle={{ gap: 6 }}
                ListEmptyComponent={
                  <Text style={styles.empty}>Afegeix vídeos per ID a continuació.</Text>
                }
                renderItem={({ item, index }) => (
                  <View style={styles.videoIdRow}>
                    <Text style={styles.videoIdText} numberOfLines={1}>{item}</Text>
                    <Pressable
                      onPress={() => setNewListVideoIds((prev) => prev.filter((_, i) => i !== index))}
                    >
                      <Ionicons name="close-circle" size={18} color={colors.danger} />
                    </Pressable>
                  </View>
                )}
              />

              <View style={styles.addVideoRow}>
                <TextInput
                  value={newVideoIdInput}
                  onChangeText={setNewVideoIdInput}
                  placeholder="ID del vídeo..."
                  placeholderTextColor={colors.muted}
                  style={[styles.input, { flex: 1 }]}
                  autoCapitalize="none"
                />
                <Pressable style={styles.addVideoBtn} onPress={handleAddVideoToNewList}>
                  <Ionicons name="add" size={20} color="#000" />
                </Pressable>
              </View>
            </>
          )}
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
    maxHeight: '80%',
    gap: 10,
  },
  topActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.cardSoft,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  actionBtnText: { color: colors.text, fontSize: 13, fontWeight: '600' },
  sectionTitle: { color: colors.text, fontWeight: '700', fontSize: 15, flex: 1 },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.cardSoft,
    borderRadius: 12,
    padding: 10,
  },
  listCover: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#5a7a5a' },
  listTitle: { color: colors.text, fontWeight: '600' },
  listSub: { color: colors.muted, fontSize: 12, marginTop: 2 },
  empty: { color: colors.muted, textAlign: 'center', padding: 16 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backBtn: { padding: 4 },
  input: {
    backgroundColor: '#dce9de',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#000',
  },
  saveBtn: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  saveBtnText: { color: colors.text, fontWeight: '700' },
  error: { color: colors.danger, fontWeight: '600' },
  createHeader: { flexDirection: 'row', alignItems: 'center' },
  videoIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardSoft,
    borderRadius: 8,
    padding: 8,
    gap: 8,
  },
  videoIdText: { color: colors.text, flex: 1, fontSize: 12 },
  addVideoRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  addVideoBtn: {
    backgroundColor: colors.success,
    borderRadius: 10,
    padding: 10,
  },
});

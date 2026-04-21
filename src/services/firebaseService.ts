import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User
} from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { Video, VideoList } from '../types/models';

export const registerWithEmail = async (email: string, password: string, displayName: string) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });
  await setDoc(doc(db, 'users', cred.user.uid), {
    uid: cred.user.uid,
    email,
    displayName,
    phone: '',
    createdAt: serverTimestamp()
  });
  return cred.user;
};

export const loginWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const logout = () => signOut(auth);

export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

export const updateUserData = async (uid: string, data: { displayName?: string; phone?: string }) => {
  await updateDoc(doc(db, 'users', uid), data);
  if (data.displayName && auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName: data.displayName });
  }
};

export const fetchLists = async (uid: string) => {
  const q = query(
    collection(db, 'lists'),
    where('memberUids', 'array-contains', uid),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<VideoList, 'id'>) }));
};

export const fetchListById = async (listId: string): Promise<VideoList | null> => {
  const snap = await getDoc(doc(db, 'lists', listId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<VideoList, 'id'>) };
};

export const fetchVideosByList = async (listId: string) => {
  const q = query(
    collection(db, 'videos'),
    where('listIds', 'array-contains', listId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Video, 'id'>) }));
};

export const fetchFavoriteVideos = async (uid: string) => {
  const q = query(
    collection(db, 'videos'),
    where('ownerUid', '==', uid),
    where('listIds', 'array-contains', 'favorites'),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Video, 'id'>) }));
};

export const getVideoById = async (videoId: string): Promise<Video | null> => {
  const snap = await getDoc(doc(db, 'videos', videoId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Video, 'id'>) };
};

export const createList = async (uid: string, title: string, description = '', videoIds: string[] = []) => {
  const ref = await addDoc(collection(db, 'lists'), {
    title,
    description,
    videoIds,
    ownerUid: uid,
    memberUids: [uid],
    isFavorite: false,
    coverUrl: '',
    createdAt: serverTimestamp()
  });
  return ref.id;
};

export const addMemberToList = async (listId: string, uid: string) => {
  return updateDoc(doc(db, 'lists', listId), { memberUids: arrayUnion(uid) });
};

export const toggleFavoriteList = async (listId: string, isFavorite: boolean) => {
  return updateDoc(doc(db, 'lists', listId), { isFavorite });
};

export const addVideoIdToList = async (listId: string, videoId: string) => {
  return updateDoc(doc(db, 'lists', listId), { videoIds: arrayUnion(videoId) });
};

export const removeVideoIdFromList = async (listId: string, videoId: string) => {
  return updateDoc(doc(db, 'lists', listId), { videoIds: arrayRemove(videoId) });
};

export const createVideo = async (
  uid: string,
  data: { url: string; title: string; description?: string; thumbnailUrl: string; source: string; listIds: string[] }
) => {
  const ref = await addDoc(collection(db, 'videos'), {
    ...data,
    ownerUid: uid,
    authorName: '',
    authorAvatarUrl: '',
    duration: '',
    createdAt: serverTimestamp()
  });
  for (const listId of data.listIds) {
    if (listId !== 'favorites') {
      await addVideoIdToList(listId, ref.id);
    }
  }
  return ref.id;
};

export const updateVideoLists = async (videoId: string, listIds: string[]) => {
  return updateDoc(doc(db, 'videos', videoId), { listIds });
};

export const currentFirebaseUser = (): User | null => auth.currentUser;

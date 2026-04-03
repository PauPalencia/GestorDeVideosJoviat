import {
  addDoc,
  collection,
  doc,
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

export const fetchLists = async (uid: string) => {
  const q = query(collection(db, 'lists'), where('memberUids', 'array-contains', uid), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<VideoList, 'id'>) }));
};

export const fetchVideosByList = async (listId: string) => {
  const q = query(collection(db, 'videos'), where('listIds', 'array-contains', listId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Video, 'id'>) }));
};

export const createList = async (list: Omit<VideoList, 'id' | 'createdAt'>) => {
  return addDoc(collection(db, 'lists'), {
    ...list,
    memberUids: [list.ownerUid],
    createdAt: serverTimestamp()
  });
};

export const toggleFavoriteList = async (listId: string, isFavorite: boolean) => {
  return updateDoc(doc(db, 'lists', listId), { isFavorite });
};

export const createVideo = async (video: Omit<Video, 'id' | 'createdAt'> & { listIds: string[]; ownerUid: string }) => {
  return addDoc(collection(db, 'videos'), {
    ...video,
    createdAt: serverTimestamp()
  });
};

export const currentFirebaseUser = (): User | null => auth.currentUser;

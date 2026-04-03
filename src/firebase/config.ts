import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'PUT_YOUR_API_KEY',
  authDomain: 'PUT_YOUR_AUTH_DOMAIN',
  projectId: 'PUT_YOUR_PROJECT_ID',
  storageBucket: 'PUT_YOUR_STORAGE_BUCKET',
  messagingSenderId: 'PUT_YOUR_MESSAGING_SENDER_ID',
  appId: 'PUT_YOUR_APP_ID'
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

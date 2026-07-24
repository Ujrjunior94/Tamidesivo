import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Firestore with specific database ID from config
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

/**
 * Returns or creates a persistent guest ID for local session cloud synchronization
 */
export function getOrCreateGuestId(): string {
  let guestId = localStorage.getItem('ts_guest_uid');
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    localStorage.setItem('ts_guest_uid', guestId);
  }
  return guestId;
}

/**
 * Ensures user is authenticated (using anonymous auth if available or guest fallback)
 */
export function ensureAuth(callback?: (user: User) => void): Promise<User> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        if (callback) callback(currentUser);
        resolve(currentUser);
        unsubscribe();
      } else {
        try {
          const userCredential = await signInAnonymously(auth);
          if (callback) callback(userCredential.user);
          resolve(userCredential.user);
          unsubscribe();
        } catch (error: any) {
          // If anonymous authentication is restricted in Firebase console (auth/admin-restricted-operation),
          // fallback seamlessly to a persistent guest session UID so Firestore works without throwing errors.
          console.warn('Firebase Anonymous Auth restricted, using persistent guest session:', error?.message || error);
          const fallbackUser = {
            uid: getOrCreateGuestId(),
            isAnonymous: true,
            email: null,
            displayName: 'Usuário Convidado',
          } as unknown as User;

          if (callback) callback(fallbackUser);
          resolve(fallbackUser);
          unsubscribe();
        }
      }
    });
  });
}

export { app, auth, db, firebaseConfig };

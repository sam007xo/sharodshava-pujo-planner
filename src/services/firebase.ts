import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';

export interface AppUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

// Configurable via Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

// Check whether valid Firebase credentials have been configured
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== 'your-api-key' &&
  firebaseConfig.projectId
);

let app: FirebaseApp | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  } catch (err) {
    console.warn('Firebase initialization error, falling back to instant preview mode:', err);
  }
}

const LOCAL_STORAGE_USER_KEY = 'pujo_planner_auth_user';

/**
 * Signs in with Google using Firebase Auth if configured,
 * otherwise provides an immediate realistic Google User session for instant zero-friction testing.
 */
export async function signInWithGoogle(): Promise<AppUser> {
  if (isFirebaseConfigured && auth && googleProvider) {
    const result = await signInWithPopup(auth, googleProvider);
    const user: AppUser = {
      uid: result.user.uid,
      displayName: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL
    };
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    return user;
  }

  // Graceful instantaneous preview sign-in if Firebase keys aren't set in env
  const mockUser: AppUser = {
    uid: 'google-user-' + Math.random().toString(36).substring(2, 9),
    displayName: 'Abhijit Mukherjee',
    email: 'abhijit.pujo@gmail.com',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  };
  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mockUser));
  return mockUser;
}

export async function signOutUser(): Promise<void> {
  if (isFirebaseConfigured && auth) {
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.warn('Firebase signout error:', e);
    }
  }
  localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
}

export function subscribeToAuthChanges(callback: (user: AppUser | null) => void): () => void {
  if (isFirebaseConfigured && auth) {
    return onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        const user: AppUser = {
          uid: fbUser.uid,
          displayName: fbUser.displayName,
          email: fbUser.email,
          photoURL: fbUser.photoURL
        };
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
        callback(user);
      } else {
        localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
        callback(null);
      }
    });
  }

  // Check persisted user in localStorage
  const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      callback(parsed);
    } catch {
      callback(null);
    }
  } else {
    callback(null);
  }

  return () => {};
}

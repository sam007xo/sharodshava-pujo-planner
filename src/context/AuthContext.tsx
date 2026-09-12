import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  type GoogleUser, 
  getSavedUser, 
  signOutGcp, 
  signInMockUser, 
  signInWithGcpOAuthPopup,
  getGcpClientId,
  setGcpClientId as saveGcpClientId,
  isGcpConfigured as checkGcpConfigured
} from '../services/gcpAuth';
import { 
  signInWithGoogle as signInWithFirebase, 
  signOutUser as signOutFirebase, 
  isFirebaseConfigured 
} from '../services/firebase';

export interface AppUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  authSource?: 'gcp' | 'firebase' | 'preview';
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: () => Promise<void>;
  loginWithGcpOAuth: (customClientId?: string) => Promise<void>;
  loginAsGuest: (customName?: string) => void;
  setUserFromGcp: (gcpUser: GoogleUser) => void;
  logout: () => Promise<void>;
  isFirebaseConfigured: boolean;
  isGcpConfigured: boolean;
  gcpClientId: string;
  setGcpClientId: (clientId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [gcpClientId, setGcpClientIdState] = useState<string>(getGcpClientId());
  const [isGcpConfigured, setIsGcpConfigured] = useState<boolean>(checkGcpConfigured());

  // Check saved session on mount
  useEffect(() => {
    const saved = getSavedUser();
    if (saved) {
      setUser(saved);
    }
    setLoading(false);
  }, []);

  const updateGcpClientId = useCallback((clientId: string) => {
    saveGcpClientId(clientId);
    setGcpClientIdState(clientId);
    setIsGcpConfigured(checkGcpConfigured());
  }, []);

  const setUserFromGcp = useCallback((gcpUser: GoogleUser) => {
    setUser(gcpUser);
  }, []);

  const loginWithGcpOAuth = useCallback(async (customClientId?: string) => {
    setLoading(true);
    const effectiveClientId = customClientId || gcpClientId;
    try {
      if (effectiveClientId && effectiveClientId.includes('.apps.googleusercontent.com')) {
        const gUser = await signInWithGcpOAuthPopup(effectiveClientId);
        setUser(gUser);
      } else {
        // Fallback to guest / preview
        const guestUser = signInMockUser();
        setUser(guestUser);
      }
    } catch (err) {
      console.error('GCP OAuth error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [gcpClientId]);

  const login = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Try GCP OAuth if configured
      if (isGcpConfigured && gcpClientId) {
        const gUser = await signInWithGcpOAuthPopup(gcpClientId);
        setUser(gUser);
        return;
      }

      // 2. Try Firebase if configured
      if (isFirebaseConfigured) {
        const fbUser = await signInWithFirebase();
        setUser({ ...fbUser, authSource: 'firebase' });
        return;
      }

      // 3. Fallback to instant mock devotee session
      const mockUser = signInMockUser();
      setUser(mockUser);
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isGcpConfigured, gcpClientId]);

  const loginAsGuest = useCallback((customName?: string) => {
    setLoading(true);
    const mockUser = signInMockUser(customName);
    setUser(mockUser);
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      signOutGcp();
      if (isFirebaseConfigured) {
        await signOutFirebase();
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithGcpOAuth,
        loginAsGuest,
        setUserFromGcp,
        logout,
        isFirebaseConfigured,
        isGcpConfigured,
        gcpClientId,
        setGcpClientId: updateGcpClientId
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

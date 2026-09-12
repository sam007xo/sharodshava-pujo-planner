export interface GoogleUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  token?: string;
  authSource: 'gcp' | 'preview';
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: 'standard' | 'icon';
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              logo_alignment?: 'left' | 'center';
              width?: number | string;
              locale?: string;
            }
          ) => void;
          prompt: (momentListener?: (moment: unknown) => void) => void;
          disableAutoSelect: () => void;
          revoke: (hint: string, callback?: () => void) => void;
        };
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (tokenResponse: { access_token?: string; error?: string }) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}

export interface GoogleCredentialResponse {
  credential?: string;
  select_by?: string;
  clientId?: string;
}

const LOCAL_STORAGE_USER_KEY = 'pujo_planner_auth_user';
const GCP_CLIENT_ID_STORAGE_KEY = 'pujo_planner_gcp_client_id';

const DEFAULT_GCP_CLIENT_ID = '123857226981-vhh84h5okpt21t6r14nj75b4pb3d0ln0.apps.googleusercontent.com';

// Default / Env GCP Client ID
export function getGcpClientId(): string {
  const custom = localStorage.getItem(GCP_CLIENT_ID_STORAGE_KEY);
  if (custom && custom.trim()) return custom.trim();
  const envVal = (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();
  return envVal || DEFAULT_GCP_CLIENT_ID;
}

export function setGcpClientId(clientId: string): void {
  if (clientId.trim()) {
    localStorage.setItem(GCP_CLIENT_ID_STORAGE_KEY, clientId.trim());
  } else {
    localStorage.removeItem(GCP_CLIENT_ID_STORAGE_KEY);
  }
}

export function isGcpConfigured(): boolean {
  const id = getGcpClientId();
  return Boolean(id && id !== 'YOUR_GCP_OAUTH_CLIENT_ID' && id.includes('.apps.googleusercontent.com'));
}

/**
 * Decode JWT Token payload from Google Identity Services
 */
export function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('Failed to parse Google JWT payload:', err);
    return null;
  }
}

/**
 * Sign in using Google Identity Services (GCP)
 */
export function processGcpCredential(credential: string): GoogleUser | null {
  const payload = parseJwtPayload(credential);
  if (!payload) return null;

  const user: GoogleUser = {
    uid: (payload.sub as string) || `gcp-user-${Date.now()}`,
    displayName: (payload.name as string) || (payload.given_name as string) || 'Devotee',
    email: (payload.email as string) || null,
    photoURL: (payload.picture as string) || null,
    token: credential,
    authSource: 'gcp'
  };

  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
  return user;
}

/**
 * Sign in using Google OAuth2 Token popup (Alternative GCP Flow)
 */
export async function signInWithGcpOAuthPopup(clientId: string): Promise<GoogleUser> {
  return new Promise((resolve, reject) => {
    if (!window.google?.accounts?.oauth2) {
      reject(new Error('Google Identity Services SDK is not loaded yet. Please check your internet connection.'));
      return;
    }

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'email profile openid',
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            reject(new Error(tokenResponse.error));
            return;
          }
          if (!tokenResponse.access_token) {
            reject(new Error('No access token received from Google.'));
            return;
          }

          try {
            // Fetch User profile from Google UserInfo endpoint
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch user profile from Google.');

            const data = await res.json();
            const user: GoogleUser = {
              uid: data.sub || `gcp-${Date.now()}`,
              displayName: data.name || data.given_name || 'Pujo Visitor',
              email: data.email || null,
              photoURL: data.picture || null,
              authSource: 'gcp'
            };

            localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
            resolve(user);
          } catch (err) {
            reject(err);
          }
        }
      });

      client.requestAccessToken();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Instant Mock / Demo Sign-in
 */
export function signInMockUser(customName?: string): GoogleUser {
  const mockUser: GoogleUser = {
    uid: `google-user-${Math.random().toString(36).substring(2, 9)}`,
    displayName: customName || 'Abhijit Mukherjee',
    email: 'abhijit.pujo@gmail.com',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    authSource: 'preview'
  };
  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mockUser));
  return mockUser;
}

/**
 * Sign out and clear stored session
 */
export function signOutGcp(): void {
  localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  if (window.google?.accounts?.id) {
    try {
      window.google.accounts.id.disableAutoSelect();
    } catch {
      // ignore
    }
  }
}

/**
 * Check persisted user
 */
export function getSavedUser(): GoogleUser | null {
  const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

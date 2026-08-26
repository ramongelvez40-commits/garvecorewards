// User session store — persists the logged-in user's unique ID in localStorage
// This ID is used as ext_user_id for CPX Research and other offer walls

const USER_SESSION_KEY = 'garveco_user_session';

export interface UserSession {
  userId: string;   // unique identifier (e.g. email-based slug or UUID)
  email: string;
  displayName: string;
}

/**
 * Generates a stable, URL-safe user ID from an email address.
 * Example: "miguel.r@garvecoapp.com" → "miguel_r_garvecoapp_com"
 */
export function emailToUserId(email: string): string {
  return email
    .toLowerCase()
    .replace(/[@.]/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

export function saveUserSession(session: UserSession): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
  } catch {
    // ignore storage errors
  }
}

export function getUserSession(): UserSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(USER_SESSION_KEY);
    if (stored) return JSON.parse(stored) as UserSession;
  } catch {
    // ignore parse errors
  }
  return null;
}

export function clearUserSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(USER_SESSION_KEY);
  } catch {
    // ignore
  }
}

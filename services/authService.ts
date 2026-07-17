import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { supabase, isConfigured } from './supabase';

WebBrowser.maybeCompleteAuthSession();

// ─── Google OAuth ────────────────────────────────────────────────────────────
export async function signInWithGoogle(): Promise<{ error?: string }> {
  if (!isConfigured || !supabase) {
    return { error: 'Backend not connected. Please try again.' };
  }
  try {
    const redirectUrl = AuthSession.makeRedirectUri({
      scheme: 'pnoyx',
      path: 'auth',
    });

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: { access_type: 'offline', prompt: 'consent' },
        skipBrowserRedirect: true,
      },
    });

    if (error) return { error: error.message };
    if (!data?.url) return { error: 'No OAuth URL returned from server.' };

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

    if (result.type === 'cancel' || result.type === 'dismiss') {
      return {}; // User cancelled — not an error
    }
    if (result.type !== 'success' || !result.url) {
      return {}; // Dismissed silently
    }

    // Exchange PKCE code for session
    const parsedUrl = new URL(result.url);
    const code = parsedUrl.searchParams.get('code');

    if (code) {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) return { error: exchangeError.message };
    } else {
      // Implicit flow fallback
      const params = new URLSearchParams(parsedUrl.hash.replace('#', ''));
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      if (accessToken) {
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken ?? '',
        });
      }
    }

    // Poll for session confirmation (max 12s)
    for (let i = 0; i < 12; i++) {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) break;
      await new Promise((r) => setTimeout(r, 1000));
    }

    return {};
  } catch (err: any) {
    return { error: err?.message ?? 'Google sign-in failed.' };
  }
}

// ─── Email / Password ────────────────────────────────────────────────────────
export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ error?: string }> {
  if (!isConfigured || !supabase) {
    return { error: 'Backend not connected.' };
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error: error?.message };
}

export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string
): Promise<{ error?: string; needsConfirmation?: boolean }> {
  if (!isConfigured || !supabase) {
    return { error: 'Backend not connected.' };
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, username: email.split('@')[0] },
    },
  });
  if (error) return { error: error.message };
  // If identities is empty the email already exists
  if (data.user && data.user.identities?.length === 0) {
    return { error: 'An account with this email already exists. Please sign in.' };
  }
  // Supabase may require email confirmation
  const needsConfirmation = !data.session;
  return { needsConfirmation };
}

// ─── Sign Out ────────────────────────────────────────────────────────────────
export async function signOut(): Promise<void> {
  if (!isConfigured || !supabase) return;
  await supabase.auth.signOut();
}

// ─── Password Reset ──────────────────────────────────────────────────────────
export async function sendPasswordReset(email: string): Promise<{ error?: string }> {
  if (!isConfigured || !supabase) return { error: 'Backend not connected.' };
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  return { error: error?.message };
}

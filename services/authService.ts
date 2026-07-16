import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { Platform } from 'react-native';
import { supabase, isConfigured } from './supabase';

WebBrowser.maybeCompleteAuthSession();

export async function signInWithGoogle(): Promise<{ error?: string }> {
  if (!isConfigured) {
    return { error: 'Supabase not connected. Please connect your project in OnSpace settings.' };
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
    if (!data?.url) return { error: 'No OAuth URL returned.' };

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

    if (result.type !== 'success' || !result.url) {
      return {}; // User cancelled or dismissed
    }

    // Extract PKCE code from callback URL
    const parsedUrl = new URL(result.url);
    const code = parsedUrl.searchParams.get('code');

    if (code) {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) return { error: exchangeError.message };
    } else {
      // Fallback: try fragment tokens (implicit flow)
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

    // Poll for session confirmation (max 10s)
    let attempts = 0;
    while (attempts < 10) {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) break;
      await new Promise((r) => setTimeout(r, 1000));
      attempts++;
    }

    return {};
  } catch (err: any) {
    return { error: err?.message ?? 'Google sign-in failed.' };
  }
}

export async function signOut(): Promise<void> {
  if (!isConfigured) return;
  await supabase.auth.signOut();
}

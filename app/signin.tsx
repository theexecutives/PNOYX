import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { signInWithGoogle } from '../services/authService';
import { Colors, BG_IMAGE_URI, Spacing, Radius } from '../constants/theme';

const { width, height } = Dimensions.get('window');

export default function SignInScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleGoogleSignIn() {
    setLoading(true);
    setErrorMsg('');
    const { error } = await signInWithGoogle();
    setLoading(false);
    if (error) {
      setErrorMsg(error);
      if (Platform.OS !== 'web') {
        Alert.alert('Sign-In Failed', error);
      }
    }
    // Navigation handled by AuthContext state change → app/index.tsx redirect
  }

  return (
    <View style={styles.container}>
      {/* Full-screen PNOYX background */}
      <Image
        source={{ uri: BG_IMAGE_URI }}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
        transition={300}
      />

      {/* Dark overlay */}
      <View style={styles.overlay} />

      {/* Content */}
      <View style={[styles.content, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40 }]}>
        {/* Logo */}
        <View style={styles.logoBlock}>
          <Text style={styles.logoText}>
            PNOY<Text style={styles.logoX}>X</Text>
          </Text>
          <Text style={styles.tagline}>CINEMA REDEFINED</Text>
        </View>

        {/* Sign-in card */}
        <View style={styles.card}>
          <Text style={styles.welcomeTitle}>Welcome Back</Text>
          <Text style={styles.welcomeSub}>
            Sign in to continue your cinematic journey
          </Text>

          {/* Google Sign-In Button */}
          <TouchableOpacity
            style={[styles.googleBtn, loading && styles.googleBtnDisabled]}
            onPress={handleGoogleSignIn}
            activeOpacity={0.82}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#1a1a1a" size="small" />
            ) : (
              <>
                {/* Google "G" icon using unicode */}
                <View style={styles.googleIconWrapper}>
                  <Text style={styles.googleIconText}>G</Text>
                </View>
                <Text style={styles.googleBtnText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          {errorMsg ? (
            <Text style={styles.errorText}>{errorMsg}</Text>
          ) : null}

          <Text style={styles.termsText}>
            By continuing you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>© 2026 PNOYX. All rights reserved.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.62)',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  logoBlock: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoText: {
    fontSize: 52,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 4,
  } as any,
  logoX: {
    color: '#FFD700',
    textShadowColor: 'rgba(255,215,0,0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  tagline: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,215,0,0.72)',
    letterSpacing: 8,
    marginTop: 6,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(10,10,10,0.88)',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.22)',
    padding: 28,
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 10,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  welcomeSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  googleBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.full,
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 12,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  googleBtnDisabled: {
    opacity: 0.65,
  },
  googleIconWrapper: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIconText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    includeFontPadding: false,
  } as any,
  googleBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: 0.3,
  },
  errorText: {
    marginTop: 14,
    fontSize: 13,
    color: '#FF4444',
    textAlign: 'center',
  },
  termsText: {
    marginTop: 18,
    fontSize: 11,
    color: 'rgba(255,255,255,0.35)',
    textAlign: 'center',
    lineHeight: 16,
  },
  footerText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 1,
  },
});

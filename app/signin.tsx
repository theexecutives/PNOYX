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
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
} from '../services/authService';
import { Colors, BG_IMAGE_URI, Spacing, Radius } from '../constants/theme';

const { width } = Dimensions.get('window');

type Mode = 'signin' | 'signup';

function showNativeAlert(title: string, message: string) {
  if (Platform.OS !== 'web') Alert.alert(title, message);
}

export default function SignInScreen() {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  function clearMessages() {
    setErrorMsg('');
    setSuccessMsg('');
  }

  // ── Google ────────────────────────────────────────────────────────────────
  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    clearMessages();
    const { error } = await signInWithGoogle();
    setGoogleLoading(false);
    if (error) {
      setErrorMsg(error);
      showNativeAlert('Sign-In Failed', error);
    }
    // On success → AuthContext updates session → app/index.tsx redirects
  }

  // ── Email auth ────────────────────────────────────────────────────────────
  async function handleEmailAuth() {
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter your email and password.');
      return;
    }
    if (mode === 'signup' && !fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    setLoading(true);
    clearMessages();

    if (mode === 'signin') {
      const { error } = await signInWithEmail(email.trim(), password);
      setLoading(false);
      if (error) {
        setErrorMsg(error);
        showNativeAlert('Sign-In Failed', error);
      }
    } else {
      const { error, needsConfirmation } = await signUpWithEmail(
        email.trim(),
        password,
        fullName.trim()
      );
      setLoading(false);
      if (error) {
        setErrorMsg(error);
        showNativeAlert('Sign-Up Failed', error);
      } else if (needsConfirmation) {
        setSuccessMsg('Account created! Check your email to confirm before signing in.');
      }
      // If no confirmation needed, AuthContext will auto-redirect
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        {/* Background */}
        <Image
          source={{ uri: BG_IMAGE_URI }}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
          transition={300}
        />
        <View style={styles.overlay} />

        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 32 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoBlock}>
            <Text style={styles.logoText}>
              PNOY<Text style={styles.logoX}>X</Text>
            </Text>
            <Text style={styles.tagline}>CINEMA REDEFINED</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            {/* Mode toggle */}
            <View style={styles.modeToggle}>
              <TouchableOpacity
                style={[styles.modeBtn, mode === 'signin' && styles.modeBtnActive]}
                onPress={() => { setMode('signin'); clearMessages(); }}
                activeOpacity={0.8}
              >
                <Text style={[styles.modeBtnText, mode === 'signin' && styles.modeBtnTextActive]}>
                  Sign In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeBtn, mode === 'signup' && styles.modeBtnActive]}
                onPress={() => { setMode('signup'); clearMessages(); }}
                activeOpacity={0.8}
              >
                <Text style={[styles.modeBtnText, mode === 'signup' && styles.modeBtnTextActive]}>
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.cardTitle}>
              {mode === 'signin' ? 'Welcome Back' : 'Join PNOYX'}
            </Text>
            <Text style={styles.cardSub}>
              {mode === 'signin'
                ? 'Sign in to continue your cinematic journey'
                : 'Create your account to start watching'}
            </Text>

            {/* Google Sign-In */}
            <TouchableOpacity
              style={[styles.googleBtn, googleLoading && styles.btnDisabled]}
              onPress={handleGoogleSignIn}
              activeOpacity={0.82}
              disabled={googleLoading || loading}
            >
              {googleLoading ? (
                <ActivityIndicator color="#1a1a1a" size="small" />
              ) : (
                <>
                  <View style={styles.googleIconWrapper}>
                    <Text style={styles.googleIconText}>G</Text>
                  </View>
                  <Text style={styles.googleBtnText}>Continue with Google</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Full Name (sign-up only) */}
            {mode === 'signup' && (
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your full name"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>
            )}

            {/* Email */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>

            {/* Password */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder={mode === 'signup' ? 'Min. 6 characters' : 'Your password'}
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleEmailAuth}
              />
            </View>

            {/* Error / success */}
            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
            {successMsg ? <Text style={styles.successText}>{successMsg}</Text> : null}

            {/* Submit */}
            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.btnDisabled]}
              onPress={handleEmailAuth}
              activeOpacity={0.84}
              disabled={loading || googleLoading}
            >
              {loading ? (
                <ActivityIndicator color="#000" size="small" />
              ) : (
                <Text style={styles.submitBtnText}>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                </Text>
              )}
            </TouchableOpacity>

            <Text style={styles.termsText}>
              By continuing you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>

          {/* Footer */}
          <Text style={styles.footerText}>© 2026 PNOYX. All rights reserved.</Text>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.64)' },
  scroll: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoBlock: { alignItems: 'center', marginBottom: 24 },
  logoText: { fontSize: 52, fontWeight: '900', color: '#FFFFFF', letterSpacing: 4 } as any,
  logoX: { color: '#FFD700', textShadowColor: 'rgba(255,215,0,0.8)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 16 },
  tagline: { fontSize: 11, fontWeight: '600', color: 'rgba(255,215,0,0.72)', letterSpacing: 8, marginTop: 6 },
  card: {
    width: '100%',
    backgroundColor: 'rgba(8,8,8,0.92)',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.22)',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    marginBottom: 20,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: Radius.full,
    padding: 3,
    marginBottom: 20,
    width: '100%',
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radius.full,
    alignItems: 'center',
  },
  modeBtnActive: { backgroundColor: '#FFD700' },
  modeBtnText: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.5)' },
  modeBtnTextActive: { color: '#000' },
  cardTitle: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', marginBottom: 6, letterSpacing: 0.3 },
  cardSub: { fontSize: 13, color: 'rgba(255,255,255,0.5)', textAlign: 'center', lineHeight: 18, marginBottom: 22 },
  googleBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.full,
    paddingVertical: 14,
    gap: 10,
    marginBottom: 6,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  btnDisabled: { opacity: 0.58 },
  googleIconWrapper: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIconText: { fontSize: 13, fontWeight: '900', color: '#FFFFFF', includeFontPadding: false } as any,
  googleBtnText: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', letterSpacing: 0.2 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', width: '100%', marginVertical: 14, gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  dividerText: { fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: '500' },
  inputWrapper: { width: '100%', marginBottom: 14 },
  inputLabel: { fontSize: 12, fontWeight: '600', color: 'rgba(255,215,0,0.7)', marginBottom: 6, letterSpacing: 0.5 },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.18)',
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: '#FFFFFF',
  },
  errorText: { marginTop: 4, marginBottom: 8, fontSize: 13, color: '#FF4444', textAlign: 'center' },
  successText: { marginTop: 4, marginBottom: 8, fontSize: 13, color: '#44FF88', textAlign: 'center' },
  submitBtn: {
    width: '100%',
    backgroundColor: '#FFD700',
    borderRadius: Radius.full,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 16,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  submitBtnText: { fontSize: 15, fontWeight: '800', color: '#000', letterSpacing: 0.5 },
  termsText: { fontSize: 11, color: 'rgba(255,255,255,0.3)', textAlign: 'center', lineHeight: 16 },
  footerText: { fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: 1 },
});

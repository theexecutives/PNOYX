import React, { useState, useEffect } from 'react';
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
  sendEmailOTP,
  verifyEmailOTP,
} from '../services/authService';
import { Colors, BG_IMAGE_URI, Spacing, Radius } from '../constants/theme';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

type Mode = 'signin' | 'signup' | 'otp';
type OtpStep = 'send' | 'verify';

function showNativeAlert(title: string, message: string) {
  if (Platform.OS !== 'web') Alert.alert(title, message);
}

export default function SignInScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { session } = useAuth();

  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpStep, setOtpStep] = useState<OtpStep>('send');
  const [otpCountdown, setOtpCountdown] = useState(0);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Redirect when session is established (handles web OAuth redirect return)
  useEffect(() => {
    if (session) router.replace('/(tabs)');
  }, [session]);

  // OTP countdown timer
  useEffect(() => {
    if (otpCountdown <= 0) return;
    const t = setTimeout(() => setOtpCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [otpCountdown]);

  function clearMessages() {
    setErrorMsg('');
    setSuccessMsg('');
  }

  function switchMode(m: Mode) {
    setMode(m);
    setOtpStep('send');
    setOtpCode('');
    clearMessages();
  }

  // ── Google ─────────────────────────────────────────────────────────────────
  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    clearMessages();
    const { error } = await signInWithGoogle();
    setGoogleLoading(false);
    if (error) {
      setErrorMsg(error);
      showNativeAlert('Sign-In Failed', error);
    }
    // Web: page redirects automatically. Native: AuthContext updates → useEffect above fires.
  }

  // ── Email + Password ────────────────────────────────────────────────────────
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
    }
  }

  // ── Email OTP ────────────────────────────────────────────────────────────────
  async function handleSendOTP() {
    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    setLoading(true);
    clearMessages();
    const { error } = await sendEmailOTP(email.trim());
    setLoading(false);
    if (error) {
      setErrorMsg(error);
    } else {
      setOtpStep('verify');
      setOtpCountdown(60);
      setSuccessMsg('A 6-digit code was sent to your email.');
    }
  }

  async function handleVerifyOTP() {
    if (otpCode.trim().length < 6) {
      setErrorMsg('Please enter the full 6-digit code.');
      return;
    }
    setLoading(true);
    clearMessages();
    const { error } = await verifyEmailOTP(email.trim(), otpCode.trim());
    setLoading(false);
    if (error) {
      setErrorMsg(error);
    }
    // On success → AuthContext fires → useEffect above redirects
  }

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
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
            {/* Mode tabs */}
            <View style={styles.modeToggle}>
              {(['signin', 'signup', 'otp'] as Mode[]).map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.modeBtn, mode === m && styles.modeBtnActive]}
                  onPress={() => switchMode(m)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.modeBtnText, mode === m && styles.modeBtnTextActive]}>
                    {m === 'signin' ? 'Sign In' : m === 'signup' ? 'Sign Up' : 'OTP Login'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.cardTitle}>
              {mode === 'signin'
                ? 'Welcome Back'
                : mode === 'signup'
                ? 'Join PNOYX'
                : 'Passwordless Login'}
            </Text>
            <Text style={styles.cardSub}>
              {mode === 'signin'
                ? 'Sign in to continue your cinematic journey'
                : mode === 'signup'
                ? 'Create your account to start watching'
                : 'Receive a one-time code in your inbox'}
            </Text>

            {/* ── Google Sign-In ── */}
            <TouchableOpacity
              style={[styles.googleBtn, (googleLoading || loading) && styles.btnDisabled]}
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

            {/* ── OTP FLOW ── */}
            {mode === 'otp' ? (
              <>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="your@email.com"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={email}
                    onChangeText={(v) => { setEmail(v); clearMessages(); }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={otpStep === 'send'}
                  />
                </View>

                {otpStep === 'verify' && (
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>6-Digit Code</Text>
                    <TextInput
                      style={[styles.input, styles.otpInput]}
                      placeholder="000000"
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      value={otpCode}
                      onChangeText={(v) => { setOtpCode(v.replace(/\D/g, '').slice(0, 6)); clearMessages(); }}
                      keyboardType="number-pad"
                      maxLength={6}
                    />
                    <TouchableOpacity
                      style={[styles.resendBtn, otpCountdown > 0 && styles.resendBtnDisabled]}
                      onPress={() => { setOtpStep('send'); setOtpCode(''); clearMessages(); setOtpCountdown(0); }}
                      disabled={otpCountdown > 0}
                    >
                      <Text style={styles.resendText}>
                        {otpCountdown > 0 ? `Resend in ${otpCountdown}s` : 'Change email / Resend'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
                {successMsg ? <Text style={styles.successText}>{successMsg}</Text> : null}

                <TouchableOpacity
                  style={[styles.submitBtn, loading && styles.btnDisabled]}
                  onPress={otpStep === 'send' ? handleSendOTP : handleVerifyOTP}
                  activeOpacity={0.84}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#000" size="small" />
                  ) : (
                    <Text style={styles.submitBtnText}>
                      {otpStep === 'send' ? 'Send Code' : 'Verify & Sign In'}
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              /* ── EMAIL + PASSWORD FLOW ── */
              <>
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

                {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
                {successMsg ? <Text style={styles.successText}>{successMsg}</Text> : null}

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
              </>
            )}

            <Text style={styles.termsText}>
              By continuing you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>

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
  // 3-tab toggle
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
    paddingVertical: 9,
    borderRadius: Radius.full,
    alignItems: 'center',
  },
  modeBtnActive: { backgroundColor: '#FFD700' },
  modeBtnText: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.5)' },
  modeBtnTextActive: { color: '#000' },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  cardSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 22,
  },
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
  btnDisabled: { opacity: 0.55 },
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
  googleBtnText: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', letterSpacing: 0.2 },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 14,
    gap: 10,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  dividerText: { fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: '500' },
  inputWrapper: { width: '100%', marginBottom: 14 },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,215,0,0.7)',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
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
  otpInput: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 10,
  },
  resendBtn: { alignSelf: 'flex-end', marginTop: 8 },
  resendBtnDisabled: { opacity: 0.4 },
  resendText: { fontSize: 12, color: '#FFD700', fontWeight: '600' },
  errorText: {
    marginTop: 4,
    marginBottom: 8,
    fontSize: 13,
    color: '#FF4444',
    textAlign: 'center',
  },
  successText: {
    marginTop: 4,
    marginBottom: 8,
    fontSize: 13,
    color: '#44FF88',
    textAlign: 'center',
    lineHeight: 18,
  },
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
  termsText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    lineHeight: 16,
  },
  footerText: { fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: 1 },
});

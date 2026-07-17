import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

// ── Film strip dots helper ──────────────────────────────────────────────────
function FilmStrip({ style }: { style?: any }) {
  return (
    <View style={[filmStyles.strip, style]}>
      {Array.from({ length: 10 }).map((_, i) => (
        <View key={i} style={filmStyles.hole} />
      ))}
    </View>
  );
}

const filmStyles = StyleSheet.create({
  strip: {
    position: 'absolute',
    flexDirection: 'column',
    gap: 14,
    opacity: 0.25,
  },
  hole: {
    width: 14,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#FFD700',
  },
});

// ─────────────────────────────────────────────────────────────────────────────
export default function IntroScreen() {
  const router = useRouter();

  // ── Anim refs ────────────────────────────────────────────────────────────
  // Gold diagonal lines
  const line1Opacity = useRef(new Animated.Value(0)).current;
  const line2Opacity = useRef(new Animated.Value(0)).current;
  const line1Translate = useRef(new Animated.Value(-40)).current;
  const line2Translate = useRef(new Animated.Value(40)).current;

  // Film strips
  const filmOpacity = useRef(new Animated.Value(0)).current;

  // X — flash + scale + pulse glow
  const xOpacity = useRef(new Animated.Value(0)).current;
  const xScale = useRef(new Animated.Value(0.2)).current;
  const xGlow = useRef(new Animated.Value(0)).current;
  const xFlip = useRef(new Animated.Value(0)).current;
  const xTranslateX = useRef(new Animated.Value(0)).current;

  // PNOY
  const pnoyOpacity = useRef(new Animated.Value(0)).current;
  const pnoyTranslateX = useRef(new Animated.Value(-width * 0.3)).current;
  const pnoyScale = useRef(new Animated.Value(0.88)).current;

  // Tagline
  const tagOpacity = useRef(new Animated.Value(0)).current;
  const tagTranslateY = useRef(new Animated.Value(16)).current;

  // Watermarks
  const watermarkOpacity = useRef(new Animated.Value(0)).current;

  // Screen fade out
  const screenOpacity = useRef(new Animated.Value(1)).current;

  // ── Sequence ─────────────────────────────────────────────────────────────
  useEffect(() => {
    // Step 0: background elements appear
    Animated.parallel([
      Animated.timing(line1Opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(line2Opacity, { toValue: 0.7, duration: 500, delay: 150, useNativeDriver: true }),
      Animated.timing(line1Translate, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(line2Translate, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(filmOpacity, { toValue: 1, duration: 600, delay: 200, useNativeDriver: true }),
      Animated.timing(watermarkOpacity, { toValue: 1, duration: 800, delay: 300, useNativeDriver: true }),
    ]).start(() => {
      // Step 1: X FLASHES in — bold, oversized
      Animated.parallel([
        Animated.timing(xOpacity, { toValue: 1, duration: 60, useNativeDriver: true }),
        Animated.spring(xScale, {
          toValue: 1,
          friction: 3,
          tension: 180,
          useNativeDriver: true,
        }),
        Animated.timing(xGlow, { toValue: 1, duration: 250, useNativeDriver: false }),
      ]).start(() => {
        // Step 2: X flips twice (rotateY 0 → 360 → 720)
        Animated.sequence([
          Animated.timing(xFlip, {
            toValue: 1,
            duration: 340,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(xFlip, {
            toValue: 2,
            duration: 340,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Step 3: X slides right, PNOY sweeps from left
          Animated.parallel([
            Animated.timing(xTranslateX, {
              toValue: width * 0.195,
              duration: 440,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(pnoyOpacity, {
              toValue: 1,
              duration: 380,
              delay: 100,
              useNativeDriver: true,
            }),
            Animated.timing(pnoyTranslateX, {
              toValue: 0,
              duration: 440,
              easing: Easing.out(Easing.back(1.4)),
              useNativeDriver: true,
            }),
            Animated.spring(pnoyScale, {
              toValue: 1,
              friction: 6,
              tension: 80,
              useNativeDriver: true,
            }),
          ]).start(() => {
            // Step 4: Tagline fades up
            Animated.parallel([
              Animated.timing(tagOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
              Animated.timing(tagTranslateY, {
                toValue: 0,
                duration: 400,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
              }),
            ]).start(() => {
              // Hold 1.4s then fade to sign-in
              setTimeout(() => {
                Animated.timing(screenOpacity, {
                  toValue: 0,
                  duration: 600,
                  easing: Easing.in(Easing.cubic),
                  useNativeDriver: true,
                }).start(() => {
                  router.replace('/signin');
                });
              }, 1400);
            });
          });
        });
      });
    });
  }, []);

  const xRotateY = xFlip.interpolate({
    inputRange: [0, 0.5, 1, 1.5, 2],
    outputRange: ['0deg', '90deg', '180deg', '270deg', '360deg'],
  });

  const xGlowRadius = xGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 60],
  });

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      {/* Deep dark base */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['#000000', '#050200', '#0a0600', '#000000']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
        />
      </View>

      {/* Gold diagonal sweep lines (like the photo's film frame) */}
      <Animated.View
        style={[
          styles.diagLine1,
          {
            opacity: line1Opacity,
            transform: [{ translateX: line1Translate }, { rotate: '-52deg' }],
          },
        ]}
      >
        <LinearGradient
          colors={['transparent', 'rgba(255,215,0,0.55)', 'rgba(255,215,0,0.18)', 'transparent']}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.diagLine2,
          {
            opacity: line2Opacity,
            transform: [{ translateX: line2Translate }, { rotate: '-52deg' }],
          },
        ]}
      >
        <LinearGradient
          colors={['transparent', 'rgba(255,180,0,0.3)', 'rgba(255,215,0,0.08)', 'transparent']}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>

      {/* Film strip accents */}
      <Animated.View style={{ opacity: filmOpacity }}>
        <FilmStrip style={{ top: height * 0.08, left: 18 }} />
        <FilmStrip style={{ top: height * 0.18, right: 22 }} />
        <FilmStrip style={{ bottom: height * 0.1, left: 24 }} />
        <FilmStrip style={{ bottom: height * 0.2, right: 18 }} />
      </Animated.View>

      {/* PNOYX watermarks (mimic the photo layout) */}
      <Animated.View style={[styles.watermarkGrid, { opacity: watermarkOpacity }]}>
        {[
          { top: '10%', left: '8%' }, { top: '10%', right: '8%' },
          { top: '24%', left: '18%' }, { top: '24%', right: '18%' },
          { top: '38%', left: '6%' }, { top: '38%', right: '6%' },
          { bottom: '25%', left: '12%' }, { bottom: '25%', right: '12%' },
          { bottom: '12%', left: '20%' }, { bottom: '12%', right: '20%' },
        ].map((pos, i) => (
          <View key={i} style={[styles.watermarkItem, pos as any]}>
            <View style={styles.watermarkIcon} />
            <Text style={styles.watermarkText}>PNOYX</Text>
          </View>
        ))}
      </Animated.View>

      {/* Central gold glow behind X */}
      <Animated.View
        style={[
          styles.centralGlow,
          { shadowRadius: xGlowRadius },
        ]}
      />

      {/* ── LOGO ROW ── */}
      <View style={styles.logoRow}>
        {/* PNOY slides from left */}
        <Animated.Text
          style={[
            styles.pnoyText,
            {
              opacity: pnoyOpacity,
              transform: [
                { translateX: pnoyTranslateX },
                { scale: pnoyScale },
              ],
            },
          ]}
        >
          PNOY
        </Animated.Text>

        {/* X — flashes, flips, slides right */}
        <Animated.Text
          style={[
            styles.xText,
            {
              opacity: xOpacity,
              transform: [
                { scale: xScale },
                { translateX: xTranslateX },
                { perspective: 1000 },
                { rotateY: xRotateY },
              ],
            },
          ]}
        >
          X
        </Animated.Text>
      </View>

      {/* Gold underline accent */}
      <Animated.View
        style={[
          styles.underline,
          { opacity: tagOpacity },
        ]}
      >
        <LinearGradient
          colors={['transparent', '#FFD700', '#FFD700', 'transparent']}
          style={{ flex: 1, height: 2 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>

      {/* Tagline */}
      <Animated.Text
        style={[
          styles.tagline,
          {
            opacity: tagOpacity,
            transform: [{ translateY: tagTranslateY }],
          },
        ]}
      >
        CINEMA REDEFINED
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  diagLine1: {
    position: 'absolute',
    width: width * 2.5,
    height: 180,
    top: -40,
    left: -width * 0.8,
  },
  diagLine2: {
    position: 'absolute',
    width: width * 2.5,
    height: 100,
    bottom: height * 0.15,
    left: -width * 0.6,
  },
  watermarkGrid: {
    ...StyleSheet.absoluteFillObject,
  },
  watermarkItem: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    opacity: 0.18,
  },
  watermarkIcon: {
    width: 12,
    height: 12,
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: '#FFD700',
  },
  watermarkText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFD700',
    letterSpacing: 1.5,
  },
  centralGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,215,0,0.07)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    elevation: 0,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  pnoyText: {
    fontSize: Platform.select({ ios: 78, android: 72, default: 78 }),
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 5,
    includeFontPadding: false,
  } as any,
  xText: {
    fontSize: Platform.select({ ios: 88, android: 82, default: 88 }),
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 0,
    includeFontPadding: false,
    textShadowColor: 'rgba(255, 215, 0, 0.95)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 28,
  } as any,
  underline: {
    width: width * 0.52,
    height: 2,
    marginTop: 10,
  },
  tagline: {
    marginTop: 14,
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,215,0,0.72)',
    letterSpacing: 9,
  },
});

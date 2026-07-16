import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/theme';

const { width, height } = Dimensions.get('window');

export default function IntroScreen() {
  const router = useRouter();

  // X animations
  const xOpacity = useRef(new Animated.Value(0)).current;
  const xScale = useRef(new Animated.Value(0.4)).current;
  const xFlip = useRef(new Animated.Value(0)).current;   // 0 = normal, used for rotateY
  const xTranslateX = useRef(new Animated.Value(0)).current;
  const xGlow = useRef(new Animated.Value(0)).current;

  // PNOY animations
  const pnoyOpacity = useRef(new Animated.Value(0)).current;
  const pnoyTranslateX = useRef(new Animated.Value(-60)).current;

  // Screen fade out
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Phase 1: X flashes onto screen (0ms)
    Animated.parallel([
      Animated.timing(xOpacity, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(xScale, {
        toValue: 1,
        friction: 4,
        tension: 120,
        useNativeDriver: true,
      }),
      Animated.timing(xGlow, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // Phase 2: X flips twice (rotateY 0→360→720 = 2 full flips)
      Animated.sequence([
        Animated.timing(xFlip, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }),
        Animated.timing(xFlip, {
          toValue: 2,
          duration: 320,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Phase 3: X slides right, PNOY appears from left
        Animated.parallel([
          Animated.timing(xTranslateX, {
            toValue: width * 0.18,
            duration: 380,
            useNativeDriver: true,
          }),
          Animated.timing(pnoyOpacity, {
            toValue: 1,
            duration: 350,
            delay: 120,
            useNativeDriver: true,
          }),
          Animated.timing(pnoyTranslateX, {
            toValue: 0,
            duration: 380,
            delay: 80,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Hold for a moment, then navigate to sign-in
          setTimeout(() => {
            Animated.timing(screenOpacity, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }).start(() => {
              router.replace('/signin');
            });
          }, 1200);
        });
      });
    });
  }, []);

  const xRotateY = xFlip.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['0deg', '360deg', '720deg'],
  });

  const glowColor = xGlow.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,215,0,0)', 'rgba(255,215,0,0.6)'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      {/* Deep black background */}
      <View style={styles.bg} />

      {/* Subtle radial glow in center */}
      <Animated.View
        style={[
          styles.glow,
          { backgroundColor: glowColor as any },
        ]}
      />

      {/* Logo row: PNOY + X */}
      <View style={styles.logoRow}>
        {/* PNOY — slides in from left */}
        <Animated.Text
          style={[
            styles.pnoyText,
            {
              opacity: pnoyOpacity,
              transform: [{ translateX: pnoyTranslateX }],
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
                { perspective: 800 },
                { rotateY: xRotateY },
              ],
            },
          ]}
        >
          X
        </Animated.Text>
      </View>

      {/* Tagline */}
      <Animated.Text
        style={[
          styles.tagline,
          { opacity: pnoyOpacity },
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
  bg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  glow: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    alignSelf: 'center',
    top: height / 2 - 160,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pnoyText: {
    fontSize: Platform.select({ ios: 72, android: 68, default: 72 }),
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 6,
    marginRight: 2,
    includeFontPadding: false,
  } as any,
  xText: {
    fontSize: Platform.select({ ios: 80, android: 76, default: 80 }),
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 0,
    includeFontPadding: false,
    textShadowColor: 'rgba(255, 215, 0, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  } as any,
  tagline: {
    marginTop: 16,
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,215,0,0.7)',
    letterSpacing: 8,
  },
});

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMovies } from '../../hooks/useMovies';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '../../constants/theme';
import { Movie } from '../../services/movieService';

const { width: SCREEN_W } = Dimensions.get('window');
const HERO_H = SCREEN_W * 0.62;

export function HeroBanner() {
  const router = useRouter();
  const { featuredMovies, loading } = useMovies();
  const [activeIdx, setActiveIdx] = useState(0);
  const flatRef = useRef<FlatList>(null);

  useEffect(() => {
    if (featuredMovies.length < 2) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => {
        const next = (prev + 1) % featuredMovies.length;
        flatRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4500);
    return () => clearInterval(timer);
  }, [featuredMovies.length]);

  const handleScroll = (e: any) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
    setActiveIdx(idx);
  };

  if (loading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={Colors.gold} size="large" />
      </View>
    );
  }

  if (featuredMovies.length === 0) return null;

  const movie = featuredMovies[activeIdx] || featuredMovies[0];

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatRef}
        data={featuredMovies}
        keyExtractor={(m: Movie) => m.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }: { item: Movie }) => (
          <View style={{ width: SCREEN_W }}>
            <Image
              source={{ uri: item.banner }}
              style={styles.bannerImage}
              contentFit="cover"
              transition={300}
            />
            <LinearGradient
              colors={['rgba(10,0,0,0)', 'rgba(10,0,0,0.6)', '#0a0000']}
              style={StyleSheet.absoluteFill}
            />
          </View>
        )}
      />

      <View style={styles.exclusiveBadge}>
        <Text style={styles.exclusiveText}>EXCLUSIVE PREMIERE RELEASE</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{movie.title}</Text>
        {movie.subtitle ? (
          <Text style={styles.subtitle}>{movie.subtitle}</Text>
        ) : null}
        {movie.description ? (
          <Text style={styles.description} numberOfLines={1}>{movie.description}</Text>
        ) : null}
        <View style={styles.meta}>
          <Text style={styles.metaText}>★ {movie.rating}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>{movie.genre}</Text>
          {movie.duration ? (
            <>
              <Text style={styles.metaDot}>·</Text>
              <Text style={styles.metaText}>{movie.duration}</Text>
            </>
          ) : null}
        </View>
        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.watchBtn, pressed && { opacity: 0.82 }]}
            onPress={() => router.push(`/movie/${movie.id}` as any)}
          >
            <Text style={styles.watchBtnText}>WATCH NOW</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.infoBtn, pressed && { opacity: 0.7 }]}
            onPress={() => router.push(`/movie/${movie.id}` as any)}
          >
            <Text style={styles.infoBtnText}>More Info</Text>
          </Pressable>
        </View>
        <View style={styles.dots}>
          {featuredMovies.map((_: Movie, i: number) => (
            <View key={i} style={[styles.dot, i === activeIdx && styles.dotActive]} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_W,
    height: HERO_H + 180,
    backgroundColor: Colors.bg,
  },
  bannerImage: {
    width: SCREEN_W,
    height: HERO_H + 180,
    backgroundColor: Colors.bgElevated,
  },
  exclusiveBadge: {
    position: 'absolute',
    top: 116,
    left: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: Radius.sm,
  },
  exclusiveText: {
    color: '#000',
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    letterSpacing: 1.5,
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: Spacing.md,
    paddingBottom: Spacing.lg,
    paddingTop: 140,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 26,
    fontWeight: FontWeight.black,
    marginBottom: 3,
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    marginBottom: 2,
  },
  description: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  metaText: { color: Colors.gold, fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  metaDot: { color: 'rgba(255,255,255,0.35)', fontSize: FontSize.xs },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  watchBtn: {
    backgroundColor: Colors.gold,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    borderRadius: Radius.sm,
    alignItems: 'center',
    minWidth: 130,
  },
  watchBtnText: {
    color: '#000',
    fontWeight: FontWeight.bold,
    fontSize: FontSize.sm,
    letterSpacing: 0.5,
  },
  infoBtn: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  infoBtnText: {
    color: '#FFFFFF',
    fontWeight: FontWeight.semibold,
    fontSize: FontSize.sm,
  },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.3)' },
  dotActive: { backgroundColor: Colors.gold, width: 20 },
});

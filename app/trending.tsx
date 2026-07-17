import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BG_IMAGE_URI, Spacing, Radius } from '../constants/theme';
import { getTrendingMovies } from '../services/movieService';

const { width } = Dimensions.get('window');
const FEATURED_H = width * 0.55;

const TRENDING = getTrendingMovies();

export default function TrendingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [hero, ...rest] = TRENDING;

  return (
    <View style={styles.container}>
      <Image source={{ uri: BG_IMAGE_URI }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color="#FFD700" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Trending Now</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Hero */}
        {hero ? (
          <TouchableOpacity
            style={styles.heroCard}
            activeOpacity={0.84}
            onPress={() => router.push(`/movie/${hero.id}` as any)}
          >
            <Image source={{ uri: hero.banner }} style={styles.heroBanner} contentFit="cover" transition={200} />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.9)']} style={StyleSheet.absoluteFill} />
            <View style={styles.heroContent}>
              <View style={styles.trendingBadge}>
                <MaterialIcons name="trending-up" size={12} color="#000" />
                <Text style={styles.trendingBadgeText}>#1 TRENDING</Text>
              </View>
              <Text style={styles.heroTitle}>{hero.title}</Text>
              <View style={styles.heroMeta}>
                <Text style={styles.heroRating}>★ {hero.rating}</Text>
                <Text style={styles.heroDot}>·</Text>
                <Text style={styles.heroGenre}>{hero.genre}</Text>
              </View>
              <View style={styles.heroViews}>
                <MaterialIcons name="visibility" size={12} color="rgba(255,255,255,0.5)" />
                <Text style={styles.heroViewsText}>{((hero.views ?? 0) / 1000).toFixed(1)}K views</Text>
              </View>
            </View>
          </TouchableOpacity>
        ) : null}

        {/* Rest of trending */}
        <Text style={styles.sectionTitle}>More Trending</Text>
        <View style={styles.list}>
          {rest.map((movie, i) => (
            <TouchableOpacity
              key={movie.id}
              style={styles.listCard}
              activeOpacity={0.82}
              onPress={() => router.push(`/movie/${movie.id}` as any)}
            >
              <View style={styles.rankCircle}>
                <Text style={styles.rankText}>#{i + 2}</Text>
              </View>
              <Image source={{ uri: movie.poster }} style={styles.listThumb} contentFit="cover" transition={200} />
              <View style={styles.listInfo}>
                <Text style={styles.listTitle}>{movie.title}</Text>
                <Text style={styles.listGenre}>{movie.genre} · {movie.year}</Text>
                <View style={styles.listMeta}>
                  <MaterialIcons name="star" size={12} color="#FFD700" />
                  <Text style={styles.listRating}>{movie.rating}</Text>
                  <Text style={styles.listViews}>{((movie.views ?? 0) / 1000).toFixed(1)}K views</Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="rgba(255,255,255,0.3)" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.68)' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: 16,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  pageTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  heroCard: {
    marginHorizontal: Spacing.md,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    height: FEATURED_H,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.2)',
    position: 'relative',
  },
  heroBanner: { ...StyleSheet.absoluteFillObject },
  heroContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 18 },
  trendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFD700',
    alignSelf: 'flex-start',
    borderRadius: Radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  trendingBadgeText: { fontSize: 10, fontWeight: '900', color: '#000', letterSpacing: 0.5 },
  heroTitle: { fontSize: 22, fontWeight: '900', color: '#FFFFFF', marginBottom: 6 },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  heroRating: { fontSize: 13, fontWeight: '700', color: '#FFD700' },
  heroDot: { fontSize: 11, color: 'rgba(255,255,255,0.3)' },
  heroGenre: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  heroViews: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heroViewsText: { fontSize: 11, color: 'rgba(255,255,255,0.45)' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', paddingHorizontal: Spacing.md, marginBottom: 12 },
  list: { paddingHorizontal: Spacing.md, gap: 10 },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10,10,10,0.9)',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.12)',
    padding: 12,
    gap: 12,
  },
  rankCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,215,0,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  rankText: { fontSize: 11, fontWeight: '800', color: '#FFD700' },
  listThumb: { width: 54, height: 76, borderRadius: Radius.sm, flexShrink: 0 },
  listInfo: { flex: 1 },
  listTitle: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  listGenre: { fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 6 },
  listMeta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  listRating: { fontSize: 12, fontWeight: '700', color: '#FFD700', marginRight: 6 },
  listViews: { fontSize: 11, color: 'rgba(255,255,255,0.35)' },
});

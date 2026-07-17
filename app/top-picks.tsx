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
import { MOVIES } from '../services/movieService';

const { width } = Dimensions.get('window');
const CARD_W = width - Spacing.md * 2;

const TOP_PICKS = [...MOVIES].sort((a, b) => b.rating - a.rating);

export default function TopPicksScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={{ uri: BG_IMAGE_URI }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color="#FFD700" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Top Picks</Text>
          <View style={{ width: 40 }} />
        </View>

        <Text style={styles.subtitle}>Curated · Most popular · Highest rated on PNOYX</Text>

        <View style={styles.list}>
          {TOP_PICKS.map((movie, index) => (
            <TouchableOpacity
              key={movie.id}
              style={styles.card}
              activeOpacity={0.84}
              onPress={() => router.push(`/movie/${movie.id}` as any)}
            >
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>#{index + 1}</Text>
              </View>
              <Image source={{ uri: movie.banner }} style={styles.banner} contentFit="cover" transition={200} />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={StyleSheet.absoluteFill} />
              <View style={styles.cardContent}>
                <View style={styles.cardMeta}>
                  {movie.is_free ? (
                    <View style={styles.freeBadge}><Text style={styles.freeBadgeText}>FREE</Text></View>
                  ) : (
                    <View style={styles.premBadge}><Text style={styles.premBadgeText}>PREMIUM</Text></View>
                  )}
                  <Text style={styles.genre}>{movie.genre}</Text>
                </View>
                <Text style={styles.title}>{movie.title}</Text>
                <View style={styles.ratingRow}>
                  <MaterialIcons name="star" size={14} color="#FFD700" />
                  <Text style={styles.rating}>{movie.rating}</Text>
                  <Text style={styles.dot}>·</Text>
                  <Text style={styles.year}>{movie.year}</Text>
                  {movie.duration ? (
                    <>
                      <Text style={styles.dot}>·</Text>
                      <Text style={styles.year}>{movie.duration}</Text>
                    </>
                  ) : null}
                </View>
                <TouchableOpacity
                  style={styles.watchBtn}
                  onPress={() => router.push(`/movie/${movie.id}` as any)}
                  activeOpacity={0.84}
                >
                  <Text style={styles.watchBtnText}>Watch Now</Text>
                </TouchableOpacity>
              </View>
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
    paddingBottom: 8,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  pageTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  subtitle: { fontSize: 12, color: 'rgba(255,215,0,0.6)', paddingHorizontal: Spacing.md, marginBottom: 20, letterSpacing: 0.5 },
  list: { paddingHorizontal: Spacing.md, gap: 14 },
  card: {
    width: CARD_W,
    height: 200,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.15)',
    position: 'relative',
  },
  rankBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    backgroundColor: '#FFD700',
    borderRadius: Radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  rankText: { fontSize: 13, fontWeight: '900', color: '#000' },
  banner: { ...StyleSheet.absoluteFillObject },
  cardContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 14 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  freeBadge: { backgroundColor: 'rgba(68,255,136,0.9)', borderRadius: 4, paddingHorizontal: 7, paddingVertical: 2 },
  freeBadgeText: { fontSize: 10, fontWeight: '800', color: '#000' },
  premBadge: { backgroundColor: 'rgba(255,215,0,0.9)', borderRadius: 4, paddingHorizontal: 7, paddingVertical: 2 },
  premBadgeText: { fontSize: 10, fontWeight: '800', color: '#000' },
  genre: { fontSize: 11, color: 'rgba(255,255,255,0.55)' },
  title: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', marginBottom: 5 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 10 },
  rating: { fontSize: 13, fontWeight: '700', color: '#FFD700' },
  dot: { fontSize: 11, color: 'rgba(255,255,255,0.3)' },
  year: { fontSize: 12, color: 'rgba(255,255,255,0.5)' },
  watchBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFD700',
    borderRadius: Radius.sm,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  watchBtnText: { fontSize: 13, fontWeight: '800', color: '#000' },
});

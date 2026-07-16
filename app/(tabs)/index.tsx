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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, BG_IMAGE_URI, Spacing, Radius } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';

const { width } = Dimensions.get('window');

const FEATURED = [
  { id: '1', title: 'Shadow Empire', genre: 'Action · Thriller', year: '2026', rating: '8.4', color: '#1a0a00' },
  { id: '2', title: 'Neon Drift', genre: 'Sci-Fi · Drama', year: '2026', rating: '7.9', color: '#000d1a' },
  { id: '3', title: 'Gold Rush', genre: 'Adventure', year: '2025', rating: '8.1', color: '#1a1400' },
];

const TRENDING = [
  { id: '4', title: 'Last Signal', genre: 'Horror', rating: '7.6' },
  { id: '5', title: 'Beyond Zero', genre: 'Sci-Fi', rating: '8.2' },
  { id: '6', title: 'Ember City', genre: 'Drama', rating: '7.4' },
  { id: '7', title: 'Phantom Route', genre: 'Thriller', rating: '8.0' },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] ?? 'Cinephile';

  return (
    <View style={styles.container}>
      {/* Background */}
      <Image
        source={{ uri: BG_IMAGE_URI }}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.overlay} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{firstName}</Text>
          </View>
          <Text style={styles.logoSmall}>
            PNOY<Text style={styles.logoSmallX}>X</Text>
          </Text>
        </View>

        {/* Featured Section */}
        <Text style={styles.sectionTitle}>Featured</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: Spacing.md, gap: 14 }}
          style={{ marginBottom: 28 }}
        >
          {FEATURED.map((item) => (
            <TouchableOpacity key={item.id} activeOpacity={0.82} style={[styles.featuredCard, { backgroundColor: item.color }]}>
              <View style={styles.featuredCardInner}>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>★ {item.rating}</Text>
                </View>
                <View style={styles.featuredMeta}>
                  <Text style={styles.featuredTitle}>{item.title}</Text>
                  <Text style={styles.featuredGenre}>{item.genre}</Text>
                  <Text style={styles.featuredYear}>{item.year}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Trending Section */}
        <Text style={styles.sectionTitle}>Trending Now</Text>
        <View style={styles.trendingGrid}>
          {TRENDING.map((item, index) => (
            <TouchableOpacity key={item.id} activeOpacity={0.8} style={styles.trendingCard}>
              <View style={styles.trendingIndex}>
                <Text style={styles.trendingIndexText}>{index + 1}</Text>
              </View>
              <View style={styles.trendingInfo}>
                <Text style={styles.trendingTitle}>{item.title}</Text>
                <Text style={styles.trendingGenre}>{item.genre}</Text>
              </View>
              <Text style={styles.trendingRating}>★ {item.rating}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.65)' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingBottom: 20,
  },
  greeting: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 2 },
  userName: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },
  logoSmall: { fontSize: 22, fontWeight: '900', color: '#FFFFFF', letterSpacing: 2 },
  logoSmallX: { color: '#FFD700' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    paddingHorizontal: Spacing.md,
    marginBottom: 14,
    letterSpacing: 0.3,
  },
  featuredCard: {
    width: width * 0.58,
    height: 220,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.18)',
    overflow: 'hidden',
  },
  featuredCardInner: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  ratingBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,215,0,0.18)',
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.4)',
  },
  ratingText: { fontSize: 12, fontWeight: '700', color: '#FFD700' },
  featuredMeta: {},
  featuredTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  featuredGenre: { fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 2 },
  featuredYear: { fontSize: 11, color: 'rgba(255,215,0,0.6)' },
  trendingGrid: {
    paddingHorizontal: Spacing.md,
    gap: 10,
  },
  trendingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(12,12,12,0.85)',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.12)',
    padding: 14,
    gap: 14,
  },
  trendingIndex: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,215,0,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendingIndexText: { fontSize: 13, fontWeight: '800', color: '#FFD700' },
  trendingInfo: { flex: 1 },
  trendingTitle: { fontSize: 15, fontWeight: '700', color: '#FFFFFF', marginBottom: 3 },
  trendingGenre: { fontSize: 12, color: 'rgba(255,255,255,0.45)' },
  trendingRating: { fontSize: 13, fontWeight: '700', color: '#FFD700' },
});

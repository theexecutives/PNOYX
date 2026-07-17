import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, BG_IMAGE_URI, Spacing, Radius, FontSize, FontWeight } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { useMovies } from '../../hooks/useMovies';
import { HeroBanner } from '../../components/ui/HeroBanner';
import { CATEGORIES } from '../../services/movieService';
import type { Movie } from '../../services/movieService';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { movies, trendingMovies, loading, activeCategory, filterByCategory } = useMovies();
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] ?? 'Cinephile';

  return (
    <View style={styles.container}>
      <Image source={{ uri: BG_IMAGE_URI }} style={StyleSheet.absoluteFillObject} contentFit="cover" transition={200} />
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

        {/* Hero Banner */}
        <HeroBanner />

        {/* Category Filter */}
        <View style={styles.categorySection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: Spacing.md, gap: 8 }}
          >
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catChip, activeCategory === cat.id && styles.catChipActive]}
                onPress={() => filterByCategory(cat.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.catChipText, activeCategory === cat.id && styles.catChipTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Movies Grid */}
        <Text style={styles.sectionTitle}>
          {activeCategory === 'all' ? 'All Titles' : CATEGORIES.find(c => c.id === activeCategory)?.label ?? 'Browse'}
        </Text>
        <FlatList
          data={movies}
          keyExtractor={(item: Movie) => item.id}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={{ paddingHorizontal: Spacing.md, gap: 12 }}
          columnWrapperStyle={{ gap: 12 }}
          renderItem={({ item }: { item: Movie }) => (
            <TouchableOpacity
              style={styles.movieCard}
              activeOpacity={0.82}
              onPress={() => router.push(`/movie/${item.id}` as any)}
            >
              <Image
                source={{ uri: item.poster }}
                style={styles.moviePoster}
                contentFit="cover"
                transition={200}
              />
              <View style={styles.movieOverlay}>
                {item.is_free ? (
                  <View style={styles.freeBadge}><Text style={styles.freeBadgeText}>FREE</Text></View>
                ) : (
                  <View style={styles.premiumBadge}><Text style={styles.premiumBadgeText}>PREMIUM</Text></View>
                )}
              </View>
              <View style={styles.movieInfo}>
                <Text style={styles.movieTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.movieMeta}>★ {item.rating}  ·  {item.year}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Trending Now */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Trending Now</Text>
        <View style={styles.trendingList}>
          {trendingMovies.slice(0, 5).map((item: Movie, index: number) => (
            <TouchableOpacity
              key={item.id}
              style={styles.trendingCard}
              activeOpacity={0.8}
              onPress={() => router.push(`/movie/${item.id}` as any)}
            >
              <View style={styles.trendingIndex}>
                <Text style={styles.trendingIndexText}>{index + 1}</Text>
              </View>
              <Image source={{ uri: item.poster }} style={styles.trendingThumb} contentFit="cover" transition={200} />
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
    paddingBottom: 16,
  },
  greeting: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 2 },
  userName: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },
  logoSmall: { fontSize: 22, fontWeight: '900', color: '#FFFFFF', letterSpacing: 2 },
  logoSmallX: { color: '#FFD700' },
  categorySection: { marginVertical: 16 },
  catChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  catChipActive: { backgroundColor: '#FFD700', borderColor: '#FFD700' },
  catChipText: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.6)' },
  catChipTextActive: { color: '#000' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    paddingHorizontal: Spacing.md,
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  movieCard: {
    flex: 1,
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.1)',
  },
  moviePoster: { width: '100%', height: (width / 2 - Spacing.md - 6) * 1.4 },
  movieOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  freeBadge: {
    backgroundColor: 'rgba(68,255,136,0.9)',
    borderRadius: Radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  freeBadgeText: { fontSize: 10, fontWeight: '800', color: '#000' },
  premiumBadge: {
    backgroundColor: 'rgba(255,215,0,0.9)',
    borderRadius: Radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  premiumBadgeText: { fontSize: 10, fontWeight: '800', color: '#000' },
  movieInfo: { padding: 10 },
  movieTitle: { fontSize: 13, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  movieMeta: { fontSize: 11, color: 'rgba(255,215,0,0.7)' },
  trendingList: { paddingHorizontal: Spacing.md, gap: 10 },
  trendingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(12,12,12,0.88)',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.12)',
    padding: 10,
    gap: 12,
  },
  trendingIndex: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,215,0,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendingIndexText: { fontSize: 12, fontWeight: '800', color: '#FFD700' },
  trendingThumb: { width: 48, height: 66, borderRadius: Radius.sm },
  trendingInfo: { flex: 1 },
  trendingTitle: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', marginBottom: 3 },
  trendingGenre: { fontSize: 11, color: 'rgba(255,255,255,0.45)' },
  trendingRating: { fontSize: 12, fontWeight: '700', color: '#FFD700' },
});

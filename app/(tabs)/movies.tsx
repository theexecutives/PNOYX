import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BG_IMAGE_URI, Spacing, Radius } from '../../constants/theme';

const CATEGORIES = ['All', 'Action', 'Drama', 'Sci-Fi', 'Thriller', 'Horror'];

const MOVIES = [
  { id: '1', title: 'Shadow Empire', genre: 'Action', year: '2026', rating: '8.4' },
  { id: '2', title: 'Neon Drift', genre: 'Sci-Fi', year: '2026', rating: '7.9' },
  { id: '3', title: 'Gold Rush', genre: 'Drama', year: '2025', rating: '8.1' },
  { id: '4', title: 'Last Signal', genre: 'Horror', year: '2025', rating: '7.6' },
  { id: '5', title: 'Beyond Zero', genre: 'Sci-Fi', year: '2026', rating: '8.2' },
  { id: '6', title: 'Ember City', genre: 'Drama', year: '2026', rating: '7.4' },
  { id: '7', title: 'Phantom Route', genre: 'Thriller', year: '2025', rating: '8.0' },
  { id: '8', title: 'Dark Meridian', genre: 'Action', year: '2026', rating: '7.8' },
];

export default function MoviesScreen() {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All' ? MOVIES : MOVIES.filter(m => m.genre === activeCategory);

  return (
    <View style={styles.container}>
      <Image source={{ uri: BG_IMAGE_URI }} style={StyleSheet.absoluteFillObject} contentFit="cover" transition={200} />
      <View style={styles.overlay} />

      <View style={{ flex: 1 }}>
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <Text style={styles.pageTitle}>Movies</Text>
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: Spacing.md, gap: 8, paddingVertical: 4 }}
          style={{ maxHeight: 52, marginBottom: 16 }}
        >
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={[styles.chip, activeCategory === cat && styles.chipActive]}
            >
              <Text style={[styles.chipText, activeCategory === cat && styles.chipTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: Spacing.md, gap: 12, paddingBottom: 32 }}
          columnWrapperStyle={{ gap: 12 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.movieCard} activeOpacity={0.82}>
              <View style={styles.moviePoster}>
                <Text style={styles.moviePosterTitle}>{item.title}</Text>
              </View>
              <Text style={styles.movieTitle}>{item.title}</Text>
              <View style={styles.movieMeta}>
                <Text style={styles.movieGenre}>{item.genre}</Text>
                <Text style={styles.movieRating}>★ {item.rating}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)' },
  header: { paddingHorizontal: Spacing.md, paddingBottom: 16 },
  pageTitle: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.5 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  chipActive: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  chipText: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.65)' },
  chipTextActive: { color: '#000' },
  movieCard: { flex: 1 },
  moviePoster: {
    height: 160,
    backgroundColor: 'rgba(20,15,5,0.9)',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.15)',
    justifyContent: 'flex-end',
    padding: 10,
    marginBottom: 8,
  },
  moviePosterTitle: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: 0.5 },
  movieTitle: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  movieMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  movieGenre: { fontSize: 11, color: 'rgba(255,255,255,0.45)' },
  movieRating: { fontSize: 11, fontWeight: '700', color: '#FFD700' },
});

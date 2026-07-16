import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BG_IMAGE_URI, Spacing, Radius } from '../../constants/theme';

const ALL_TITLES = [
  { id: '1', title: 'Shadow Empire', genre: 'Action · Thriller', rating: '8.4' },
  { id: '2', title: 'Neon Drift', genre: 'Sci-Fi · Drama', rating: '7.9' },
  { id: '3', title: 'Gold Rush', genre: 'Adventure', rating: '8.1' },
  { id: '4', title: 'Last Signal', genre: 'Horror', rating: '7.6' },
  { id: '5', title: 'Beyond Zero', genre: 'Sci-Fi', rating: '8.2' },
  { id: '6', title: 'Ember City', genre: 'Drama', rating: '7.4' },
  { id: '7', title: 'Phantom Route', genre: 'Thriller', rating: '8.0' },
  { id: '8', title: 'Dark Meridian', genre: 'Action', rating: '7.8' },
];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const results = query.length > 0
    ? ALL_TITLES.filter(t => t.title.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <View style={styles.container}>
      <Image source={{ uri: BG_IMAGE_URI }} style={StyleSheet.absoluteFillObject} contentFit="cover" transition={200} />
      <View style={styles.overlay} />

      <View style={{ flex: 1 }}>
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <Text style={styles.pageTitle}>Search</Text>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={20} color="rgba(255,255,255,0.4)" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search movies, series..."
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={query}
              onChangeText={setQuery}
              autoCorrect={false}
            />
            {query.length > 0 ? (
              <TouchableOpacity onPress={() => setQuery('')}>
                <MaterialIcons name="close" size={18} color="rgba(255,255,255,0.4)" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {query.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎬</Text>
            <Text style={styles.emptyTitle}>Find Your Film</Text>
            <Text style={styles.emptySub}>Search by title, genre, or actor</Text>
          </View>
        ) : results.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No Results</Text>
            <Text style={styles.emptySub}>Try a different search term</Text>
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingHorizontal: Spacing.md, gap: 10, paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.resultCard} activeOpacity={0.8}>
                <View style={styles.resultThumb}>
                  <Text style={styles.resultThumbLetter}>{item.title[0]}</Text>
                </View>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultTitle}>{item.title}</Text>
                  <Text style={styles.resultGenre}>{item.genre}</Text>
                </View>
                <Text style={styles.resultRating}>★ {item.rating}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)' },
  header: { paddingHorizontal: Spacing.md, paddingBottom: 20 },
  pageTitle: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', marginBottom: 16 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 15, color: '#FFFFFF' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: -80 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  emptySub: { fontSize: 14, color: 'rgba(255,255,255,0.45)' },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(12,12,12,0.88)',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.12)',
    padding: 14,
    gap: 14,
  },
  resultThumb: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    backgroundColor: 'rgba(255,215,0,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultThumbLetter: { fontSize: 18, fontWeight: '900', color: '#FFD700' },
  resultInfo: { flex: 1 },
  resultTitle: { fontSize: 15, fontWeight: '700', color: '#FFFFFF', marginBottom: 3 },
  resultGenre: { fontSize: 12, color: 'rgba(255,255,255,0.45)' },
  resultRating: { fontSize: 13, fontWeight: '700', color: '#FFD700' },
});

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
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BG_IMAGE_URI, Spacing, Radius } from '../constants/theme';

const { width } = Dimensions.get('window');
const CARD_W = (width - Spacing.md * 2 - 12) / 2;

const GENRE_LIST = [
  { id: 'Drama', label: 'Drama', icon: 'theater-comedy', color: '#7B4FFF', count: 24 },
  { id: 'Action', label: 'Action', icon: 'local-fire-department', color: '#FF5C35', count: 18 },
  { id: 'Romance', label: 'Romance', icon: 'favorite', color: '#FF4D8B', count: 16 },
  { id: 'Thriller', label: 'Thriller', icon: 'visibility-off', color: '#1A6B8A', count: 14 },
  { id: 'Comedy', label: 'Comedy', icon: 'sentiment-very-satisfied', color: '#F0A500', count: 20 },
  { id: 'Short Film', label: 'Short Films', icon: 'videocam', color: '#44AA77', count: 32 },
  { id: 'Horror', label: 'Horror', icon: 'dangerous', color: '#8B0000', count: 10 },
  { id: 'Sci-Fi', label: 'Sci-Fi', icon: 'rocket-launch', color: '#0066CC', count: 8 },
  { id: 'Documentary', label: 'Documentary', icon: 'menu-book', color: '#5C4A2A', count: 12 },
  { id: 'kids', label: 'For Kids', icon: 'child-care', color: '#2E8B57', count: 15 },
];

export default function CategoriesScreen() {
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
          <Text style={styles.pageTitle}>Browse by Genre</Text>
          <View style={{ width: 40 }} />
        </View>

        <Text style={styles.subtitle}>Explore our complete library organized by category</Text>

        <View style={styles.grid}>
          {GENRE_LIST.map((genre) => (
            <TouchableOpacity
              key={genre.id}
              style={[styles.genreCard, { borderColor: genre.color + '44' }]}
              activeOpacity={0.82}
              onPress={() => router.push({ pathname: '/(tabs)', params: { category: genre.id } } as any)}
            >
              <View style={[styles.genreIconBg, { backgroundColor: genre.color + '22' }]}>
                <MaterialIcons name={genre.icon as any} size={32} color={genre.color} />
              </View>
              <Text style={styles.genreLabel}>{genre.label}</Text>
              <Text style={styles.genreCount}>{genre.count} titles</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.72)' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: 8,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  pageTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.45)', paddingHorizontal: Spacing.md, marginBottom: 20 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.md,
    gap: 12,
  },
  genreCard: {
    width: CARD_W,
    backgroundColor: 'rgba(10,10,10,0.9)',
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    gap: 10,
  },
  genreIconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genreLabel: { fontSize: 15, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' },
  genreCount: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
});

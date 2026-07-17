import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BG_IMAGE_URI, Spacing, Radius } from '../constants/theme';

type WatchItem = {
  id: string;
  title: string;
  episode?: string;
  progress: number; // 0–1
  thumbnail: string;
  remaining: string;
  genre: string;
};

const MOCK_CONTINUE: WatchItem[] = [
  { id: 'c1', title: 'Sa Susunod na Habang Buhay', progress: 0.62, thumbnail: 'https://picsum.photos/seed/cw1/400/220', remaining: '38 min left', genre: 'Drama' },
  { id: 'c2', title: 'Anino ng Gabi', episode: 'Episode 2', progress: 0.28, thumbnail: 'https://picsum.photos/seed/cw2/400/220', remaining: '1h 12m left', genre: 'Thriller' },
  { id: 'c3', title: 'Tahanan (Short Film)', progress: 0.89, thumbnail: 'https://picsum.photos/seed/cw3/400/220', remaining: '3 min left', genre: 'Short Film' },
];

export default function ContinueWatchingScreen() {
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
          <Text style={styles.pageTitle}>Continue Watching</Text>
          <View style={{ width: 40 }} />
        </View>

        {MOCK_CONTINUE.length === 0 ? (
          <View style={styles.empty}>
            <MaterialIcons name="play-circle-outline" size={64} color="rgba(255,215,0,0.3)" />
            <Text style={styles.emptyTitle}>Nothing in progress</Text>
            <Text style={styles.emptyText}>Start watching any title and it will appear here.</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {MOCK_CONTINUE.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                activeOpacity={0.84}
                onPress={() => router.push(`/movie/${item.id}` as any)}
              >
                <View style={styles.thumbWrapper}>
                  <Image source={{ uri: item.thumbnail }} style={styles.thumb} contentFit="cover" transition={200} />
                  {/* Progress bar overlay */}
                  <View style={styles.progressBg}>
                    <View style={[styles.progressFill, { width: `${item.progress * 100}%` as any }]} />
                  </View>
                  {/* Play overlay */}
                  <View style={styles.playOverlay}>
                    <MaterialIcons name="play-circle-filled" size={44} color="rgba(255,215,0,0.9)" />
                  </View>
                </View>
                <View style={styles.info}>
                  <View style={styles.infoTop}>
                    <View>
                      <Text style={styles.title}>{item.title}</Text>
                      {item.episode ? <Text style={styles.episode}>{item.episode}</Text> : null}
                      <Text style={styles.genre}>{item.genre}</Text>
                    </View>
                    <TouchableOpacity style={styles.removeBtn}>
                      <MaterialIcons name="close" size={18} color="rgba(255,255,255,0.3)" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.progressRow}>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${item.progress * 100}%` as any }]} />
                    </View>
                    <Text style={styles.remaining}>{item.remaining}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
    paddingBottom: 16,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  pageTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  empty: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 40, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: 'rgba(255,255,255,0.6)' },
  emptyText: { fontSize: 14, color: 'rgba(255,255,255,0.35)', textAlign: 'center', lineHeight: 20 },
  list: { paddingHorizontal: Spacing.md, gap: 14 },
  card: {
    backgroundColor: 'rgba(10,10,10,0.9)',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.15)',
    overflow: 'hidden',
  },
  thumbWrapper: { position: 'relative' },
  thumb: { width: '100%', height: 180 },
  progressBg: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, backgroundColor: 'rgba(255,255,255,0.1)' },
  progressFill: { height: '100%', backgroundColor: '#FFD700' },
  playOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.25)' },
  info: { padding: 14 },
  infoTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  title: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 3 },
  episode: { fontSize: 12, color: '#FFD700', fontWeight: '600', marginBottom: 2 },
  genre: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  removeBtn: { padding: 4 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  progressBarBg: { flex: 1, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.1)' },
  progressBarFill: { height: '100%', borderRadius: 2, backgroundColor: '#FFD700' },
  remaining: { fontSize: 11, color: 'rgba(255,255,255,0.4)', flexShrink: 0 },
});

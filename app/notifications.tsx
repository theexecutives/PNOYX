import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BG_IMAGE_URI, Spacing, Radius } from '../constants/theme';

type NotificationItem = {
  id: string;
  type: 'release' | 'promo' | 'system';
  title: string;
  body: string;
  time: string;
  read: boolean;
};

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: '1', type: 'release', title: 'New Release: Anino ng Gabi', body: 'Now streaming exclusively on PNOYX. Watch the full thriller tonight.', time: '2h ago', read: false },
  { id: '2', type: 'promo', title: '50% Bonus Coins This Weekend!', body: 'Top up any amount and get double coins. Limited time only.', time: '5h ago', read: false },
  { id: '3', type: 'release', title: 'Bituin ng Maynila — Extended Cut', body: 'The director\'s cut with 20 additional minutes is now available.', time: '1d ago', read: true },
  { id: '4', type: 'system', title: 'Welcome to PNOYX!', body: 'Your account is ready. You received ₱29.00 welcome bonus coins.', time: '2d ago', read: true },
  { id: '5', type: 'promo', title: 'Refer a Friend', body: 'Invite a friend and earn 10 bonus coins when they register.', time: '3d ago', read: true },
  { id: '6', type: 'release', title: 'Tawanan Natin — Now Free!', body: 'This comedy hit is now available for all users at no cost.', time: '4d ago', read: true },
];

const TYPE_ICONS: Record<string, { icon: string; color: string }> = {
  release: { icon: 'movie', color: '#FFD700' },
  promo: { icon: 'local-offer', color: '#44FF88' },
  system: { icon: 'info', color: '#4AABFF' },
};

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [releaseAlerts, setReleaseAlerts] = useState(true);
  const [promoAlerts, setPromoAlerts] = useState(true);

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <View style={styles.container}>
      <Image source={{ uri: BG_IMAGE_URI }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color="#FFD700" />
          </TouchableOpacity>
          <View style={styles.titleRow}>
            <Text style={styles.pageTitle}>Notifications</Text>
            {unreadCount > 0 ? (
              <View style={styles.unreadBadge}><Text style={styles.unreadText}>{unreadCount}</Text></View>
            ) : null}
          </View>
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markAll}>Mark all read</Text>
          </TouchableOpacity>
        </View>

        {/* Preferences */}
        <View style={styles.prefSection}>
          <Text style={styles.prefTitle}>Alert Preferences</Text>
          <View style={styles.prefRow}>
            <MaterialIcons name="movie" size={18} color="#FFD700" />
            <Text style={styles.prefLabel}>Release Alerts</Text>
            <Switch
              value={releaseAlerts}
              onValueChange={setReleaseAlerts}
              trackColor={{ false: 'rgba(255,255,255,0.1)', true: 'rgba(255,215,0,0.5)' }}
              thumbColor={releaseAlerts ? '#FFD700' : '#555'}
            />
          </View>
          <View style={styles.prefRow}>
            <MaterialIcons name="local-offer" size={18} color="#44FF88" />
            <Text style={styles.prefLabel}>Promotions & Offers</Text>
            <Switch
              value={promoAlerts}
              onValueChange={setPromoAlerts}
              trackColor={{ false: 'rgba(255,255,255,0.1)', true: 'rgba(68,255,136,0.5)' }}
              thumbColor={promoAlerts ? '#44FF88' : '#555'}
            />
          </View>
        </View>

        {/* Notification List */}
        <View style={styles.list}>
          {notifications.map((item) => {
            const icon = TYPE_ICONS[item.type];
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.notifCard, !item.read && styles.notifCardUnread]}
                activeOpacity={0.8}
                onPress={() => setNotifications((prev) => prev.map((n) => n.id === item.id ? { ...n, read: true } : n))}
              >
                <View style={[styles.notifIcon, { borderColor: icon.color + '55' }]}>
                  <MaterialIcons name={icon.icon as any} size={20} color={icon.color} />
                </View>
                <View style={styles.notifBody}>
                  <Text style={styles.notifTitle}>{item.title}</Text>
                  <Text style={styles.notifText} numberOfLines={2}>{item.body}</Text>
                  <Text style={styles.notifTime}>{item.time}</Text>
                </View>
                {!item.read && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            );
          })}
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
    paddingHorizontal: Spacing.md,
    paddingBottom: 16,
    gap: 10,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  titleRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  pageTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  unreadBadge: { backgroundColor: '#FFD700', borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2 },
  unreadText: { fontSize: 11, fontWeight: '800', color: '#000' },
  markAll: { fontSize: 13, color: '#FFD700', fontWeight: '600' },
  prefSection: {
    marginHorizontal: Spacing.md,
    marginBottom: 16,
    backgroundColor: 'rgba(10,10,10,0.9)',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.15)',
    padding: 16,
  },
  prefTitle: { fontSize: 13, fontWeight: '700', color: '#FFD700', marginBottom: 12 },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  prefLabel: { flex: 1, fontSize: 14, color: '#FFFFFF', fontWeight: '500' },
  list: { paddingHorizontal: Spacing.md, gap: 10 },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(12,12,12,0.9)',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.1)',
    padding: 14,
    gap: 12,
  },
  notifCardUnread: { borderColor: 'rgba(255,215,0,0.28)', backgroundColor: 'rgba(255,215,0,0.04)' },
  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,215,0,0.07)',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  notifBody: { flex: 1 },
  notifTitle: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  notifText: { fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 18, marginBottom: 6 },
  notifTime: { fontSize: 11, color: 'rgba(255,255,255,0.3)' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFD700', alignSelf: 'center', flexShrink: 0 },
});

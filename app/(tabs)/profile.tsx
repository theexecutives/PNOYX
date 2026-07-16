import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BG_IMAGE_URI, Spacing, Radius, Colors } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from '../../services/authService';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const [confirmVisible, setConfirmVisible] = useState(false);

  const fullName = user?.user_metadata?.full_name ?? 'PNOYX User';
  const email = user?.email ?? '';
  const avatarUrl = user?.user_metadata?.avatar_url ?? null;

  async function handleSignOut() {
    await signOut();
    router.replace('/signin');
  }

  function confirmSignOut() {
    if (Platform.OS === 'web') {
      setConfirmVisible(true);
    } else {
      Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: handleSignOut },
      ]);
    }
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: BG_IMAGE_URI }} style={StyleSheet.absoluteFillObject} contentFit="cover" transition={200} />
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <Text style={styles.pageTitle}>Profile</Text>
        </View>

        {/* Avatar + Info */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarRing}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatarImage} contentFit="cover" />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitial}>{fullName[0]?.toUpperCase()}</Text>
              </View>
            )}
          </View>
          <Text style={styles.userName}>{fullName}</Text>
          <Text style={styles.userEmail}>{email}</Text>
          <View style={styles.memberBadge}>
            <Text style={styles.memberBadgeText}>★ PNOYX MEMBER</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[{ label: 'Watched', value: '0' }, { label: 'Favorites', value: '0' }, { label: 'Reviews', value: '0' }].map((s) => (
            <View key={s.label} style={styles.statBox}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu Items */}
        <View style={styles.menu}>
          {[
            { icon: 'bookmark', label: 'My Watchlist' },
            { icon: 'favorite', label: 'Favorites' },
            { icon: 'star', label: 'My Reviews' },
            { icon: 'notifications', label: 'Notifications' },
            { icon: 'settings', label: 'Settings' },
          ].map((item) => (
            <TouchableOpacity key={item.label} style={styles.menuItem} activeOpacity={0.78}>
              <MaterialIcons name={item.icon as any} size={20} color="#FFD700" />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <MaterialIcons name="chevron-right" size={20} color="rgba(255,255,255,0.3)" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={confirmSignOut} activeOpacity={0.82}>
          <MaterialIcons name="logout" size={18} color="#FF4444" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Web confirm modal */}
      {Platform.OS === 'web' && (
        <Modal visible={confirmVisible} transparent animationType="fade">
          <View style={styles.modalBg}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Sign Out</Text>
              <Text style={styles.modalMsg}>Are you sure you want to sign out?</Text>
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.modalCancel} onPress={() => setConfirmVisible(false)}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalConfirm} onPress={handleSignOut}>
                  <Text style={styles.modalConfirmText}>Sign Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)' },
  header: { paddingHorizontal: Spacing.md, paddingBottom: 8 },
  pageTitle: { fontSize: 28, fontWeight: '800', color: '#FFFFFF' },
  avatarSection: { alignItems: 'center', paddingVertical: 28 },
  avatarRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2.5,
    borderColor: '#FFD700',
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarImage: { width: '100%', height: '100%' },
  avatarFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,215,0,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: { fontSize: 32, fontWeight: '800', color: '#FFD700' },
  userName: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  userEmail: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 12 },
  memberBadge: {
    backgroundColor: 'rgba(255,215,0,0.12)',
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.4)',
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  memberBadgeText: { fontSize: 11, fontWeight: '700', color: '#FFD700', letterSpacing: 2 },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.md,
    marginBottom: 24,
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(12,12,12,0.88)',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.12)',
    alignItems: 'center',
    paddingVertical: 14,
  },
  statValue: { fontSize: 22, fontWeight: '800', color: '#FFD700', marginBottom: 3 },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.45)' },
  menu: { marginHorizontal: Spacing.md, gap: 6, marginBottom: 24 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(12,12,12,0.88)',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.1)',
    padding: 16,
    gap: 14,
  },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.md,
    paddingVertical: 14,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,68,68,0.3)',
    backgroundColor: 'rgba(255,68,68,0.06)',
    gap: 8,
  },
  signOutText: { fontSize: 15, fontWeight: '700', color: '#FF4444' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalBox: {
    backgroundColor: '#111',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.2)',
    padding: 24,
    width: 300,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 },
  modalMsg: { fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 20 },
  modalActions: { flexDirection: 'row', gap: 10 },
  modalCancel: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },
  modalCancelText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  modalConfirm: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(255,68,68,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,68,68,0.4)',
    alignItems: 'center',
  },
  modalConfirmText: { fontSize: 14, fontWeight: '600', color: '#FF4444' },
});

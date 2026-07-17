import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BG_IMAGE_URI, Spacing, Radius } from '../constants/theme';

type DeviceType = 'phone' | 'tablet' | 'desktop' | 'tv';

type Device = {
  id: string;
  name: string;
  type: DeviceType;
  os: string;
  lastActive: string;
  location: string;
  isCurrent: boolean;
};

const DEVICE_ICONS: Record<DeviceType, string> = {
  phone: 'phone-android',
  tablet: 'tablet',
  desktop: 'computer',
  tv: 'tv',
};

const initialDevices: Device[] = [
  { id: 'd1', name: 'My iPhone 15 Pro', type: 'phone', os: 'iOS 17.4', lastActive: 'Active now', location: 'Manila, PH', isCurrent: true },
  { id: 'd2', name: 'Samsung Galaxy Tab S9', type: 'tablet', os: 'Android 14', lastActive: '2 hours ago', location: 'Manila, PH', isCurrent: false },
  { id: 'd3', name: 'MacBook Pro', type: 'desktop', os: 'macOS Sonoma', lastActive: '1 day ago', location: 'Quezon City, PH', isCurrent: false },
];

export default function DevicesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [devices, setDevices] = useState<Device[]>(initialDevices);

  function removeDevice(id: string) {
    if (Platform.OS !== 'web') {
      Alert.alert(
        'Remove Device',
        'This device will be signed out. Are you sure?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', style: 'destructive', onPress: () => setDevices((prev) => prev.filter((d) => d.id !== id)) },
        ]
      );
    } else {
      setDevices((prev) => prev.filter((d) => d.id !== id));
    }
  }

  function removeAll() {
    setDevices((prev) => prev.filter((d) => d.isCurrent));
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: BG_IMAGE_URI }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color="#FFD700" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Manage Devices</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Info banner */}
        <View style={styles.infoBanner}>
          <MaterialIcons name="security" size={20} color="#4AABFF" />
          <Text style={styles.infoText}>
            You are signed in on {devices.length} device{devices.length !== 1 ? 's' : ''}. Remove unfamiliar devices immediately.
          </Text>
        </View>

        {/* Device list */}
        <View style={styles.list}>
          {devices.map((device) => (
            <View key={device.id} style={[styles.deviceCard, device.isCurrent && styles.deviceCardCurrent]}>
              <View style={[styles.deviceIcon, device.isCurrent && styles.deviceIconCurrent]}>
                <MaterialIcons name={DEVICE_ICONS[device.type] as any} size={24} color={device.isCurrent ? '#FFD700' : 'rgba(255,255,255,0.5)'} />
              </View>
              <View style={styles.deviceInfo}>
                <View style={styles.deviceNameRow}>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  {device.isCurrent ? (
                    <View style={styles.currentBadge}><Text style={styles.currentBadgeText}>This Device</Text></View>
                  ) : null}
                </View>
                <Text style={styles.deviceOs}>{device.os}</Text>
                <View style={styles.deviceMeta}>
                  <MaterialIcons name="access-time" size={11} color="rgba(255,255,255,0.35)" />
                  <Text style={styles.deviceMetaText}>{device.lastActive}</Text>
                  <Text style={styles.deviceMetaDot}>·</Text>
                  <MaterialIcons name="location-on" size={11} color="rgba(255,255,255,0.35)" />
                  <Text style={styles.deviceMetaText}>{device.location}</Text>
                </View>
              </View>
              {!device.isCurrent ? (
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => removeDevice(device.id)}
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="logout" size={18} color="#FF4444" />
                </TouchableOpacity>
              ) : null}
            </View>
          ))}
        </View>

        {/* Remove all others */}
        {devices.filter((d) => !d.isCurrent).length > 0 ? (
          <TouchableOpacity style={styles.removeAllBtn} onPress={removeAll} activeOpacity={0.82}>
            <MaterialIcons name="devices-other" size={16} color="#FF4444" />
            <Text style={styles.removeAllText}>Sign Out of All Other Devices</Text>
          </TouchableOpacity>
        ) : null}

        <Text style={styles.footerNote}>
          If you don't recognize a device, remove it and change your password immediately.
        </Text>
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
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginHorizontal: Spacing.md,
    marginBottom: 16,
    backgroundColor: 'rgba(74,171,255,0.08)',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(74,171,255,0.2)',
    padding: 14,
  },
  infoText: { flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 18 },
  list: { paddingHorizontal: Spacing.md, gap: 10, marginBottom: 16 },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10,10,10,0.9)',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.1)',
    padding: 14,
    gap: 12,
  },
  deviceCardCurrent: { borderColor: 'rgba(255,215,0,0.3)', backgroundColor: 'rgba(255,215,0,0.04)' },
  deviceIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  deviceIconCurrent: { backgroundColor: 'rgba(255,215,0,0.1)' },
  deviceInfo: { flex: 1 },
  deviceNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  deviceName: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', flexShrink: 1 },
  currentBadge: { backgroundColor: 'rgba(68,255,136,0.15)', borderRadius: 4, paddingHorizontal: 7, paddingVertical: 2 },
  currentBadgeText: { fontSize: 10, fontWeight: '700', color: '#44FF88' },
  deviceOs: { fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 5 },
  deviceMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  deviceMetaText: { fontSize: 11, color: 'rgba(255,255,255,0.35)' },
  deviceMetaDot: { fontSize: 11, color: 'rgba(255,255,255,0.2)' },
  removeBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  removeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.md,
    paddingVertical: 14,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,68,68,0.3)',
    backgroundColor: 'rgba(255,68,68,0.05)',
    gap: 8,
    marginBottom: 16,
  },
  removeAllText: { fontSize: 14, fontWeight: '700', color: '#FF4444' },
  footerNote: { fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center', paddingHorizontal: Spacing.xl, lineHeight: 18 },
});

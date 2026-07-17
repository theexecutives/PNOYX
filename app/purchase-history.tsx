import React, { useState } from 'react';
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

type TxType = 'topup' | 'rental' | 'bonus';

type Transaction = {
  id: string;
  type: TxType;
  title: string;
  subtitle: string;
  amount: string;
  coins: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
};

const MOCK_TXS: Transaction[] = [
  { id: 't1', type: 'bonus', title: 'Welcome Bonus', subtitle: 'New account credit', amount: '₱0.00', coins: '+₱29.00', date: 'Jul 17, 2026', status: 'completed' },
  { id: 't2', type: 'topup', title: 'Top Up — 100 Coins', subtitle: 'GCash payment', amount: '₱110.00', coins: '+100', date: 'Jul 15, 2026', status: 'completed' },
  { id: 't3', type: 'rental', title: 'Anino ng Gabi', subtitle: '36-hour rental · Episode 1', amount: '6 coins', coins: '-6', date: 'Jul 15, 2026', status: 'completed' },
  { id: 't4', type: 'rental', title: 'Bituin ng Maynila', subtitle: '36-hour rental · Full film', amount: '12 coins', coins: '-12', date: 'Jul 14, 2026', status: 'completed' },
  { id: 't5', type: 'topup', title: 'Top Up — 50 Coins', subtitle: 'Maya payment', amount: '₱55.00', coins: '+50', date: 'Jul 10, 2026', status: 'completed' },
];

const TX_ICONS: Record<TxType, { icon: string; color: string }> = {
  topup: { icon: 'account-balance-wallet', color: '#44FF88' },
  rental: { icon: 'play-circle-outline', color: '#FFD700' },
  bonus: { icon: 'redeem', color: '#4AABFF' },
};

export default function PurchaseHistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | TxType>('all');

  const filtered = filter === 'all' ? MOCK_TXS : MOCK_TXS.filter((t) => t.type === filter);

  return (
    <View style={styles.container}>
      <Image source={{ uri: BG_IMAGE_URI }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color="#FFD700" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Purchase History</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Summary */}
        <View style={styles.summaryRow}>
          {[
            { label: 'Total Spent', value: '₱165.00' },
            { label: 'Coins Earned', value: '179' },
            { label: 'Rentals', value: '2' },
          ].map((s) => (
            <View key={s.label} style={styles.summaryBox}>
              <Text style={styles.summaryValue}>{s.value}</Text>
              <Text style={styles.summaryLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.md, gap: 8, marginBottom: 16 }}>
          {(['all', 'topup', 'rental', 'bonus'] as const).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
              onPress={() => setFilter(f)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f === 'all' ? 'All' : f === 'topup' ? 'Top Ups' : f === 'rental' ? 'Rentals' : 'Bonuses'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Transaction list */}
        <View style={styles.txList}>
          {filtered.map((tx) => {
            const icon = TX_ICONS[tx.type];
            const isDebit = tx.coins.startsWith('-');
            return (
              <View key={tx.id} style={styles.txCard}>
                <View style={[styles.txIcon, { borderColor: icon.color + '44' }]}>
                  <MaterialIcons name={icon.icon as any} size={20} color={icon.color} />
                </View>
                <View style={styles.txBody}>
                  <Text style={styles.txTitle}>{tx.title}</Text>
                  <Text style={styles.txSub}>{tx.subtitle}</Text>
                  <Text style={styles.txDate}>{tx.date}</Text>
                </View>
                <View style={styles.txRight}>
                  <Text style={[styles.txCoins, { color: isDebit ? '#FF6B6B' : '#44FF88' }]}>{tx.coins}</Text>
                  <Text style={styles.txAmount}>{tx.amount}</Text>
                  <View style={[styles.statusDot, { backgroundColor: tx.status === 'completed' ? '#44FF88' : tx.status === 'pending' ? '#FFD700' : '#FF4444' }]} />
                </View>
              </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: 16,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  pageTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  summaryRow: { flexDirection: 'row', marginHorizontal: Spacing.md, gap: 10, marginBottom: 16 },
  summaryBox: {
    flex: 1,
    backgroundColor: 'rgba(12,12,12,0.9)',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.15)',
    alignItems: 'center',
    paddingVertical: 14,
  },
  summaryValue: { fontSize: 18, fontWeight: '800', color: '#FFD700', marginBottom: 3 },
  summaryLabel: { fontSize: 10, color: 'rgba(255,255,255,0.4)' },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  filterBtnActive: { backgroundColor: '#FFD700', borderColor: '#FFD700' },
  filterText: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.6)' },
  filterTextActive: { color: '#000' },
  txList: { paddingHorizontal: Spacing.md, gap: 10 },
  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10,10,10,0.9)',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.1)',
    padding: 14,
    gap: 12,
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,215,0,0.07)',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  txBody: { flex: 1 },
  txTitle: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', marginBottom: 3 },
  txSub: { fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 2 },
  txDate: { fontSize: 11, color: 'rgba(255,255,255,0.3)' },
  txRight: { alignItems: 'flex-end', gap: 4 },
  txCoins: { fontSize: 15, fontWeight: '800' },
  txAmount: { fontSize: 11, color: 'rgba(255,255,255,0.4)' },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
});

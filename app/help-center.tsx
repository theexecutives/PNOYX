import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BG_IMAGE_URI, Spacing, Radius } from '../constants/theme';

type FAQItem = { q: string; a: string; category: string };

const FAQS: FAQItem[] = [
  { category: 'Playback', q: 'Why is the video buffering or not playing?', a: 'Check your internet connection speed. We recommend at least 5 Mbps for standard quality and 15 Mbps for HD. Try closing other apps and restarting the player.' },
  { category: 'Playback', q: 'Video quality is low — how do I improve it?', a: 'Tap the settings icon (⚙️) in the player and select a higher resolution. Note: higher resolutions require faster internet speeds.' },
  { category: 'Playback', q: 'The video stops after 1 minute 20 seconds. Why?', a: 'For non-purchased premium episodes, the preview is limited to 80 seconds. To continue watching, tap "Unlock Full Episode" and purchase access with your PNOYX coins.' },
  { category: 'Rental Window', q: 'How long can I watch a rental?', a: 'Once you unlock a premium title, you have a 36-hour window to watch it as many times as you like. After 36 hours, the content locks and a new purchase is required.' },
  { category: 'Rental Window', q: 'When does my 36-hour window start?', a: 'The window starts the moment you confirm your coin purchase, not when you press play. Plan your watch time accordingly.' },
  { category: 'Rental Window', q: 'Can I extend my rental window?', a: 'Currently rental extensions are not available. You can purchase access again at the standard coin price to restart your 36-hour window.' },
  { category: 'Coins', q: 'How do I top up my coin wallet?', a: 'Go to Profile → PNOYX Coins → Top Up. Select a preset amount or enter a custom amount between 60–1000 coins. We accept GCash, Maya, and major credit cards via PayMongo.' },
  { category: 'Coins', q: 'Why did I receive bonus coins?', a: 'We offer bonus coins for larger top-up amounts. The more you top up, the more bonus coins you receive. New accounts also receive a ₱29.00 welcome credit.' },
  { category: 'Account', q: 'How do I reset my password?', a: 'On the sign-in screen, tap "Forgot Password?" and enter your email. You will receive a reset link within a few minutes.' },
  { category: 'Account', q: 'How do I remove a device from my account?', a: 'Go to Profile → Manage Devices. You will see all devices currently logged into your account. Tap "Remove" next to any device you want to disconnect.' },
];

const CATEGORIES = ['All', 'Playback', 'Rental Window', 'Coins', 'Account'];

export default function HelpCenterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = activeCategory === 'All' ? FAQS : FAQS.filter((f) => f.category === activeCategory);

  function toggle(i: number) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenIndex(openIndex === i ? null : i);
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
          <Text style={styles.pageTitle}>Help Center</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Search hint */}
        <View style={styles.searchHint}>
          <MaterialIcons name="support-agent" size={32} color="#FFD700" />
          <View>
            <Text style={styles.hintTitle}>How can we help?</Text>
            <Text style={styles.hintSub}>Browse common questions below or email support@pnoyx.com</Text>
          </View>
        </View>

        {/* Category filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.md, gap: 8, marginBottom: 16 }}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catBtn, activeCategory === cat && styles.catBtnActive]}
              onPress={() => { setActiveCategory(cat); setOpenIndex(null); }}
              activeOpacity={0.8}
            >
              <Text style={[styles.catBtnText, activeCategory === cat && styles.catBtnTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* FAQs */}
        <View style={styles.faqList}>
          {filtered.map((item, i) => (
            <TouchableOpacity key={i} style={styles.faqItem} onPress={() => toggle(i)} activeOpacity={0.84}>
              <View style={styles.faqQuestion}>
                <Text style={styles.faqQ} numberOfLines={openIndex === i ? undefined : 2}>{item.q}</Text>
                <MaterialIcons
                  name={openIndex === i ? 'expand-less' : 'expand-more'}
                  size={22}
                  color="#FFD700"
                />
              </View>
              {openIndex === i ? (
                <Text style={styles.faqA}>{item.a}</Text>
              ) : null}
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact */}
        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Still need help?</Text>
          <Text style={styles.contactText}>Contact us at support@pnoyx.com and we will respond within 24 hours.</Text>
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
  searchHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginHorizontal: Spacing.md,
    marginBottom: 20,
    backgroundColor: 'rgba(255,215,0,0.07)',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.2)',
    padding: 16,
  },
  hintTitle: { fontSize: 15, fontWeight: '700', color: '#FFFFFF', marginBottom: 3 },
  hintSub: { fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 16 },
  catBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  catBtnActive: { backgroundColor: '#FFD700', borderColor: '#FFD700' },
  catBtnText: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.6)' },
  catBtnTextActive: { color: '#000' },
  faqList: { paddingHorizontal: Spacing.md, gap: 8, marginBottom: 20 },
  faqItem: {
    backgroundColor: 'rgba(10,10,10,0.9)',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.12)',
    padding: 16,
  },
  faqQuestion: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },
  faqQ: { flex: 1, fontSize: 14, fontWeight: '600', color: '#FFFFFF', lineHeight: 20 },
  faqA: { fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 20, marginTop: 12 },
  contactCard: {
    marginHorizontal: Spacing.md,
    backgroundColor: 'rgba(10,10,10,0.9)',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.15)',
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  contactTitle: { fontSize: 16, fontWeight: '700', color: '#FFD700' },
  contactText: { fontSize: 13, color: 'rgba(255,255,255,0.5)', textAlign: 'center', lineHeight: 18 },
});

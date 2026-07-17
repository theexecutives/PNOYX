import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'gold' | 'free' | 'premium' | 'new';
  size?: 'sm' | 'md';
}

const VARIANT_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  gold: { bg: 'rgba(255,215,0,0.15)', text: '#FFD700', border: 'rgba(255,215,0,0.4)' },
  free: { bg: 'rgba(68,255,136,0.12)', text: '#44FF88', border: 'rgba(68,255,136,0.3)' },
  premium: { bg: 'rgba(255,165,0,0.15)', text: '#FFA500', border: 'rgba(255,165,0,0.35)' },
  new: { bg: 'rgba(255,68,68,0.14)', text: '#FF4444', border: 'rgba(255,68,68,0.35)' },
};

export function Badge({ label, variant = 'gold', size = 'sm' }: BadgeProps) {
  const v = VARIANT_STYLES[variant] ?? VARIANT_STYLES.gold;
  const isSmall = size === 'sm';
  return (
    <View style={[styles.badge, { backgroundColor: v.bg, borderColor: v.border }, isSmall ? styles.sm : styles.md]}>
      <Text style={[styles.text, { color: v.text }, isSmall ? styles.textSm : styles.textMd]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  sm: { paddingHorizontal: 8, paddingVertical: 3 },
  md: { paddingHorizontal: 12, paddingVertical: 5 },
  text: { fontWeight: '700', letterSpacing: 0.5 },
  textSm: { fontSize: 10 },
  textMd: { fontSize: 12 },
});

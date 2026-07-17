import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface StarRatingProps {
  rating: number; // 0–5
  size?: number;
  showNumber?: boolean;
}

export function StarRating({ rating, size = 14, showNumber = true }: StarRatingProps) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;

  return (
    <View style={styles.row}>
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) return <MaterialIcons key={i} name="star" size={size} color="#FFD700" />;
        if (i === full && half) return <MaterialIcons key={i} name="star-half" size={size} color="#FFD700" />;
        return <MaterialIcons key={i} name="star-border" size={size} color="rgba(255,215,0,0.35)" />;
      })}
      {showNumber && (
        <Text style={[styles.num, { fontSize: size }]}>{rating.toFixed(1)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  num: { color: '#FFD700', fontWeight: '700', marginLeft: 4 },
});

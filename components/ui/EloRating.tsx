import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';

interface EloRatingProps {
  rating?: number;
  recentChange?: number;
  style?: StyleProp<ViewStyle>;
}

export function EloRating({ rating = 1000, recentChange = 0, style }: EloRatingProps) {
  const getRatingColor = (): StyleProp<TextStyle> => {
    if (recentChange === 0) return styles.neutral;
    return recentChange > 0 ? styles.positive : styles.negative;
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.ratingText}>{rating}</Text>
      {recentChange !== 0 && (
        <Text style={[styles.changeText, getRatingColor()]}>
          ({recentChange > 0 ? "+" : ""}{recentChange})
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'baseline',
    padding: 8,
    backgroundColor: '#1F2937', // Example background, adjust as needed
    borderRadius: 8,
  },
  ratingText: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontSize: 16,
  },
  changeText: {
    marginLeft: 4,
    fontSize: 14,
  },
  neutral: {
    color: '#9CA3AF', // Gray-400
  },
  positive: {
    color: '#4ADE80', // Green-400
  },
  negative: {
    color: '#F87171', // Red-400
  },
}); 
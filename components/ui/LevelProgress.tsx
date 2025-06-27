import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

// --- Mocks & Placeholders ---
// In your real app, you would import these from "@/lib/level-system"
const mockLevelSystem = {
    getLevelFromXP: (xp: number) => ({
        level: 7,
        badge: "🛠️",
        title: "Journeyman",
        perks: ["+20 Coins/Win", "Unlock Duels", "Custom Avatar Border"]
    }),
    getNextLevel: (xp: number) => ({
        title: "Artisan",
        minXP: 10000
    }),
    getXPProgress: (xp: number) => (xp / 10000) * 100,
};

const { getLevelFromXP, getNextLevel, getXPProgress } = mockLevelSystem;

// --- Custom Progress Bar ---
const Progress = ({ value, style }: { value: number; style?: any }) => (
    <View style={[styles.progressTrack, style]}>
        <View style={[styles.progressIndicator, { width: `${value}%` }]} />
    </View>
);

// --- Custom Badge ---
const Badge = ({ children, style, textStyle }: { children: React.ReactNode; style?: any; textStyle?: any }) => (
    <View style={[styles.badge, style]}>
        <Text style={[styles.badgeText, textStyle]}>{children}</Text>
    </View>
);

interface LevelProgressProps {
  currentXP: number;
  className?: any; // Use `any` for className to accept style objects from parent
}

export function LevelProgress({ currentXP = 0, className }: LevelProgressProps) {
  const currentLevel = getLevelFromXP(currentXP);
  const nextLevel = getNextLevel(currentXP);
  const progress = getXPProgress(currentXP);
  const xpToNext = nextLevel ? nextLevel.minXP - currentXP : 0;

  return (
    <View style={[styles.card, className]}>
      {/* Header section */}
      <View style={styles.header}>
        <View style={styles.levelInfo}>
          <Text style={styles.levelBadgeIcon}>{currentLevel.badge}</Text>
          <View>
            <Text style={styles.levelTitle}>{currentLevel.title}</Text>
            <Text style={styles.levelSubtitle}>Level {currentLevel.level}</Text>
          </View>
        </View>
        <Badge style={styles.xpBadge} textStyle={styles.xpBadgeText}>
          <Icon name="star" size={12} color="#000" style={{ marginRight: 4 }} />
          {(currentXP || 0).toLocaleString()} XP
        </Badge>
      </View>

      {/* Progress section */}
      <View style={styles.progressSection}>
        <View style={styles.progressLabels}>
          <Text style={styles.progressLabelText}>Progress to {nextLevel?.title || "Max Level"}</Text>
          <Text style={styles.progressValueText}>
            {nextLevel ? `${xpToNext.toLocaleString()} XP to go` : "Max Level Reached!"}
          </Text>
        </View>
        <Progress value={progress} style={{height: 12}}/>
      </View>

      {/* Perks section */}
      {currentLevel.perks.length > 0 && (
        <View style={styles.perksSection}>
          <Text style={styles.perksTitle}>Level Perks:</Text>
          <View style={styles.perksContainer}>
            {currentLevel.perks.slice(0, 2).map((perk, index) => (
              <Badge key={index} style={styles.perkBadge} textStyle={styles.perkBadgeText}>
                {perk}
              </Badge>
            ))}
            {currentLevel.perks.length > 2 && (
              <Badge style={styles.perkBadge} textStyle={styles.perkBadgeText}>
                +{currentLevel.perks.length - 2} more
              </Badge>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1F2937',
        borderRadius: 12,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    levelInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    levelBadgeIcon: {
        fontSize: 28,
        marginRight: 12,
    },
    levelTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    levelSubtitle: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    xpBadge: {
        backgroundColor: '#A3E635',
        flexDirection: 'row',
        alignItems: 'center',
    },
    xpBadgeText: {
        color: '#000',
    },
    progressSection: {
        marginBottom: 12,
    },
    progressLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    progressLabelText: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    progressValueText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFF',
    },
    progressTrack: {
        backgroundColor: '#374151',
        borderRadius: 9999,
        height: 12,
        width: '100%',
        overflow: 'hidden',
    },
    progressIndicator: {
        backgroundColor: '#A3E635',
        height: '100%',
        borderRadius: 9999,
    },
    perksSection: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderColor: '#374151',
    },
    perksTitle: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 8,
    },
    perksContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    perkBadge: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#4B5563',
        marginRight: 6,
        marginBottom: 6,
    },
    perkBadgeText: {
        color: '#D1D5DB',
        fontSize: 12,
    },
    // Generic Badge styles
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '500'
    },
}); 
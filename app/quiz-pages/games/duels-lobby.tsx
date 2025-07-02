import { Feather, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from 'expo-router';
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QuizNavBar from "../../../components/QuizNavBar";
import { AnimatedCounter } from "../../../components/ui/AnimatedCounter"; // Assuming AnimatedCounter is in ui/components

// Color palette from tailwind.config.ts
const colors = {
  "mango-green": "#9BEC00",
  "mango-green-foreground": "#000000",
  "royal-red": "#CC0066",
  "royal-red-foreground": "#FFFFFF",
  "brilliant-azure": "#2FBEFF",
  background: "#242620", // Assuming a dark background
  foreground: "#f8fafc",
  "muted-foreground": "#94a3b8",
  border: "#334155",
  card: "#1e293b",
};

const difficultyLevels = [
  {
    id: "beginner",
    title: "Beginner",
    subtitle: "Basic trading concepts",
    color: colors["mango-green"],
    bgColor: "rgba(155, 236, 0, 0.1)",
    borderColor: "rgba(155, 236, 0, 0.2)",
    xpRange: "25-50 XP",
    eloRange: "800-1200",
    waitTime: "15s",
    activePlayers: 892,
  },
  {
    id: "intermediate",
    title: "Intermediate",
    subtitle: "Advanced strategies",
    color: colors["brilliant-azure"],
    bgColor: "rgba(47, 190, 255, 0.1)",
    borderColor: "rgba(47, 190, 255, 0.2)",
    xpRange: "50-100 XP",
    eloRange: "1200-1800",
    waitTime: "30s",
    activePlayers: 634,
    isRecommended: true,
  },
  {
    id: "expert",
    title: "Expert",
    subtitle: "Professional level",
    color: colors["royal-red"],
    bgColor: "rgba(204, 0, 102, 0.1)",
    borderColor: "rgba(204, 0, 102, 0.2)",
    xpRange: "100-200 XP",
    eloRange: "1800+",
    waitTime: "45s",
    activePlayers: 247,
  },
];

const recentOpponents = [
  {
    id: 1,
    name: "Alex_Trader",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    elo: 1756,
    winRate: 68,
    lastResult: "loss",
  },
  {
    id: 2,
    name: "MarketMaster",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
    elo: 1923,
    winRate: 74,
    lastResult: "win",
  },
  {
    id: 3,
    name: "TradingPro",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f",
    elo: 1634,
    winRate: 61,
    lastResult: "win",
  },
];

export default function DuelsLobbyScreen() {
  const [selectedDifficulty, setSelectedDifficulty] = useState("intermediate");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleQuickMatch = () => {
    setIsSearching(true);
    // Simulate matchmaking and navigation
    setTimeout(() => {
      setIsSearching(false);
      // navigation.navigate('LiveDuel');
      router.push('/quiz-pages/live-duel');
    }, 2000);
  };

  const handleSelectDifficulty = (difficultyId: string) => {
    setSelectedDifficulty(difficultyId);
    // Navigate to a specific lobby
    setTimeout(() => {
      router.push(`/quiz-pages/duel-lobby?difficulty=${difficultyId}`);
    }, 500);
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false
        }}
      />
      <QuizNavBar />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="arrow-left" size={24} color={colors.foreground} />
            </TouchableOpacity>
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.headerTitle}>1v1 Duels</Text>
              <Text style={styles.headerSubtitle}>Challenge traders worldwide</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => alert("Settings")}>
            <Feather name="settings" size={20} color={colors["muted-foreground"]} />
          </TouchableOpacity>
        </View>

        {/* Player Stats */}
        <View style={styles.playerStatsCard}>
          <View style={styles.playerInfo}>
            <View style={styles.playerInfoLeft}>
              <Image source={{ uri: "https://i.pravatar.cc/150?u=a042581f4e29026704a" }} style={styles.avatar} />
              <View>
                <Text style={styles.playerName}>TradeVed Pro</Text>
                <Text style={styles.playerLevel}>Level 24 • Elite Trader</Text>
              </View>
            </View>
            <View style={styles.eloContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AnimatedCounter value={1842} style={styles.eloText} />
                <MaterialCommunityIcons name="trending-up" size={18} color={colors["mango-green"]} style={{ marginLeft: 4 }} />
              </View>
              <Text style={styles.eloLabel}>ELO Rating</Text>
            </View>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors["mango-green"] }]}>156</Text>
              <Text style={styles.statLabel}>Wins</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors["royal-red"] }]}>89</Text>
              <Text style={styles.statLabel}>Losses</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors["brilliant-azure"] }]}>64%</Text>
              <Text style={styles.statLabel}>Win Rate</Text>
            </View>
          </View>
        </View>

        {/* Quick Match Button */}
        <TouchableOpacity onPress={handleQuickMatch} disabled={isSearching} style={styles.quickMatchButton}>
          {isSearching ? (
            <>
              <ActivityIndicator size="small" color="#000" style={{ marginRight: 12 }} />
              <Text style={styles.quickMatchButtonText}>Finding Opponent...</Text>
            </>
          ) : (
            <>
              <Feather name="play" size={24} color="#000" style={{ marginRight: 12 }} />
              <Text style={styles.quickMatchButtonText}>Quick Match</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Difficulty Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Difficulty</Text>
          {difficultyLevels.map((level) => (
            <TouchableOpacity key={level.id} onPress={() => handleSelectDifficulty(level.id)} style={[
              styles.difficultyCard,
              { backgroundColor: level.bgColor, borderColor: level.borderColor },
              selectedDifficulty === level.id && { borderWidth: 2, borderColor: colors["mango-green"] }
            ]}>
              <View style={styles.difficultyHeader}>
                <View style={styles.difficultyTitleContainer}>
                  <Text style={styles.difficultyTitle}>{level.title}</Text>
                  {level.isRecommended && (
                    <View style={styles.recommendedBadge}>
                      <FontAwesome5 name="crown" size={12} color={colors["mango-green-foreground"]} style={{ marginRight: 4 }} />
                      <Text style={styles.recommendedText}>Recommended</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.xpRange}>{level.xpRange}</Text>
              </View>
              <Text style={styles.difficultySubtitle}>{level.subtitle}</Text>
              <View style={styles.difficultyDetailsGrid}>
                <View style={styles.difficultyDetailItem}>
                  <Text style={styles.detailLabel}>ELO Range</Text>
                  <Text style={styles.detailValue}>{level.eloRange}</Text>
                </View>
                <View style={styles.difficultyDetailItem}>
                  <Text style={styles.detailLabel}>Wait Time</Text>
                  <Text style={styles.detailValue}>{level.waitTime}</Text>
                </View>
                <View style={styles.difficultyDetailItem}>
                  <Text style={styles.detailLabel}>Active</Text>
                  <Text style={styles.detailValue}>{level.activePlayers}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Opponents */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Opponents</Text>
          {recentOpponents.map((opponent) => (
            <View key={opponent.id} style={styles.opponentCard}>
              <View style={styles.opponentInfo}>
                <Image source={{ uri: opponent.avatar }} style={styles.opponentAvatar} />
                <View>
                  <Text style={styles.opponentName}>{opponent.name}</Text>
                  <Text style={styles.opponentStats}>ELO: {opponent.elo} • Win Rate: {opponent.winRate}%</Text>
                </View>
              </View>
              <View style={styles.opponentActions}>
                <View style={[styles.resultBadge, { backgroundColor: opponent.lastResult === 'win' ? colors['mango-green'] : colors['royal-red'] }]}>
                  <Text style={[styles.resultBadgeText, { color: opponent.lastResult === 'win' ? colors['mango-green-foreground'] : colors['royal-red-foreground'] }]}>
                    {opponent.lastResult === 'win' ? 'W' : 'L'}
                  </Text>
                </View>
                <TouchableOpacity style={styles.rematchButton}>
                  <Feather name="zap" size={14} color={colors.foreground} style={{ marginRight: 4 }} />
                  <Text style={styles.rematchButtonText}>Rematch</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 16, paddingTop: 40 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: colors.foreground },
  headerSubtitle: { fontSize: 14, color: colors["muted-foreground"] },
  playerStatsCard: { backgroundColor: 'rgba(155, 236, 0, 0.05)', borderWidth: 1, borderColor: 'rgba(155, 236, 0, 0.2)', borderRadius: 12, padding: 16, marginBottom: 24 },
  playerInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  playerInfoLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: colors["mango-green"], marginRight: 12 },
  playerName: { fontSize: 16, fontWeight: 'bold', color: colors.foreground },
  playerLevel: { fontSize: 14, color: colors["muted-foreground"] },
  eloContainer: { alignItems: 'flex-end' },
  eloText: { fontSize: 22, fontWeight: 'bold', color: colors["mango-green"] },
  eloLabel: { fontSize: 12, color: colors["muted-foreground"] },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: 'rgba(155, 236, 0, 0.2)', marginTop: 16, paddingTop: 16 },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: colors["muted-foreground"], marginTop: 4 },
  quickMatchButton: { flexDirection: 'row', backgroundColor: colors["mango-green"], paddingVertical: 16, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  quickMatchButtonText: { color: colors["mango-green-foreground"], fontSize: 18, fontWeight: 'bold' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: colors.foreground, marginBottom: 16 },
  difficultyCard: { borderWidth: 1, borderRadius: 12, padding: 16, marginBottom: 12 },
  difficultyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  difficultyTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  difficultyTitle: { fontSize: 16, fontWeight: 'bold', color: colors.foreground },
  recommendedBadge: { flexDirection: 'row', backgroundColor: colors["mango-green"], borderRadius: 12, paddingVertical: 4, paddingHorizontal: 8, marginLeft: 8, alignItems: 'center' },
  recommendedText: { fontSize: 12, color: colors["mango-green-foreground"], fontWeight: 'bold' },
  xpRange: { fontSize: 14, fontWeight: '600', color: colors.foreground },
  difficultySubtitle: { fontSize: 14, color: colors["muted-foreground"], marginBottom: 12 },
  difficultyDetailsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  difficultyDetailItem: { flex: 1 },
  detailLabel: { fontSize: 12, color: colors["muted-foreground"] },
  detailValue: { fontSize: 14, color: colors.foreground, fontWeight: '500' },
  opponentCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.card, borderRadius: 12, padding: 12, marginBottom: 8 },
  opponentInfo: { flexDirection: 'row', alignItems: 'center' },
  opponentAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  opponentName: { fontSize: 15, fontWeight: '500', color: colors.foreground },
  opponentStats: { fontSize: 12, color: colors["muted-foreground"], marginTop: 2 },
  opponentActions: { flexDirection: 'row', alignItems: 'center' },
  resultBadge: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  resultBadgeText: { fontWeight: 'bold' },
  rematchButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10 },
  rematchButtonText: { color: colors.foreground, fontSize: 13, fontWeight: '500' },
});

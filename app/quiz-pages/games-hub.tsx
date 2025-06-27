import { FontAwesome5 } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QuizNavBar from "../../components/QuizNavBar";
import { Stack, useRouter } from 'expo-router';

const gameTypes = [
  {
    id: "duels",
    title: "1v1 Duels",
    subtitle: "Challenge traders worldwide",
    description: "Face off against other traders in real-time knowledge battles",
    icon: "bolt",
    color: "#22c55e",
    players: "2 Players",
    duration: "5-10 min",
    difficulty: "Medium",
    xpReward: "50-150 XP",
    isPopular: true,
    href: "/quiz-pages/games/duels-lobby",
    stats: {
      activePlayers: 1247,
      avgWaitTime: "30s",
    },
  },
  {
    id: "group-play",
    title: "Group Arena",
    subtitle: "Battle in teams of 4-8",
    description: "Join multiplayer rooms and compete with multiple traders",
    icon: "users",
    color: "#38bdf8",
    players: "4-8 Players",
    duration: "10-15 min",
    difficulty: "Hard",
    xpReward: "100-300 XP",
    isNew: true,
    href: "/quiz-pages/games/group-play-lobby",
    stats: {
      activePlayers: 892,
      avgWaitTime: "45s",
    },
  },
  {
    id: "time-attack",
    title: "Time Attack",
    subtitle: "Race against the clock",
    description: "Answer as many questions as possible within the time limit",
    icon: "clock",
    color: "#eab308",
    players: "Solo",
    duration: "3-5 min",
    difficulty: "Easy",
    xpReward: "25-100 XP",
    href: "/quiz-pages/games/time-attack-lobby",
    stats: {
      activePlayers: 2156,
      avgWaitTime: "Instant",
    },
  },
  {
    id: "fastest-finger",
    title: "Fastest Finger",
    subtitle: "Speed and accuracy combined",
    description: "Be the first to answer correctly in lightning-fast rounds",
    icon: "bullseye",
    color: "#ef4444",
    players: "2-12 Players",
    duration: "2-4 min",
    difficulty: "Expert",
    xpReward: "75-200 XP",
    isHot: true,
    href: "/quiz-pages/games/fastest-finger-lobby",
    stats: {
      activePlayers: 634,
      avgWaitTime: "1m",
    },
  },
];

const dailyChallenges = [
  {
    id: 1,
    title: "Options Master",
    description: "Complete 5 options trading questions",
    progress: 3,
    total: 5,
    reward: "250 XP",
    timeLeft: "18h 42m",
  },
  {
    id: 2,
    title: "Speed Demon",
    description: "Win 3 Fastest Finger rounds",
    progress: 1,
    total: 3,
    reward: "150 XP",
    timeLeft: "18h 42m",
  },
];

const AnimatedCounter = ({ value, style }: { value: number; style?: any }) => (
  <Text style={style}>{value}</Text>
);

const ProgressBar = ({ value }: { value: number }) => (
  <View style={styles.progressBarBackground}>
    <View style={[styles.progressBarFill, { width: `${value}%` }]} />
  </View>
);

const GamesHub: React.FC = () => {
  const [selectedGameType, setSelectedGameType] = useState<string | null>(null);
  const router = useRouter();

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
          <View style={styles.headerIconRow}>
            <FontAwesome5 name="gamepad" size={28} color="#22c55e" />
            <Text style={styles.headerTitle}>Game Arena</Text>
          </View>
          <Text style={styles.headerSubtitle}>Choose your battle, prove your trading skills</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statIconRow}>
              <FontAwesome5 name="trophy" size={16} color="#22c55e" style={{ marginRight: 4 }} />
              <AnimatedCounter value={156} style={styles.statValue} />
            </View>
            <Text style={styles.statLabel}>Games Won</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconRow}>
              <FontAwesome5 name="fire" size={16} color="#38bdf8" style={{ marginRight: 4 }} />
              <AnimatedCounter value={12} style={styles.statValue} />
            </View>
            <Text style={styles.statLabel}>Win Streak</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconRow}>
              <FontAwesome5 name="star" size={16} color="#eab308" style={{ marginRight: 4 }} />
              <AnimatedCounter value={1842} style={styles.statValue} />
            </View>
            <Text style={styles.statLabel}>Best Score</Text>
          </View>
        </View>

        {/* Game Types */}
        <Text style={styles.sectionTitle}>Choose Your Game</Text>
        {gameTypes.map((game) => {
          const isSelected = selectedGameType === game.id;
          return (
            <TouchableOpacity
              key={game.id}
              style={[styles.gameCard, isSelected && styles.gameCardSelected]}
              onPress={() => setSelectedGameType(game.id)}
            >
              <View style={styles.gameHeaderRow}>
                <View style={[styles.gameIconCircle, { backgroundColor: game.color + "20" }]}> 
                  <FontAwesome5 name={game.icon as any} size={24} color={game.color} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.gameTitle}>{game.title}</Text>
                    {game.isPopular && (
                      <View style={styles.badgePopular}>
                        <FontAwesome5 name="crown" size={12} color="#eab308" style={{ marginRight: 3 }} />
                        <Text style={styles.badgePopularText}>Popular</Text>
                      </View>
                    )}
                    {game.isNew && (
                      <View style={styles.badgeNew}>
                        <Text style={styles.badgeNewText}>New</Text>
                      </View>
                    )}
                    {game.isHot && (
                      <View style={styles.badgeHot}>
                        <FontAwesome5 name="fire" size={12} color="#ef4444" style={{ marginRight: 3 }} />
                        <Text style={styles.badgeHotText}>Hot</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.gameSubtitle}>{game.subtitle}</Text>
                </View>
              </View>
              <Text style={styles.gameDesc}>{game.description}</Text>
              <View style={styles.gameInfoRow}>
                <View style={styles.gameInfoBox}>
                  <FontAwesome5 name="users" size={14} color="#64748b" style={{ marginRight: 3 }} />
                  <Text style={styles.gameInfoText}>{game.players}</Text>
                </View>
                <View style={styles.gameInfoBox}>
                  <FontAwesome5 name="clock" size={14} color="#64748b" style={{ marginRight: 3 }} />
                  <Text style={styles.gameInfoText}>{game.duration}</Text>
                </View>
                <View style={styles.gameInfoBox}>
                  <FontAwesome5 name="bullseye" size={14} color="#64748b" style={{ marginRight: 3 }} />
                  <Text style={styles.gameInfoText}>{game.difficulty}</Text>
                </View>
                <View style={styles.gameInfoBox}>
                  <FontAwesome5 name="gift" size={14} color="#64748b" style={{ marginRight: 3 }} />
                  <Text style={styles.gameInfoText}>{game.xpReward}</Text>
                </View>
              </View>
              <View style={styles.gameStatsRow}>
                <View style={styles.gameStatsBox}>
                  <Text style={styles.gameStatsLabel}>Active Players</Text>
                  <Text style={styles.gameStatsValue}>{game.stats.activePlayers.toLocaleString()}</Text>
                </View>
                <View style={styles.gameStatsBox}>
                  <Text style={styles.gameStatsLabel}>Avg Wait</Text>
                  <Text style={styles.gameStatsValue}>{game.stats.avgWaitTime}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => router.push(game.href as any)}
              >
                <FontAwesome5 name="play" size={16} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.playButtonText}>Play Now</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}

        {/* Daily Challenges */}
        <Text style={styles.sectionTitle}>Daily Challenges</Text>
        {dailyChallenges.map((challenge) => (
          <View key={challenge.id} style={styles.challengeCard}>
            <View style={styles.challengeHeaderRow}>
              <Text style={styles.challengeTitle}>{challenge.title}</Text>
              <View style={styles.challengeRewardRow}>
                <FontAwesome5 name="gift" size={16} color="#22c55e" style={{ marginRight: 4 }} />
                <Text style={styles.challengeRewardText}>{challenge.reward}</Text>
              </View>
            </View>
            <Text style={styles.challengeDesc}>{challenge.description}</Text>
            <View style={styles.challengeProgressRow}>
              <Text style={styles.challengeProgressLabel}>Progress</Text>
              <Text style={styles.challengeProgressValue}>
                {challenge.progress}/{challenge.total}
              </Text>
            </View>
            <ProgressBar value={(challenge.progress / challenge.total) * 100} />
          </View>
        ))}

        {/* Recent Games */}
        <Text style={styles.sectionTitle}>Recent Games</Text>
        <View style={styles.recentGameCard}>
          <View style={styles.recentGameHeaderRow}>
            <View style={styles.recentGameTypeRow}>
              <FontAwesome5 name="bolt" size={16} color="#22c55e" style={{ marginRight: 4 }} />
              <Text style={styles.recentGameTypeText}>1v1 Duel</Text>
            </View>
            <View style={styles.recentGameBadge}>
              <FontAwesome5 name="chart-line" size={12} color="#22c55e" style={{ marginRight: 3 }} />
              <Text style={styles.recentGameBadgeText}>Victory</Text>
            </View>
          </View>
          <View style={styles.recentGamePlayersRow}>
            <View style={styles.recentGamePlayerBox}>
              <FontAwesome5 name="user" size={16} color="#64748b" />
              <Text style={styles.recentGamePlayerText}>You</Text>
            </View>
            <View style={styles.recentGameScoreBox}>
              <Text style={styles.recentGameScore}>8 - 5</Text>
              <Text style={styles.recentGameTopic}>Options Trading</Text>
            </View>
            <View style={styles.recentGamePlayerBox}>
              <Text style={styles.recentGamePlayerText}>Alex_T</Text>
              <FontAwesome5 name="user" size={16} color="#64748b" />
            </View>
          </View>
          <View style={styles.recentGameXPRow}>
            <Text style={styles.recentGameXPLabel}>XP Earned:</Text>
            <Text style={styles.recentGameXPValue}>+125 XP</Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 16 },
  header: { alignItems: "center", marginBottom: 16 },
  headerIconRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  headerTitle: { fontSize: 22, fontWeight: "bold", marginLeft: 8 },
  headerSubtitle: { color: "#64748b", fontSize: 14 },
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  statCard: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    alignItems: "center",
    padding: 12,
    marginHorizontal: 4,
  },
  statIconRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  statValue: { fontWeight: "bold", fontSize: 18 },
  statLabel: { fontSize: 12, color: "#64748b" },
  sectionTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 8 },
  gameCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  gameCardSelected: { borderColor: "#22c55e", backgroundColor: "#bbf7d0" },
  gameHeaderRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  gameIconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  gameTitle: { fontWeight: "bold", fontSize: 16, marginRight: 8 },
  badgePopular: { flexDirection: "row", alignItems: "center", backgroundColor: "#fef9c3", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 4 },
  badgePopularText: { color: "#eab308", fontWeight: "bold", fontSize: 13 },
  badgeNew: { backgroundColor: "#e0f2fe", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 4 },
  badgeNewText: { color: "#38bdf8", fontWeight: "bold", fontSize: 13 },
  badgeHot: { flexDirection: "row", alignItems: "center", backgroundColor: "#fee2e2", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 4 },
  badgeHotText: { color: "#ef4444", fontWeight: "bold", fontSize: 13 },
  gameSubtitle: { color: "#64748b", fontSize: 13 },
  gameDesc: { color: "#222", fontSize: 14, marginVertical: 8 },
  gameInfoRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 8 },
  gameInfoBox: { flexDirection: "row", alignItems: "center", marginRight: 12, marginBottom: 4 },
  gameInfoText: { color: "#64748b", fontSize: 12 },
  gameStatsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  gameStatsBox: { flex: 1, alignItems: "center" },
  gameStatsLabel: { color: "#64748b", fontSize: 12 },
  gameStatsValue: { fontWeight: "bold", fontSize: 14 },
  playButton: { flexDirection: "row", backgroundColor: "#22c55e", borderRadius: 10, alignItems: "center", justifyContent: "center", paddingVertical: 12, marginTop: 8 },
  playButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  challengeCard: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#e5e7eb" },
  challengeHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
  challengeTitle: { fontWeight: "bold", fontSize: 15 },
  challengeRewardRow: { flexDirection: "row", alignItems: "center" },
  challengeRewardText: { color: "#22c55e", fontWeight: "bold", fontSize: 14 },
  challengeDesc: { color: "#64748b", fontSize: 13, marginBottom: 8 },
  challengeProgressRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  challengeProgressLabel: { color: "#64748b", fontSize: 13 },
  challengeProgressValue: { fontWeight: "bold", fontSize: 13 },
  progressBarBackground: { width: "100%", height: 8, backgroundColor: "#e5e7eb", borderRadius: 4, overflow: "hidden", marginBottom: 8 },
  progressBarFill: { height: 8, backgroundColor: "#22c55e", borderRadius: 4 },
  recentGameCard: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#e5e7eb" },
  recentGameHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
  recentGameTypeRow: { flexDirection: "row", alignItems: "center" },
  recentGameTypeText: { color: "#22c55e", fontWeight: "bold", fontSize: 14 },
  recentGameBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#bbf7d0", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  recentGameBadgeText: { color: "#22c55e", fontWeight: "bold", fontSize: 13 },
  recentGamePlayersRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  recentGamePlayerBox: { flexDirection: "row", alignItems: "center" },
  recentGamePlayerText: { color: "#64748b", fontSize: 13, marginLeft: 4 },
  recentGameScoreBox: { alignItems: "center" },
  recentGameScore: { fontWeight: "bold", fontSize: 18 },
  recentGameTopic: { color: "#64748b", fontSize: 12 },
  recentGameXPRow: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderColor: "#bbf7d0", paddingTop: 8 },
  recentGameXPLabel: { color: "#64748b", fontSize: 13 },
  recentGameXPValue: { color: "#22c55e", fontWeight: "bold", fontSize: 14 },
});

export default GamesHub; 
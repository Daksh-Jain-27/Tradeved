import { Entypo, Feather, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QuizNavBar from "../../components/QuizNavBar";
import { Stack } from 'expo-router';

const headlines = [
  {
    id: 1,
    title: "Fed Raises Interest Rates by 0.75%",
    source: "Reuters",
    time: "2 hours ago",
    category: "Monetary Policy",
  },
  {
    id: 2,
    title: "Tesla Reports Record Q3 Deliveries",
    source: "Bloomberg",
    time: "4 hours ago",
    category: "Earnings",
  },
  {
    id: 3,
    title: "Oil Prices Surge on OPEC+ Production Cuts",
    source: "CNBC",
    time: "6 hours ago",
    category: "Commodities",
  },
];

const leaderboard = [
  { rank: 1, name: "Sarah Chen", score: 950, time: "2:34", accuracy: 95 },
  { rank: 2, name: "Mike Johnson", score: 920, time: "2:45", accuracy: 92 },
  { rank: 3, name: "Alex Morgan", score: 890, time: "2:52", accuracy: 89 },
  { rank: 4, name: "You", score: 0, time: "--", accuracy: 0, isYou: true },
  { rank: 5, name: "Emma Wilson", score: 0, time: "--", accuracy: 0 },
];

const AnimatedCounter = ({ value, style }: { value: number; style?: any }) => (
  <Text style={style}>{value}</Text>
);

const DailyChallenge: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(14 * 3600 + 23 * 60 + 45); // 14h 23m 45s

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${mins}m ${secs}s`;
  };

  return (
    <>
      <QuizNavBar />
      <Stack.Screen
        options={{
          headerShown: false
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconRow}>
            <MaterialCommunityIcons name="newspaper-variant-outline" size={28} color="#38bdf8" />
            <Text style={styles.headerTitle}>Daily Challenge</Text>
          </View>
          <Text style={styles.headerSubtitle}>Test your knowledge on today's financial news</Text>
        </View>

        {/* Challenge Info */}
        <View style={styles.cardBlue}>
          <Text style={styles.challengeTitle}>Today's Financial Duel</Text>
          <View style={styles.badgeRow}>
            <Entypo name="calendar" size={16} color="#38bdf8" style={{ marginRight: 4 }} />
            <Text style={styles.badgeText}>December 15, 2024</Text>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoBox}>
              <Feather name="clock" size={20} color="#eab308" style={{ marginBottom: 2 }} />
              <Text style={styles.infoLabel}>Time Left</Text>
              <Text style={[styles.infoValue, { color: "#eab308" }]}>{formatTime(timeLeft)}</Text>
            </View>
            <View style={styles.infoBox}>
              <Feather name="users" size={20} color="#22c55e" style={{ marginBottom: 2 }} />
              <Text style={styles.infoLabel}>Participants</Text>
              <Text style={[styles.infoValue, { color: "#22c55e" }]}>
                <AnimatedCounter value={1247} />
              </Text>
            </View>
          </View>
          <View style={styles.prizeBox}>
            <FontAwesome5 name="trophy" size={20} color="#eab308" style={{ marginBottom: 2 }} />
            <Text style={styles.infoLabel}>Today's Prize Pool</Text>
            <Text style={[styles.prizeValue, { color: "#eab308" }]}>₹5,000</Text>
          </View>
        </View>

        {/* Today's Headlines */}
        <View style={styles.cardWhite}>
          <Text style={styles.sectionTitle}>Today's Headlines</Text>
          {headlines.map((headline) => (
            <View key={headline.id} style={styles.headlineBox}>
              <View style={styles.headlineRow}>
                <View style={styles.headlineBadge}>
                  <Text style={styles.headlineBadgeText}>{headline.category}</Text>
                </View>
                <Text style={styles.headlineTime}>{headline.time}</Text>
              </View>
              <Text style={styles.headlineTitle}>{headline.title}</Text>
              <Text style={styles.headlineSource}>{headline.source}</Text>
            </View>
          ))}
        </View>

        {/* Start Challenge */}
        <TouchableOpacity
          style={styles.glowingButton}
          onPress={() => Alert.alert("Start Challenge", "Begin the daily challenge!")}
        >
          <Feather name="trending-up" size={24} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.glowingButtonText}>Start Challenge</Text>
        </TouchableOpacity>

        {/* Live Leaderboard */}
        <View style={styles.cardWhite}>
          <View style={styles.leaderboardHeader}>
            <FontAwesome5 name="trophy" size={18} color="#eab308" style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitle}>Live Rankings</Text>
          </View>
          <View style={{ maxHeight: 320 }}>
            {leaderboard.map((player) => (
              <View
                key={player.rank}
                style={[
                  styles.leaderboardRow,
                  player.isYou
                    ? styles.leaderboardRowYou
                    : styles.leaderboardRowOther,
                ]}
              >
                <View style={styles.leaderboardLeft}>
                  <View style={styles.rankCircle}>
                    <Text style={styles.rankText}>#{player.rank}</Text>
                  </View>
                  <View style={{ marginLeft: 8 }}>
                    <Text style={styles.playerName}>
                      {player.name}
                      {player.isYou && (
                        <Text style={styles.youBadge}>  You</Text>
                      )}
                    </Text>
                    <Text style={styles.playerAccuracy}>{player.accuracy}% accuracy</Text>
                  </View>
                </View>
                <View style={styles.leaderboardRight}>
                  <Text style={styles.playerScore}>{player.score}</Text>
                  <Text style={styles.playerTime}>{player.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#242620", padding: 16 },
  header: { alignItems: "center", marginBottom: 16 },
  headerIconRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  headerTitle: { fontSize: 22, fontWeight: "bold", marginLeft: 8 },
  headerSubtitle: { color: "#64748b", fontSize: 14 },
  cardBlue: {
    backgroundColor: "#e0f2fe",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#38bdf8",
    alignItems: "center",
  },
  challengeTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#bae6fd",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 12,
  },
  badgeText: { color: "#38bdf8", fontWeight: "bold", fontSize: 13 },
  infoGrid: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginBottom: 12 },
  infoBox: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    marginHorizontal: 4,
    padding: 10,
  },
  infoLabel: { fontSize: 12, color: "#64748b", marginTop: 2 },
  infoValue: { fontWeight: "bold", fontSize: 15, marginTop: 2 },
  prizeBox: {
    alignItems: "center",
    backgroundColor: "#fef9c3",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#fde68a",
    marginTop: 8,
    width: "100%",
  },
  prizeValue: { fontWeight: "bold", fontSize: 20, marginTop: 2 },
  cardWhite: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  sectionTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 8 },
  headlineBox: {
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  headlineRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 2 },
  headlineBadge: {
    backgroundColor: "#e0f2fe",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  headlineBadgeText: { color: "#38bdf8", fontSize: 11, fontWeight: "bold" },
  headlineTime: { color: "#64748b", fontSize: 11 },
  headlineTitle: { fontWeight: "bold", fontSize: 14, marginBottom: 2 },
  headlineSource: { color: "#64748b", fontSize: 12 },
  glowingButton: {
    flexDirection: "row",
    backgroundColor: "#22c55e",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    marginTop: 8,
    marginBottom: 16,
  },
  glowingButtonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  leaderboardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  leaderboardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 10,
    marginBottom: 6,
  },
  leaderboardRowYou: {
    backgroundColor: "#dbeafe",
    borderWidth: 1,
    borderColor: "#38bdf8",
  },
  leaderboardRowOther: {
    backgroundColor: "#f1f5f9",
  },
  leaderboardLeft: { flexDirection: "row", alignItems: "center" },
  rankCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e0f2fe",
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: { fontWeight: "bold", fontSize: 14, color: "#38bdf8" },
  playerName: { fontWeight: "bold", fontSize: 14 },
  youBadge: {
    color: "#22c55e",
    fontWeight: "bold",
    fontSize: 12,
    marginLeft: 4,
  },
  playerAccuracy: { color: "#64748b", fontSize: 12 },
  leaderboardRight: { alignItems: "flex-end" },
  playerScore: { fontWeight: "bold", fontSize: 16, color: "#22c55e" },
  playerTime: { color: "#64748b", fontSize: 12 },
});

export default DailyChallenge; 
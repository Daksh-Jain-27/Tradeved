import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import QuizNavBar from "../../components/QuizNavBar";
import { Stack } from 'expo-router';

const duelHistory = [
  {
    id: 1,
    opponent: "Sarah Chen",
    result: "win",
    score: "8-5",
    topic: "Options Trading",
    duration: "2:34",
    xpGained: 125,
    eloChange: +18,
    date: "2024-12-15",
    accuracy: 80,
  },
  {
    id: 2,
    opponent: "Mike Johnson",
    result: "loss",
    score: "4-7",
    topic: "Risk Management",
    duration: "3:12",
    xpGained: 50,
    eloChange: -12,
    date: "2024-12-15",
    accuracy: 57,
  },
  {
    id: 3,
    opponent: "AI Bot",
    result: "win",
    score: "9-3",
    topic: "Technical Analysis",
    duration: "1:45",
    xpGained: 100,
    eloChange: +8,
    date: "2024-12-14",
    accuracy: 90,
  },
  {
    id: 4,
    opponent: "Alex Morgan",
    result: "win",
    score: "6-4",
    topic: "Market Mechanics",
    duration: "4:22",
    xpGained: 110,
    eloChange: +15,
    date: "2024-12-14",
    accuracy: 75,
  },
];

const streakData = [
  { type: "Current Win Streak", value: 3, icon: "trophy", color: "#eab308" },
  { type: "Best Accuracy Streak", value: 5, icon: "target", color: "#22c55e" },
  { type: "Daily Login Streak", value: 12, icon: "calendar", color: "#38bdf8" },
  { type: "XP Combo Multiplier", value: "2.5x", icon: "zap", color: "#22c55e" },
];

const AnimatedCounter = ({ value, style }: { value: number; style?: any }) => (
  <Text style={style}>{value}</Text>
);

const DuelHistory: React.FC = () => {
  const [sortBy, setSortBy] = useState("recent");
  const [filterBy, setFilterBy] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState("duels");

  const getResultColor = (result: string) => {
    switch (result) {
      case "win":
        return { backgroundColor: "#bbf7d0", color: "#22c55e" };
      case "loss":
        return { backgroundColor: "#fee2e2", color: "#ef4444" };
      default:
        return { backgroundColor: "#e5e7eb", color: "#64748b" };
    }
  };

  const handleReplay = (duelId: number) => {
    Alert.alert("Replay", `Opening replay for duel #${duelId}...`);
  };

  const handleShare = (duel: any) => {
    Alert.alert("Share", `Duel result: ${duel.result.toUpperCase()} - Score: ${duel.score}`);};

  const filteredHistory = duelHistory.filter((duel) => {
    const matchesSearch =
      duel.opponent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      duel.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterBy === "all" || duel.result === filterBy;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
    <Stack.Screen
        options={{
          headerShown: false
        }}
      />
      <QuizNavBar />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Duel History</Text>
            <Text style={styles.headerSubtitle}>Track your progress and replays</Text>
          </View>
          <TouchableOpacity onPress={() => Alert.alert("Share", "Share your duel history!")}> 
            <Feather name="share-2" size={20} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Progress Cards */}
        <View style={styles.progressCards}>
          <View style={styles.levelCard}>
            <Text style={styles.levelLabel}>Level Progress</Text>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `60%` }]} />
            </View>
            <Text style={styles.levelXP}>4250 XP</Text>
          </View>
          <View style={styles.eloCard}>
            <Text style={styles.eloLabel}>ELO Rating</Text>
            <Text style={styles.eloValue}>1842</Text>
            <Text style={styles.eloChange}>+18</Text>
          </View>
        </View>

        {/* Streak Boosters & XP Combos */}
        <View style={styles.streakCard}>
          <Text style={styles.streakTitle}>Active Streaks & Combos</Text>
          <View style={styles.streakGrid}>
            {streakData.map((streak, index) => (
              <View key={index} style={styles.streakBox}>
                <Feather name={streak.icon as any} size={18} color={streak.color} style={{ marginBottom: 2 }} />
                <Text style={styles.streakValue}>{streak.value}</Text>
                <Text style={styles.streakType}>{streak.type}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Filters and Search */}
        <View style={styles.filterBox}>
          <View style={styles.searchRow}>
            <Feather name="search" size={16} color="#64748b" style={{ marginRight: 6 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by opponent or topic..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[styles.filterButton, sortBy === "recent" && styles.filterButtonActive]}
              onPress={() => setSortBy("recent")}
            >
              <Text style={styles.filterButtonText}>Most Recent</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, sortBy === "xp" && styles.filterButtonActive]}
              onPress={() => setSortBy("xp")}
            >
              <Text style={styles.filterButtonText}>Highest XP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, sortBy === "elo" && styles.filterButtonActive]}
              onPress={() => setSortBy("elo")}
            >
              <Text style={styles.filterButtonText}>Highest ELO</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[styles.filterButton, filterBy === "all" && styles.filterButtonActive]}
              onPress={() => setFilterBy("all")}
            >
              <Text style={styles.filterButtonText}>All Results</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterBy === "win" && styles.filterButtonActive]}
              onPress={() => setFilterBy("win")}
            >
              <Text style={styles.filterButtonText}>Wins Only</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterBy === "loss" && styles.filterButtonActive]}
              onPress={() => setFilterBy("loss")}
            >
              <Text style={styles.filterButtonText}>Losses Only</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* History Tabs */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tabButton, tab === "duels" && styles.tabButtonActive]}
            onPress={() => setTab("duels")}
          >
            <Text style={[styles.tabButtonText, tab === "duels" && styles.tabButtonTextActive]}>Duels</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, tab === "quests" && styles.tabButtonActive]}
            onPress={() => setTab("quests")}
          >
            <Text style={[styles.tabButtonText, tab === "quests" && styles.tabButtonTextActive]}>Quests</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, tab === "competitions" && styles.tabButtonActive]}
            onPress={() => setTab("competitions")}
          >
            <Text style={[styles.tabButtonText, tab === "competitions" && styles.tabButtonTextActive]}>Competitions</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {tab === "duels" && (
          <View>
            {filteredHistory.map((duel) => (
              <View key={duel.id} style={styles.duelCard}>
                <View style={styles.duelHeader}>
                  <View style={styles.duelOpponentRow}>
                    <View style={styles.duelAvatar}>
                      <Feather name="user" size={22} color="#64748b" />
                    </View>
                    <View>
                      <Text style={styles.duelOpponent}>{duel.opponent}</Text>
                      <Text style={styles.duelTopic}>{duel.topic}</Text>
                    </View>
                  </View>
                  <View style={[styles.resultBadge, getResultColor(duel.result)]}>
                    <Text style={[styles.resultBadgeText, { color: getResultColor(duel.result).color }]}>{duel.result.toUpperCase()}</Text>
                  </View>
                </View>
                <View style={styles.duelStatsRow}>
                  <View style={styles.duelStatBox}>
                    <Text style={styles.duelStatLabel}>Score</Text>
                    <Text style={styles.duelStatValue}>{duel.score}</Text>
                  </View>
                  <View style={styles.duelStatBox}>
                    <Text style={styles.duelStatLabel}>XP</Text>
                    <Text style={[styles.duelStatValue, { color: "#22c55e" }]}>+{duel.xpGained}</Text>
                  </View>
                  <View style={styles.duelStatBox}>
                    <Text style={styles.duelStatLabel}>ELO</Text>
                    <Text style={[styles.duelStatValue, { color: duel.eloChange > 0 ? "#22c55e" : "#ef4444" }]}> {duel.eloChange > 0 ? "+" : ""}{duel.eloChange}</Text>
                  </View>
                </View>
                <View style={styles.duelMetaRow}>
                  <View style={styles.duelMetaItem}>
                    <Feather name="clock" size={14} color="#64748b" style={{ marginRight: 2 }} />
                    <Text style={styles.duelMetaText}>{duel.duration}</Text>
                  </View>
                  <View style={styles.duelMetaItem}>
                    <Feather name="target" size={14} color="#64748b" style={{ marginRight: 2 }} />
                    <Text style={styles.duelMetaText}>{duel.accuracy}% accuracy</Text>
                  </View>
                  <View style={styles.duelMetaItem}>
                    <Feather name="calendar" size={14} color="#64748b" style={{ marginRight: 2 }} />
                    <Text style={styles.duelMetaText}>{duel.date}</Text>
                  </View>
                </View>
                <View style={styles.duelActionsRow}>
                  <TouchableOpacity style={styles.duelActionButton} onPress={() => handleReplay(duel.id)}>
                    <Feather name="play" size={16} color="#22c55e" style={{ marginRight: 4 }} />
                    <Text style={styles.duelActionButtonText}>Replay</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.duelActionButton} onPress={() => handleShare(duel)}>
                    <Feather name="share-2" size={16} color="#38bdf8" style={{ marginRight: 4 }} />
                    <Text style={styles.duelActionButtonText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
        {tab === "quests" && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Quest history coming soon!</Text>
          </View>
        )}
        {tab === "competitions" && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Competition history coming soon!</Text>
          </View>
        )}

        {/* Stats Summary */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Overall Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statsBox}>
              <Text style={[styles.statsValue, { color: "#22c55e" }]}><AnimatedCounter value={24} /></Text>
              <Text style={styles.statsLabel}>Total Duels</Text>
            </View>
            <View style={styles.statsBox}>
              <Text style={[styles.statsValue, { color: "#22c55e" }]}>75%</Text>
              <Text style={styles.statsLabel}>Win Rate</Text>
            </View>
            <View style={styles.statsBox}>
              <Text style={[styles.statsValue, { color: "#eab308" }]}><AnimatedCounter value={2850} /></Text>
              <Text style={styles.statsLabel}>Total XP</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#242620", padding: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: "bold" },
  headerSubtitle: { color: "#64748b", fontSize: 14 },
  progressCards: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  levelCard: { flex: 1, backgroundColor: "#fff", borderRadius: 12, padding: 12, marginRight: 8 },
  levelLabel: { color: "#64748b", fontSize: 13 },
  progressBarBackground: { width: "100%", height: 8, backgroundColor: "#e5e7eb", borderRadius: 4, overflow: "hidden", marginVertical: 6 },
  progressBarFill: { height: 8, backgroundColor: "#22c55e", borderRadius: 4 },
  levelXP: { color: "#22c55e", fontWeight: "bold", fontSize: 14 },
  eloCard: { flex: 1, backgroundColor: "#fff", borderRadius: 12, padding: 12 },
  eloLabel: { color: "#64748b", fontSize: 13 },
  eloValue: { color: "#22c55e", fontWeight: "bold", fontSize: 18 },
  eloChange: { color: "#22c55e", fontWeight: "bold", fontSize: 14 },
  streakCard: { backgroundColor: "#fef9c3", borderRadius: 16, padding: 16, marginBottom: 16 },
  streakTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 8 },
  streakGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  streakBox: { width: "48%", backgroundColor: "#fff", borderRadius: 10, alignItems: "center", padding: 10, marginBottom: 8 },
  streakValue: { fontWeight: "bold", fontSize: 16 },
  streakType: { color: "#64748b", fontSize: 12, textAlign: "center" },
  filterBox: { backgroundColor: "#fff", borderRadius: 12, padding: 12, marginBottom: 16 },
  searchRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  searchInput: { flex: 1, backgroundColor: "#f1f5f9", borderRadius: 8, padding: 10, fontSize: 15 },
  filterRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  filterButton: { flex: 1, backgroundColor: "#f1f5f9", borderRadius: 8, alignItems: "center", justifyContent: "center", paddingVertical: 8, marginHorizontal: 2 },
  filterButtonActive: { backgroundColor: "#22c55e" },
  filterButtonText: { color: "#64748b", fontWeight: "500" },
  tabsRow: { flexDirection: "row", marginBottom: 12, marginTop: 4 },
  tabButton: { flex: 1, paddingVertical: 10, backgroundColor: "#f1f5f9", borderRadius: 8, marginHorizontal: 2, alignItems: "center" },
  tabButtonActive: { backgroundColor: "#22c55e" },
  tabButtonText: { color: "#64748b", fontWeight: "500" },
  tabButtonTextActive: { color: "#fff" },
  duelCard: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#e5e7eb" },
  duelHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  duelOpponentRow: { flexDirection: "row", alignItems: "center" },
  duelAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#e5e7eb", alignItems: "center", justifyContent: "center", marginRight: 10 },
  duelOpponent: { fontWeight: "bold", fontSize: 15 },
  duelTopic: { color: "#64748b", fontSize: 13 },
  resultBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, alignItems: "center", justifyContent: "center" },
  resultBadgeText: { fontWeight: "bold", fontSize: 12 },
  duelStatsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  duelStatBox: { flex: 1, alignItems: "center" },
  duelStatLabel: { fontSize: 12, color: "#64748b" },
  duelStatValue: { fontWeight: "bold", fontSize: 15, marginTop: 2 },
  duelMetaRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  duelMetaItem: { flexDirection: "row", alignItems: "center" },
  duelMetaText: { color: "#64748b", fontSize: 12 },
  duelActionsRow: { flexDirection: "row", justifyContent: "space-between" },
  duelActionButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#f1f5f9", borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16, marginHorizontal: 2 },
  duelActionButtonText: { color: "#22c55e", fontWeight: "bold", fontSize: 14 },
  emptyCard: { backgroundColor: "#f1f5f9", borderRadius: 16, padding: 32, alignItems: "center", marginBottom: 16 },
  emptyText: { color: "#64748b", fontSize: 15 },
  statsCard: { backgroundColor: "#bbf7d0", borderRadius: 16, padding: 16, marginTop: 16 },
  statsTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 8, textAlign: "center" },
  statsGrid: { flexDirection: "row", justifyContent: "space-between" },
  statsBox: { flex: 1, alignItems: "center" },
  statsValue: { fontWeight: "bold", fontSize: 18 },
  statsLabel: { color: "#64748b", fontSize: 12 },
});

export default DuelHistory; 
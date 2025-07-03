import { Feather } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
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
        return { 
          backgroundColor: "rgba(163, 230, 53, 0.1)", 
          color: "#A3E635",
          borderWidth: 1,
          borderColor: "rgba(163, 230, 53, 0.2)"
        };
      case "loss":
        return { 
          backgroundColor: "rgba(239, 68, 68, 0.1)", 
          color: "#ef4444",
          borderWidth: 1,
          borderColor: "rgba(239, 68, 68, 0.2)"
        };
      default:
        return { 
          backgroundColor: "rgba(0, 0, 0, 0.2)", 
          color: "#94a3b8",
          borderWidth: 1,
          borderColor: "rgba(148, 163, 184, 0.2)"
        };
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
            <Feather name="share-2" size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        {/* Progress Cards */}
        <View style={styles.progressCards}>
          <LinearGradient
            colors={['rgba(163, 230, 53, 0.1)', 'rgba(56, 189, 248, 0.1)']}
            style={styles.levelCard}
          >
            <Text style={styles.levelLabel}>Level Progress</Text>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `60%` }]} />
            </View>
            <Text style={styles.levelXP}>4250 XP</Text>
          </LinearGradient>
          <LinearGradient
            colors={['rgba(163, 230, 53, 0.1)', 'rgba(56, 189, 248, 0.1)']}
            style={styles.eloCard}
          >
            <Text style={styles.eloLabel}>ELO Rating</Text>
            <Text style={styles.eloValue}>1842</Text>
            <Text style={styles.eloChange}>+18</Text>
          </LinearGradient>
        </View>

        {/* Streak Boosters & XP Combos */}
        <LinearGradient
          colors={['rgba(163, 230, 53, 0.1)', 'rgba(56, 189, 248, 0.1)']}
          style={styles.streakCard}
        >
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
        </LinearGradient>

        {/* Filters and Search */}
        <LinearGradient
          colors={['rgba(163, 230, 53, 0.1)', 'rgba(56, 189, 248, 0.1)']}
          style={styles.filterBox}
        >
          <View style={styles.searchRow}>
            <Feather name="search" size={16} color="#94a3b8" style={{ marginRight: 6 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by opponent or topic..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[styles.filterButton, sortBy === "recent" && styles.filterButtonActive]}
              onPress={() => setSortBy("recent")}
            >
              <Text style={[styles.filterButtonText, sortBy === "recent" && styles.filterButtonTextActive]}>Most Recent</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, sortBy === "xp" && styles.filterButtonActive]}
              onPress={() => setSortBy("xp")}
            >
              <Text style={[styles.filterButtonText, sortBy === "xp" && styles.filterButtonTextActive]}>Highest XP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, sortBy === "elo" && styles.filterButtonActive]}
              onPress={() => setSortBy("elo")}
            >
              <Text style={[styles.filterButtonText, sortBy === "elo" && styles.filterButtonTextActive]}>Highest ELO</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[styles.filterButton, filterBy === "all" && styles.filterButtonActive]}
              onPress={() => setFilterBy("all")}
            >
              <Text style={[styles.filterButtonText, filterBy === "all" && styles.filterButtonTextActive]}>All Results</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterBy === "win" && styles.filterButtonActive]}
              onPress={() => setFilterBy("win")}
            >
              <Text style={[styles.filterButtonText, filterBy === "win" && styles.filterButtonTextActive]}>Wins Only</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterBy === "loss" && styles.filterButtonActive]}
              onPress={() => setFilterBy("loss")}
            >
              <Text style={[styles.filterButtonText, filterBy === "loss" && styles.filterButtonTextActive]}>Losses Only</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

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
              <LinearGradient
                key={duel.id}
                colors={['rgba(163, 230, 53, 0.1)', 'rgba(56, 189, 248, 0.1)']}
                style={styles.duelCard}
              >
                <View style={styles.duelHeader}>
                  <View style={styles.duelOpponentRow}>
                    <View style={styles.duelAvatar}>
                      <Feather name="user" size={22} color="#94a3b8" />
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
                    <Text style={[styles.duelStatValue, { color: "#A3E635" }]}>+{duel.xpGained}</Text>
                  </View>
                  <View style={styles.duelStatBox}>
                    <Text style={styles.duelStatLabel}>ELO</Text>
                    <Text style={[styles.duelStatValue, { color: duel.eloChange > 0 ? "#A3E635" : "#ef4444" }]}>{duel.eloChange > 0 ? "+" : ""}{duel.eloChange}</Text>
                  </View>
                </View>
                <View style={styles.duelMetaRow}>
                  <View style={styles.duelMetaItem}>
                    <Feather name="clock" size={14} color="#94a3b8" style={{ marginRight: 2 }} />
                    <Text style={styles.duelMetaText}>{duel.duration}</Text>
                  </View>
                  <View style={styles.duelMetaItem}>
                    <Feather name="target" size={14} color="#94a3b8" style={{ marginRight: 2 }} />
                    <Text style={styles.duelMetaText}>{duel.accuracy}% accuracy</Text>
                  </View>
                  <View style={styles.duelMetaItem}>
                    <Feather name="calendar" size={14} color="#94a3b8" style={{ marginRight: 2 }} />
                    <Text style={styles.duelMetaText}>{duel.date}</Text>
                  </View>
                </View>
                <View style={styles.duelActionsRow}>
                  <TouchableOpacity style={styles.duelActionButton} onPress={() => handleReplay(duel.id)}>
                    <Feather name="play" size={16} color="#A3E635" style={{ marginRight: 4 }} />
                    <Text style={styles.duelActionButtonText}>Replay</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.duelActionButton} onPress={() => handleShare(duel)}>
                    <Feather name="share-2" size={16} color="#38bdf8" style={{ marginRight: 4 }} />
                    <Text style={[styles.duelActionButtonText, { color: "#38bdf8" }]}>Share</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
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
        <LinearGradient
          colors={['rgba(163, 230, 53, 0.1)', 'rgba(56, 189, 248, 0.1)']}
          style={styles.statsCard}
        >
          <Text style={styles.statsTitle}>Overall Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statsBox}>
              <Text style={[styles.statsValue, { color: "#A3E635" }]}><AnimatedCounter value={24} /></Text>
              <Text style={styles.statsLabel}>Total Duels</Text>
            </View>
            <View style={styles.statsBox}>
              <Text style={[styles.statsValue, { color: "#A3E635" }]}>75%</Text>
              <Text style={styles.statsLabel}>Win Rate</Text>
            </View>
            <View style={styles.statsBox}>
              <Text style={[styles.statsValue, { color: "#fde047" }]}><AnimatedCounter value={2850} /></Text>
              <Text style={styles.statsLabel}>Total XP</Text>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#242620", 
    padding: 16 
  },
  headerRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 16 
  },
  headerTitle: { 
    fontSize: 22, 
    fontWeight: "bold",
    color: "#fff"
  },
  headerSubtitle: { 
    color: "#94a3b8", 
    fontSize: 14 
  },
  progressCards: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 16,
    gap: 8
  },
  levelCard: { 
    flex: 1, 
    borderRadius: 12, 
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(163, 230, 53, 0.2)"
  },
  levelLabel: { 
    color: "#94a3b8", 
    fontSize: 13 
  },
  progressBarBackground: { 
    width: "100%", 
    height: 8, 
    backgroundColor: "rgba(0, 0, 0, 0.2)", 
    borderRadius: 4, 
    overflow: "hidden", 
    marginVertical: 6 
  },
  progressBarFill: { 
    height: 8, 
    backgroundColor: "#A3E635", 
    borderRadius: 4 
  },
  levelXP: { 
    color: "#A3E635", 
    fontWeight: "bold", 
    fontSize: 14 
  },
  eloCard: { 
    flex: 1, 
    borderRadius: 12, 
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(163, 230, 53, 0.2)"
  },
  eloLabel: { 
    color: "#94a3b8", 
    fontSize: 13 
  },
  eloValue: { 
    color: "#A3E635", 
    fontWeight: "bold", 
    fontSize: 18 
  },
  eloChange: { 
    color: "#A3E635", 
    fontWeight: "bold", 
    fontSize: 14 
  },
  streakCard: { 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(163, 230, 53, 0.2)"
  },
  streakTitle: { 
    fontWeight: "bold", 
    fontSize: 16, 
    marginBottom: 8,
    color: "#fff"
  },
  streakGrid: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "space-between",
    gap: 8
  },
  streakBox: { 
    width: "48%", 
    backgroundColor: "rgba(0, 0, 0, 0.2)", 
    borderRadius: 10, 
    alignItems: "center", 
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(163, 230, 53, 0.2)"
  },
  streakValue: { 
    fontWeight: "bold", 
    fontSize: 16,
    color: "#fff"
  },
  streakType: { 
    color: "#94a3b8", 
    fontSize: 12, 
    textAlign: "center" 
  },
  filterBox: { 
    borderRadius: 12, 
    padding: 12, 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(163, 230, 53, 0.2)"
  },
  searchRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 8 
  },
  searchInput: { 
    flex: 1, 
    backgroundColor: "rgba(0, 0, 0, 0.2)", 
    borderRadius: 8, 
    padding: 10, 
    fontSize: 15,
    color: "#fff",
    borderWidth: 1,
    borderColor: "rgba(163, 230, 53, 0.2)"
  },
  filterRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 4,
    gap: 4
  },
  filterButton: { 
    flex: 1, 
    backgroundColor: "rgba(0, 0, 0, 0.2)", 
    borderRadius: 8, 
    alignItems: "center", 
    justifyContent: "center", 
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(163, 230, 53, 0.2)"
  },
  filterButtonActive: { 
    backgroundColor: "#9bec00" 
  },
  filterButtonText: { 
    color: "#94a3b8", 
    fontWeight: "500" 
  },
  filterButtonTextActive: {
    color: "#000"
  },
  tabsRow: { 
    flexDirection: "row", 
    marginBottom: 12, 
    marginTop: 4,
    gap: 4
  },
  tabButton: { 
    flex: 1, 
    paddingVertical: 10, 
    backgroundColor: "rgba(0, 0, 0, 0.2)", 
    borderRadius: 8, 
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(163, 230, 53, 0.2)"
  },
  tabButtonActive: { 
    backgroundColor: "#9bec00" 
  },
  tabButtonText: { 
    color: "#94a3b8", 
    fontWeight: "500" 
  },
  tabButtonTextActive: { 
    color: "#000" 
  },
  duelCard: { 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: "rgba(163, 230, 53, 0.2)" 
  },
  duelHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 8 
  },
  duelOpponentRow: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  duelAvatar: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    backgroundColor: "rgba(0, 0, 0, 0.2)", 
    alignItems: "center", 
    justifyContent: "center", 
    marginRight: 10,
    borderWidth: 1,
    borderColor: "rgba(163, 230, 53, 0.2)"
  },
  duelOpponent: { 
    fontWeight: "bold", 
    fontSize: 15,
    color: "#fff"
  },
  duelTopic: { 
    color: "#94a3b8", 
    fontSize: 13 
  },
  resultBadge: { 
    borderRadius: 8, 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    alignItems: "center", 
    justifyContent: "center" 
  },
  resultBadgeText: { 
    fontWeight: "bold", 
    fontSize: 12 
  },
  duelStatsRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 8 
  },
  duelStatBox: { 
    flex: 1, 
    alignItems: "center" 
  },
  duelStatLabel: { 
    fontSize: 12, 
    color: "#94a3b8" 
  },
  duelStatValue: { 
    fontWeight: "bold", 
    fontSize: 15, 
    marginTop: 2,
    color: "#fff"
  },
  duelMetaRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 8 
  },
  duelMetaItem: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  duelMetaText: { 
    color: "#94a3b8", 
    fontSize: 12 
  },
  duelActionsRow: { 
    flexDirection: "row", 
    justifyContent: "space-between",
    gap: 8
  },
  duelActionButton: { 
    flex: 1,
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "rgba(0, 0, 0, 0.2)", 
    borderRadius: 8, 
    paddingVertical: 8, 
    paddingHorizontal: 16,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(163, 230, 53, 0.2)"
  },
  duelActionButtonText: { 
    color: "#A3E635", 
    fontWeight: "bold", 
    fontSize: 14 
  },
  emptyCard: { 
    backgroundColor: "rgba(0, 0, 0, 0.2)", 
    borderRadius: 16, 
    padding: 32, 
    alignItems: "center", 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(163, 230, 53, 0.2)"
  },
  emptyText: { 
    color: "#94a3b8", 
    fontSize: 15 
  },
  statsCard: { 
    borderRadius: 16, 
    padding: 16, 
    marginTop: 16,
    borderWidth: 1,
    borderColor: "rgba(163, 230, 53, 0.2)"
  },
  statsTitle: { 
    fontWeight: "bold", 
    fontSize: 16, 
    marginBottom: 8, 
    textAlign: "center",
    color: "#fff"
  },
  statsGrid: { 
    flexDirection: "row", 
    justifyContent: "space-between" 
  },
  statsBox: { 
    flex: 1, 
    alignItems: "center" 
  },
  statsValue: { 
    fontWeight: "bold", 
    fontSize: 18 
  },
  statsLabel: { 
    color: "#94a3b8", 
    fontSize: 12 
  },
});

export default DuelHistory; 
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
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

const user = {
  name: "Demo User",
  avatar: null,
  isPremium: true,
  isVerified: true,
  level: 7,
  elo: 1842,
  streak: 5,
  xp: 3200,
};

const quickActions = [
  {
    title: "Quick Duel",
    description: "Find opponent instantly",
    icon: "zap",
    color: "#22c55e",
    action: () => useRouter().push('/quiz-pages/games/duels-lobby'),
  },
  {
    title: "Daily Challenge",
    description: "Complete today's quest",
    icon: "target",
    color: "#eab308",
    action: () => useRouter().push('/quiz-pages/daily-challenge'),
  },
  {
    title: "Group Room",
    description: "Play with friends",
    icon: "users",
    color: "#38bdf8",
    action: () => useRouter().push('/quiz-pages/games/group-play-lobby'),
  },
  {
    title: "Practice Mode",
    description: "Improve your skills",
    icon: "book-open",
    color: "#ef4444",
    action: () => useRouter().push('/quiz-pages/PracticeHub'),
  },
];

const recentMatches = [
  { opponent: "TradeMaster", result: "Won", xp: "+45", elo: "+12" },
  { opponent: "QuizKing", result: "Lost", xp: "+15", elo: "-8" },
  { opponent: "MarketPro", result: "Won", xp: "+38", elo: "+15" },
];

const HomeArena: React.FC = () => {
  const [notifications, setNotifications] = useState(3);
  const router = useRouter();

  return (
    <>
      <QuizNavBar />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        {/* <View style={styles.headerRow}>
          <Text style={styles.logo}>TradeVed</Text>
          <View style={styles.headerIconsRow}>
            <TouchableOpacity style={styles.headerIconButton} onPress={() => router.push('/quiz-pages/notification-inbox')}> 
              <Feather name="bell" size={20} color="#64748b" />
              {notifications > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>{notifications}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconButton} onPress={() => Alert.alert("Theme Toggle")}> 
              <Feather name="moon" size={20} color="#64748b" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconButton} onPress={() => router.push('/quiz-pages/profile-screen')}> 
              <Feather name="settings" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>
        </View> */}

        {/* User Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.avatarCircle}>
              <Feather name="user" size={32} color="#64748b" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.userName}>{user.name}</Text>
                {user.isPremium && <Feather name="star" size={16} color="#eab308" style={{ marginLeft: 6 }} />}
                {user.isVerified && <Feather name="check-circle" size={16} color="#38bdf8" style={{ marginLeft: 6 }} />}
              </View>
              <View style={styles.userStatsRow}>
                <Text style={styles.userStat}>Level {user.level}</Text>
                <Text style={styles.userStat}>ELO: {user.elo}</Text>
                <Text style={styles.userStat}>Streak: {user.streak}🔥</Text>
              </View>
              <View style={styles.xpRow}>
                <Text style={styles.xpLabel}>XP Progress</Text>
                <Text style={styles.xpValue}>{user.xp}/5000</Text>
              </View>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: `${(user.xp / 5000) * 100}%` }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickActionCard}
              onPress={action.action}
            >
              <View style={[styles.quickActionIconCircle, { backgroundColor: action.color + "20" }]}> 
                <Feather name={action.icon as any} size={22} color={action.color} />
              </View>
              <Text style={styles.quickActionTitle}>{action.title}</Text>
              <Text style={styles.quickActionDesc}>{action.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Live Tournaments */}
        <View style={styles.cardWhite}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <FontAwesome5 name="trophy" size={16} color="#eab308" style={{ marginRight: 6 }} />
              <Text style={styles.cardHeaderTitle}>Live Tournaments</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/quiz-pages/competition-hub')}> 
              <Text style={styles.cardHeaderAction}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tournamentRow}>
            <View>
              <Text style={styles.tournamentTitle}>Weekly Championship</Text>
              <Text style={styles.tournamentPrize}>Prize Pool: $500</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.tournamentEndsLabel}>Ends in</Text>
              <Text style={styles.tournamentEndsValue}>2h 45m</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.tournamentButton} onPress={() => router.push('/quiz-pages/competition-detail')}> 
            <Text style={styles.tournamentButtonText}>Join Tournament</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Matches */}
        <View style={styles.cardWhite}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <Feather name="trending-up" size={16} color="#38bdf8" style={{ marginRight: 6 }} />
              <Text style={styles.cardHeaderTitle}>Recent Matches</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/quiz-pages/duel-history')}> 
              <Text style={styles.cardHeaderAction}>View All</Text>
            </TouchableOpacity>
          </View>
          {recentMatches.map((match, index) => (
            <View key={index} style={styles.matchRow}>
              <View style={styles.matchOpponentBox}>
                <View style={styles.matchAvatar}><Text style={styles.matchAvatarText}>{match.opponent.substring(0, 2)}</Text></View>
                <View>
                  <Text style={styles.matchOpponent}>{match.opponent}</Text>
                  <Text style={styles.matchTime}>2 hours ago</Text>
                </View>
              </View>
              <View style={styles.matchResultBox}>
                <View style={[styles.matchBadge, match.result === "Won" ? styles.matchBadgeWin : styles.matchBadgeLoss]}>
                  <Text style={styles.matchBadgeText}>{match.result}</Text>
                </View>
                <Text style={styles.matchResultStats}>{match.xp} XP • {match.elo} ELO</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Game Modes Preview */}
        <View style={styles.cardWhite}>
          <View style={styles.cardHeaderRow}>
            <FontAwesome5 name="gamepad" size={16} color="#22c55e" style={{ marginRight: 6 }} />
            <Text style={styles.cardHeaderTitle}>Game Modes</Text>
          </View>
          <View style={styles.gameModesGrid}>
            <TouchableOpacity style={styles.gameModeButton} onPress={() => useRouter().push('/quiz-pages/games/time-attack-lobby')}> 
              <Feather name="clock" size={16} color="#ef4444" />
              <Text style={styles.gameModeButtonText}>Time Attack</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gameModeButton} onPress={() => useRouter().push('/quiz-pages/games/fastest-finger-lobby')}> 
              <Feather name="zap" size={16} color="#eab308" />
              <Text style={styles.gameModeButtonText}>Fastest Finger</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  logo: { fontWeight: "bold", fontSize: 20, color: "#22c55e" },
  headerIconsRow: { flexDirection: "row", alignItems: "center" },
  headerIconButton: { marginLeft: 8, position: "relative" },
  notificationBadge: { position: "absolute", top: -6, right: -6, backgroundColor: "#ef4444", borderRadius: 10, width: 20, height: 20, alignItems: "center", justifyContent: "center" },
  notificationBadgeText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  statsCard: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#e5e7eb" },
  statsRow: { flexDirection: "row", alignItems: "center" },
  avatarCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#e5e7eb", alignItems: "center", justifyContent: "center" },
  userName: { fontWeight: "bold", fontSize: 18 },
  userStatsRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  userStat: { color: "#64748b", fontSize: 13, marginRight: 12 },
  xpRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  xpLabel: { color: "#64748b", fontSize: 12 },
  xpValue: { color: "#22c55e", fontWeight: "bold", fontSize: 12 },
  progressBarBackground: { width: "100%", height: 8, backgroundColor: "#e5e7eb", borderRadius: 4, overflow: "hidden", marginTop: 4 },
  progressBarFill: { height: 8, backgroundColor: "#22c55e", borderRadius: 4 },
  sectionTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 8 },
  quickActionsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 16 },
  quickActionCard: { width: "48%", backgroundColor: "#f1f5f9", borderRadius: 12, alignItems: "center", padding: 16, marginBottom: 12 },
  quickActionIconCircle: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  quickActionTitle: { fontWeight: "bold", fontSize: 14 },
  quickActionDesc: { color: "#64748b", fontSize: 12, textAlign: "center" },
  cardWhite: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#e5e7eb" },
  cardHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  cardHeaderLeft: { flexDirection: "row", alignItems: "center" },
  cardHeaderTitle: { fontWeight: "bold", fontSize: 15 },
  cardHeaderAction: { color: "#22c55e", fontWeight: "bold", fontSize: 13 },
  tournamentRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  tournamentTitle: { fontWeight: "bold", fontSize: 14 },
  tournamentPrize: { color: "#64748b", fontSize: 12 },
  tournamentEndsLabel: { color: "#64748b", fontSize: 12 },
  tournamentEndsValue: { color: "#ef4444", fontWeight: "bold", fontSize: 14 },
  tournamentButton: { backgroundColor: "#22c55e", borderRadius: 10, alignItems: "center", justifyContent: "center", paddingVertical: 14 },
  tournamentButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  matchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8 },
  matchOpponentBox: { flexDirection: "row", alignItems: "center" },
  matchAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#e5e7eb", alignItems: "center", justifyContent: "center", marginRight: 8 },
  matchAvatarText: { color: "#64748b", fontWeight: "bold", fontSize: 14 },
  matchOpponent: { fontWeight: "bold", fontSize: 14 },
  matchTime: { color: "#64748b", fontSize: 12 },
  matchResultBox: { alignItems: "flex-end" },
  matchBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, alignItems: "center", justifyContent: "center", marginBottom: 2 },
  matchBadgeWin: { backgroundColor: "#bbf7d0" },
  matchBadgeLoss: { backgroundColor: "#fee2e2" },
  matchBadgeText: { fontWeight: "bold", fontSize: 12, color: "#22c55e" },
  matchResultStats: { color: "#64748b", fontSize: 12 },
  gameModesGrid: { flexDirection: "row", justifyContent: "space-between" },
  gameModeButton: { flex: 1, backgroundColor: "#f1f5f9", borderRadius: 8, alignItems: "center", justifyContent: "center", paddingVertical: 14, marginHorizontal: 4 },
  gameModeButtonText: { color: "#64748b", fontWeight: "bold", fontSize: 13, marginTop: 4 },
});

export default HomeArena; 
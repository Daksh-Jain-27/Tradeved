import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import QuizNavBar from "../../components/QuizNavBar";
import { CommunityBulletin } from "../../components/ui/CommunityBulletin";
import { EloRating } from "../../components/ui/EloRating";
import { LevelProgress } from "../../components/ui/LevelProgress";
import { PowerUpProgress } from "../../components/ui/PowerUpProgress";
import { ProfileCustomization } from "../../components/ui/ProfileCustomization";
import { ReferralSystem } from "../../components/ui/ReferralSystem";

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

const useAuth = () => ({
  user: {
    name: 'Alex Trader',
    email: 'alex_trader@example.com',
    avatar: 'https://i.pravatar.cc/150?u=alex_trader',
    level: 7,
    xp: 450,
    elo: 1842,
    recentEloChange: 25,
  },
  logout: () => {
    Alert.alert("Logged Out", "You have been successfully logged out.");
    // In a real app, you would navigate to the login screen
  },
});

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

const stats = [
  { label: "Duels Won", value: "127", icon: <Icon name="award" size={16} color="#A3E635" /> },
  { label: "Win Rate", value: "73%", icon: <Icon name="target" size={16} color="#A3E635" /> },
  { label: "Streak", value: "7", icon: <Icon name="calendar" size={16} color="#A3E635" /> },
];

const HomeArena: React.FC = () => {
  // const [notifications, setNotifications] = useState(3);
  const router = useRouter();  
  const { user, logout } = useAuth();
  const [showCustomization, setShowCustomization] = useState(false);
  const [activeTab, setActiveTab] = useState<"powerups" | "referral" | "community">("powerups");

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
        <LinearGradient
            colors={['rgba(163, 230, 53, 0.1)', 'rgba(56, 189, 248, 0.1)']}
            style={styles.card}
          >
            <View style={styles.profileHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
                <View>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userHandle}>@{user.email.split("@")[0]}</Text>
                  <View style={styles.levelBadge}><Text style={styles.levelBadgeText}>Level {user.level}</Text></View>
                </View>
              </View>
              <View style={{ flexDirection: 'column', gap: 8 }}>
                <TouchableOpacity style={styles.iconButton} onPress={() => setShowCustomization(!showCustomization)}>
                  <Icon name="edit" size={16} color="#FFF" />
                </TouchableOpacity>
                {/* <SocialShare
                title="Check out my profile!"
                text={`I'm level ${user.level} on TradeVed, come join me!`}
                url={`https://tradeved.com/profile/${user.email.split('@')[0]}`}
              >
                <View style={styles.iconButton}>
                  <Icon name="share-2" size={16} color="#FFF" />
                </View>
              </SocialShare> */}
              </View>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              {stats.map((stat) => (
                <View key={stat.label} style={styles.statBox}>
                  {stat.icon}
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>

            {/* Progress Bars */}
            <View style={{ gap: 12 }}>
              <LevelProgress currentXP={user.xp || 0} />
              <EloRating rating={user.elo || 1000} recentChange={user.recentEloChange || 0} />
            </View>
          </LinearGradient>

          {/* Profile Customization */}
          {showCustomization && <ProfileCustomization />}

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.quickActionCard, { borderColor: action.color + '40' }]}
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
        <LinearGradient
          colors={['rgba(163, 230, 53, 0.1)', 'rgba(56, 189, 248, 0.1)']}
          style={[styles.card, styles.tournamentCard]}
        >
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
        </LinearGradient>

        {/* Recent Matches */}
        <LinearGradient
          colors={['rgba(163, 230, 53, 0.1)', 'rgba(56, 189, 248, 0.1)']}
          style={[styles.card, styles.matchesCard]}
        >
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
                  <Text style={[styles.matchBadgeText, match.result === "Won" ? styles.matchBadgeWinText : styles.matchBadgeLossText]}>{match.result}</Text>
                </View>
                <Text style={styles.matchResultStats}>{match.xp} XP • {match.elo} ELO</Text>
              </View>
            </View>
          ))}
        </LinearGradient>

        {/* Game Modes Preview */}
        <LinearGradient
          colors={['rgba(163, 230, 53, 0.1)', 'rgba(56, 189, 248, 0.1)']}
          style={[styles.card, styles.gameModesCard]}
        >
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
        </LinearGradient>

        <View style={styles.tabsContainer}>
            <View style={styles.tabsList}>
              <TouchableOpacity style={[styles.tabTrigger, activeTab === 'powerups' && styles.activeTab]} onPress={() => setActiveTab('powerups')}>
                <Text style={[styles.tabText, activeTab === 'powerups' && styles.activeTabText]}>Power-ups</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tabTrigger, activeTab === 'referral' && styles.activeTab]} onPress={() => setActiveTab('referral')}>
                <Text style={[styles.tabText, activeTab === 'referral' && styles.activeTabText]}>Referral</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tabTrigger, activeTab === 'community' && styles.activeTab]} onPress={() => setActiveTab('community')}>
                <Text style={[styles.tabText, activeTab === 'community' && styles.activeTabText]}>Community</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tabContent}>
              {activeTab === 'powerups' && <PowerUpProgress />}
              {activeTab === 'referral' && <ReferralSystem />}
              {activeTab === 'community' && <CommunityBulletin />}
            </View>
          </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#242620", padding: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  logo: { fontWeight: "bold", fontSize: 20, color: "#22c55e" },
  card: { 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: 'rgba(163, 230, 53, 0.2)' 
  },
  profileHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: '#A3E635', marginRight: 16 },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
  userHandle: { fontSize: 14, color: '#9CA3AF' },
  levelBadge: { backgroundColor: '#A3E635', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, marginTop: 4 },
  levelBadgeText: { color: '#000', fontSize: 12, fontWeight: 'bold' },
  iconButton: { borderWidth: 1, borderColor: '#4B5563', padding: 8, borderRadius: 8 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  statBox: { flex: 1, alignItems: 'center', backgroundColor: 'rgba(17, 24, 39, 0.5)', borderRadius: 8, padding: 12, marginHorizontal: 4 },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  statLabel: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  tabsContainer: { width: '100%', marginBottom: 24 },
  tabsList: { flexDirection: 'row', backgroundColor: '#374151', borderRadius: 8, padding: 4 },
  tabTrigger: { flex: 1, paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  activeTab: { backgroundColor: '#4B5563' },
  tabText: { color: '#D1D5DB' },
  activeTabText: { color: '#FFF' },
  tabContent: { marginTop: 16 },
  headerIconsRow: { flexDirection: "row", alignItems: "center" },
  headerIconButton: { marginLeft: 8, position: "relative" },
  notificationBadge: { position: "absolute", top: -6, right: -6, backgroundColor: "#ef4444", borderRadius: 10, width: 20, height: 20, alignItems: "center", justifyContent: "center" },
  notificationBadgeText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  statsCard: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#e5e7eb" },
  statsRow: { flexDirection: "row", alignItems: "center" },
  avatarCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#e5e7eb", alignItems: "center", justifyContent: "center" },
  userStatsRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  userStat: { color: "#64748b", fontSize: 13, marginRight: 12 },
  xpRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  xpLabel: { color: "#64748b", fontSize: 12 },
  xpValue: { color: "#22c55e", fontWeight: "bold", fontSize: 12 },
  progressBarBackground: { width: "100%", height: 8, backgroundColor: "#e5e7eb", borderRadius: 4, overflow: "hidden", marginTop: 4 },
  progressBarFill: { height: 8, backgroundColor: "#22c55e", borderRadius: 4 },
  sectionTitle: { 
    color: '#fff',
    fontWeight: "bold", 
    fontSize: 16, 
    marginBottom: 8 
  },
  quickActionsGrid: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "space-between", 
    marginBottom: 16,
    gap: 12,
  },
  quickActionCard: { 
    width: "48%", 
    backgroundColor: "#232823", 
    borderRadius: 12, 
    alignItems: "center", 
    padding: 16, 
    borderWidth: 1,
  },
  quickActionIconCircle: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    alignItems: "center", 
    justifyContent: "center", 
    marginBottom: 8 
  },
  quickActionTitle: { 
    color: '#fff',
    fontWeight: "bold", 
    fontSize: 14,
    marginBottom: 4,
  },
  quickActionDesc: { 
    color: "#aaa", 
    fontSize: 12, 
    textAlign: "center" 
  },
  tournamentCard: {
    marginBottom: 16,
  },
  matchesCard: {
    marginBottom: 16,
  },
  gameModesCard: {
    marginBottom: 16,
  },
  cardHeaderRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    marginBottom: 12 
  },
  cardHeaderLeft: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  cardHeaderTitle: { 
    color: '#fff',
    fontWeight: "bold", 
    fontSize: 15 
  },
  cardHeaderAction: { 
    color: "#A3E635", 
    fontWeight: "bold", 
    fontSize: 13 
  },
  tournamentRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    marginBottom: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 12,
    borderRadius: 8,
  },
  tournamentTitle: { 
    color: '#fff',
    fontWeight: "bold", 
    fontSize: 14 
  },
  tournamentPrize: { 
    color: "#aaa", 
    fontSize: 12 
  },
  tournamentEndsLabel: { 
    color: "#aaa", 
    fontSize: 12 
  },
  tournamentEndsValue: { 
    color: "#ef4444", 
    fontWeight: "bold", 
    fontSize: 14 
  },
  tournamentButton: { 
    backgroundColor: "#A3E635", 
    borderRadius: 8, 
    alignItems: "center", 
    justifyContent: "center", 
    paddingVertical: 12 
  },
  tournamentButtonText: { 
    color: "#000", 
    fontWeight: "bold", 
    fontSize: 14 
  },
  matchRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(163, 230, 53, 0.1)',
  },
  matchOpponentBox: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  matchAvatar: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    backgroundColor: "rgba(163, 230, 53, 0.1)", 
    alignItems: "center", 
    justifyContent: "center", 
    marginRight: 8 
  },
  matchAvatarText: { 
    color: "#A3E635", 
    fontWeight: "bold", 
    fontSize: 14 
  },
  matchOpponent: { 
    color: '#fff',
    fontWeight: "bold", 
    fontSize: 14 
  },
  matchTime: { 
    color: "#aaa", 
    fontSize: 12 
  },
  matchResultBox: { 
    alignItems: "flex-end" 
  },
  matchBadge: { 
    borderRadius: 4, 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    marginBottom: 2 
  },
  matchBadgeWin: { 
    backgroundColor: "rgba(163, 230, 53, 0.2)" 
  },
  matchBadgeLoss: { 
    backgroundColor: "rgba(239, 68, 68, 0.2)" 
  },
  matchBadgeText: { 
    fontWeight: "bold", 
    fontSize: 12 
  },
  matchBadgeWinText: {
    color: "#A3E635"
  },
  matchBadgeLossText: {
    color: "#ef4444"
  },
  matchResultStats: { 
    color: "#aaa", 
    fontSize: 12 
  },
  gameModesGrid: { 
    flexDirection: "row", 
    justifyContent: "space-between",
    gap: 8,
  },
  gameModeButton: { 
    flex: 1, 
    backgroundColor: "rgba(0, 0, 0, 0.2)", 
    borderRadius: 8, 
    alignItems: "center", 
    justifyContent: "center", 
    paddingVertical: 14,
    flexDirection: 'row',
    gap: 8,
  },
  gameModeButtonText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 13,
  },
});

export default HomeArena; 
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import QuizNavBar from "../../components/QuizNavBar";

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

const competitions = {
  live: [
    {
      id: 1,
      title: "Weekly Championship",
      subtitle: "Options Trading Masters",
      icon: <FontAwesome5 name="trophy" size={24} color="#A3E635" />,
      participants: 1247,
      prizePool: "₹50,000",
      timeLeft: "2d 14h",
      status: "Live",
      type: "weekly",
    },
    {
      id: 2,
      title: "Speed Trading Quiz",
      subtitle: "Fast-paced market knowledge test",
      icon: <Feather name="zap" size={24} color="#A3E635" />,
      participants: 892,
      prizePool: "₹25,000",
      timeLeft: "1d 8h",
      status: "Live",
      type: "speed",
    },
  ],
  upcoming: [
    {
      id: 3,
      title: "College Championship",
      subtitle: "Inter-college trading battle",
      icon: <FontAwesome5 name="gift" size={24} color="#A3E635" />,
      participants: 0,
      maxParticipants: 2000,
      prizePool: "₹1,00,000",
      startDate: "Dec 20, 2024",
      status: "Upcoming",
      type: "college",
    },
    {
      id: 4,
      title: "Risk Masters Tournament",
      subtitle: "Advanced risk management",
      icon: <FontAwesome5 name="trophy" size={24} color="#A3E635" />,
      participants: 156,
      maxParticipants: 500,
      prizePool: "₹75,000",
      startDate: "Dec 25, 2024",
      status: "Upcoming",
      type: "advanced",
    },
  ],
  ended: [
    {
      id: 5,
      title: "Beginner's Cup",
      subtitle: "First trading competition",
      icon: <FontAwesome5 name="trophy" size={24} color="#aaa" />,
      participants: 2341,
      prizePool: "₹30,000",
      winner: "Alex Trader",
      endDate: "Dec 10, 2024",
      status: "Ended",
      type: "beginner",
    },
  ],
};

const AnimatedCounter = ({ value, style }: { value: number; style?: any }) => (
  <Text style={style}>{value}</Text>
);

const ProgressBar = ({ value }: { value: number }) => (
  <View style={styles.progressBarBackground}>
    <View style={[styles.progressBarFill, { width: `${value}%` }]} />
  </View>
);

const TabButton = ({
  label,
  active,
  onPress,
  count,
  pulse,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  count: number;
  pulse?: boolean;
}) => (
  <TouchableOpacity
    style={[styles.tabButton, active && styles.tabButtonActive]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={[styles.tabButtonText, active && styles.tabButtonTextActive]}>
      {label} ({count})
    </Text>
    {pulse && <View style={styles.pulseDot} />}
  </TouchableOpacity>
);

const GamesHub: React.FC = () => {
  const [selectedGameType, setSelectedGameType] = useState<string | null>(null);
  const [activeCompetitionTab, setActiveCompetitionTab] = useState<"live" | "upcoming" | "ended">("live");
  const router = useRouter();

  const handleJoinCompetition = (competition: any) => {
    router.push(`/quiz-pages/competition-detail?id=${competition.id}`);
  };

  const handleViewResults = (competition: any) => {
    Alert.alert("View Results", competition.title);
  };

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
            <FontAwesome5 name="gamepad" size={28} color="#A3E635" />
            <Text style={styles.headerTitle}>Game Arena</Text>
          </View>
          <Text style={styles.headerSubtitle}>Choose your battle, prove your trading skills</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <LinearGradient
            colors={['rgba(163, 230, 53, 0.1)', 'rgba(56, 189, 248, 0.1)']}
            style={styles.statCard}
          >
            <View style={styles.statIconRow}>
              <FontAwesome5 name="trophy" size={16} color="#A3E635" style={{ marginRight: 4 }} />
              <AnimatedCounter value={156} style={styles.statValue} />
            </View>
            <Text style={styles.statLabel}>Games Won</Text>
          </LinearGradient>
          <LinearGradient
            colors={['rgba(163, 230, 53, 0.1)', 'rgba(56, 189, 248, 0.1)']}
            style={styles.statCard}
          >
            <View style={styles.statIconRow}>
              <FontAwesome5 name="fire" size={16} color="#A3E635" style={{ marginRight: 4 }} />
              <AnimatedCounter value={12} style={styles.statValue} />
            </View>
            <Text style={styles.statLabel}>Win Streak</Text>
          </LinearGradient>
          <LinearGradient
            colors={['rgba(163, 230, 53, 0.1)', 'rgba(56, 189, 248, 0.1)']}
            style={styles.statCard}
          >
            <View style={styles.statIconRow}>
              <FontAwesome5 name="star" size={16} color="#A3E635" style={{ marginRight: 4 }} />
              <AnimatedCounter value={1842} style={styles.statValue} />
            </View>
            <Text style={styles.statLabel}>Best Score</Text>
          </LinearGradient>
        </View>

        {/* Game Types */}
        <Text style={styles.sectionTitle}>Choose Your Game</Text>
        {gameTypes.map((game) => {
          const isSelected = selectedGameType === game.id;
          return (
            <LinearGradient
              key={game.id}
              colors={['rgba(163, 230, 53, 0.1)', 'rgba(56, 189, 248, 0.1)']}
              style={[styles.gameCard, isSelected && styles.gameCardSelected]}
            >
              <TouchableOpacity
                onPress={() => setSelectedGameType(game.id)}
                style={styles.gameCardContent}
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
                          <FontAwesome5 name="crown" size={12} color="#A3E635" style={{ marginRight: 3 }} />
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
                    <FontAwesome5 name="users" size={14} color="#aaa" style={{ marginRight: 3 }} />
                    <Text style={styles.gameInfoText}>{game.players}</Text>
                  </View>
                  <View style={styles.gameInfoBox}>
                    <FontAwesome5 name="clock" size={14} color="#aaa" style={{ marginRight: 3 }} />
                    <Text style={styles.gameInfoText}>{game.duration}</Text>
                  </View>
                  <View style={styles.gameInfoBox}>
                    <FontAwesome5 name="bullseye" size={14} color="#aaa" style={{ marginRight: 3 }} />
                    <Text style={styles.gameInfoText}>{game.difficulty}</Text>
                  </View>
                  <View style={styles.gameInfoBox}>
                    <FontAwesome5 name="gift" size={14} color="#aaa" style={{ marginRight: 3 }} />
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
                  <FontAwesome5 name="play" size={16} color="#000" style={{ marginRight: 6 }} />
                  <Text style={styles.playButtonText}>Play Now</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </LinearGradient>
          );
        })}

        {/* Daily Challenges */}
        <Text style={styles.sectionTitle}>Daily Challenges</Text>
        {dailyChallenges.map((challenge) => (
          <LinearGradient
            key={challenge.id}
            colors={['rgba(163, 230, 53, 0.1)', 'rgba(56, 189, 248, 0.1)']}
            style={styles.challengeCard}
          >
            <View style={styles.challengeHeaderRow}>
              <Text style={styles.challengeTitle}>{challenge.title}</Text>
              <View style={styles.challengeRewardRow}>
                <FontAwesome5 name="gift" size={16} color="#A3E635" style={{ marginRight: 4 }} />
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
          </LinearGradient>
        ))}

        {/* Recent Games */}
        <Text style={styles.sectionTitle}>Recent Games</Text>
        <LinearGradient
          colors={['rgba(163, 230, 53, 0.1)', 'rgba(56, 189, 248, 0.1)']}
          style={styles.recentGameCard}
        >
          <View style={styles.recentGameHeaderRow}>
            <View style={styles.recentGameTypeRow}>
              <FontAwesome5 name="bolt" size={16} color="#A3E635" style={{ marginRight: 4 }} />
              <Text style={styles.recentGameTypeText}>1v1 Duel</Text>
            </View>
            <View style={styles.recentGameBadge}>
              <FontAwesome5 name="chart-line" size={12} color="#A3E635" style={{ marginRight: 3 }} />
              <Text style={styles.recentGameBadgeText}>Victory</Text>
            </View>
          </View>
          <View style={styles.recentGamePlayersRow}>
            <View style={styles.recentGamePlayerBox}>
              <FontAwesome5 name="user" size={16} color="#aaa" />
              <Text style={styles.recentGamePlayerText}>You</Text>
            </View>
            <View style={styles.recentGameScoreBox}>
              <Text style={styles.recentGameScore}>8 - 5</Text>
              <Text style={styles.recentGameTopic}>Options Trading</Text>
            </View>
            <View style={styles.recentGamePlayerBox}>
              <Text style={styles.recentGamePlayerText}>Alex_T</Text>
              <FontAwesome5 name="user" size={16} color="#aaa" />
            </View>
          </View>
          <View style={styles.recentGameXPRow}>
            <Text style={styles.recentGameXPLabel}>XP Earned:</Text>
            <Text style={styles.recentGameXPValue}>+125 XP</Text>
          </View>
        </LinearGradient>

        {/* Competitions Section */}
        <Text style={styles.sectionTitle}>Competitions</Text>
        
        {/* Competition Tabs */}
        <View style={styles.tabsRow}>
          <TabButton
            label="Live"
            active={activeCompetitionTab === "live"}
            onPress={() => setActiveCompetitionTab("live")}
            count={competitions.live.length}
            pulse
          />
          <TabButton
            label="Upcoming"
            active={activeCompetitionTab === "upcoming"}
            onPress={() => setActiveCompetitionTab("upcoming")}
            count={competitions.upcoming.length}
          />
          <TabButton
            label="Ended"
            active={activeCompetitionTab === "ended"}
            onPress={() => setActiveCompetitionTab("ended")}
            count={competitions.ended.length}
          />
        </View>

        {/* Competition Cards */}
        {activeCompetitionTab === "live" &&
          competitions.live.map((competition) => (
            <LinearGradient
              key={competition.id}
              colors={['rgba(163, 230, 53, 0.1)', 'rgba(56, 189, 248, 0.1)']}
              style={styles.competitionCard}
            >
              <View style={styles.cardHeader}>
                <View style={styles.iconTitleRow}>
                  {competition.icon}
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.cardTitle}>{competition.title}</Text>
                    <Text style={styles.cardSubtitle}>{competition.subtitle}</Text>
                  </View>
                </View>
                <View style={styles.statusBadgeLive}>
                  <Text style={styles.statusBadgeText}>{competition.status}</Text>
                </View>
              </View>
              <View style={styles.infoGrid}>
                <View style={styles.infoBox}>
                  <FontAwesome5 name="users" size={16} color="#aaa" />
                  <Text style={styles.infoLabel}>Participants</Text>
                  <Text style={styles.infoValue}>{competition.participants.toLocaleString()}</Text>
                </View>
                <View style={styles.infoBox}>
                  <FontAwesome5 name="gift" size={16} color="#A3E635" />
                  <Text style={styles.infoLabel}>Prize Pool</Text>
                  <Text style={[styles.infoValue, { color: "#A3E635" }]}>{competition.prizePool}</Text>
                </View>
              </View>
              <View style={styles.timeRow}>
                <FontAwesome5 name="clock" size={16} color="#ef4444" />
                <Text style={styles.timeText}>Ends in {competition.timeLeft}</Text>
              </View>
              <TouchableOpacity
                style={styles.glowingButton}
                onPress={() => handleJoinCompetition(competition)}
              >
                <FontAwesome5 name="trophy" size={16} color="#000" style={{ marginRight: 8 }} />
                <Text style={styles.glowingButtonText}>Join Competition</Text>
              </TouchableOpacity>
            </LinearGradient>
          ))}

        {activeCompetitionTab === "upcoming" &&
          competitions.upcoming.map((competition) => (
            <LinearGradient
              key={competition.id}
              colors={['rgba(163, 230, 53, 0.1)', 'rgba(56, 189, 248, 0.1)']}
              style={styles.competitionCard}
            >
              <View style={styles.cardHeader}>
                <View style={styles.iconTitleRow}>
                  {competition.icon}
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.cardTitle}>{competition.title}</Text>
                    <Text style={styles.cardSubtitle}>{competition.subtitle}</Text>
                  </View>
                </View>
                <View style={styles.statusBadgeUpcoming}>
                  <Text style={styles.statusBadgeText}>{competition.status}</Text>
                </View>
              </View>
              <View style={styles.infoGrid}>
                <View style={styles.infoBox}>
                  <FontAwesome5 name="users" size={16} color="#aaa" />
                  <Text style={styles.infoLabel}>Registered</Text>
                  <Text style={styles.infoValue}>
                    {competition.participants}/{competition.maxParticipants}
                  </Text>
                </View>
                <View style={styles.infoBox}>
                  <FontAwesome5 name="gift" size={16} color="#A3E635" />
                  <Text style={styles.infoLabel}>Prize Pool</Text>
                  <Text style={[styles.infoValue, { color: "#A3E635" }]}>{competition.prizePool}</Text>
                </View>
              </View>
              <View style={styles.timeRow}>
                <FontAwesome5 name="calendar" size={16} color="#aaa" />
                <Text style={styles.timeText}>Starts {competition.startDate}</Text>
              </View>
              <TouchableOpacity
                style={styles.upcomingButton}
                onPress={() => handleJoinCompetition(competition)}
              >
                <FontAwesome5 name="trophy" size={16} color="#000" style={{ marginRight: 8 }} />
                <Text style={styles.upcomingButtonText}>Register Now</Text>
              </TouchableOpacity>
            </LinearGradient>
          ))}

        {activeCompetitionTab === "ended" &&
          competitions.ended.map((competition) => (
            <LinearGradient
              key={competition.id}
              colors={['rgba(163, 230, 53, 0.1)', 'rgba(56, 189, 248, 0.1)']}
              style={styles.competitionCard}
            >
              <View style={styles.cardHeader}>
                <View style={styles.iconTitleRow}>
                  {competition.icon}
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.cardTitle}>{competition.title}</Text>
                    <Text style={styles.cardSubtitle}>{competition.subtitle}</Text>
                  </View>
                </View>
                <View style={styles.statusBadgeEnded}>
                  <Text style={styles.statusBadgeText}>{competition.status}</Text>
                </View>
              </View>
              <View style={styles.infoGrid}>
                <View style={styles.infoBox}>
                  <FontAwesome5 name="users" size={16} color="#aaa" />
                  <Text style={styles.infoLabel}>Participants</Text>
                  <Text style={styles.infoValue}>{competition.participants.toLocaleString()}</Text>
                </View>
                <View style={styles.infoBox}>
                  <FontAwesome5 name="trophy" size={16} color="#A3E635" />
                  <Text style={styles.infoLabel}>Winner</Text>
                  <Text style={styles.infoValue}>{competition.winner}</Text>
                </View>
              </View>
              <View style={styles.timeRow}>
                <FontAwesome5 name="calendar" size={16} color="#aaa" />
                <Text style={styles.timeText}>Ended {competition.endDate}</Text>
              </View>
              <TouchableOpacity
                style={styles.endedButton}
                onPress={() => handleViewResults(competition)}
              >
                <FontAwesome5 name="trophy" size={16} color="#A3E635" style={{ marginRight: 8 }} />
                <Text style={styles.endedButtonText}>View Results</Text>
              </TouchableOpacity>
            </LinearGradient>
          ))}
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
  header: { 
    alignItems: "center", 
    marginBottom: 16 
  },
  headerIconRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 4 
  },
  headerTitle: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginLeft: 8,
    color: '#fff'
  },
  headerSubtitle: { 
    color: "#aaa", 
    fontSize: 14 
  },
  statsRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 16,
    gap: 8
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(163, 230, 53, 0.2)'
  },
  statIconRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 4 
  },
  statValue: { 
    fontWeight: "bold", 
    fontSize: 18,
    color: '#fff'
  },
  statLabel: { 
    fontSize: 12, 
    color: "#aaa" 
  },
  sectionTitle: { 
    fontWeight: "bold", 
    fontSize: 16, 
    marginBottom: 8,
    color: '#fff'
  },
  gameCard: {
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(163, 230, 53, 0.2)'
  },
  gameCardContent: {
    padding: 16
  },
  gameCardSelected: { 
    borderColor: "#A3E635"
  },
  gameHeaderRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 8 
  },
  gameIconCircle: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    alignItems: "center", 
    justifyContent: "center" 
  },
  gameTitle: { 
    fontWeight: "bold", 
    fontSize: 16, 
    marginRight: 8,
    color: '#fff'
  },
  badgePopular: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "rgba(163, 230, 53, 0.2)", 
    borderRadius: 8, 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    marginLeft: 4 
  },
  badgePopularText: { 
    color: "#A3E635", 
    fontWeight: "bold", 
    fontSize: 13 
  },
  badgeNew: { 
    backgroundColor: "rgba(56, 189, 248, 0.2)", 
    borderRadius: 8, 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    marginLeft: 4 
  },
  badgeNewText: { 
    color: "#38bdf8", 
    fontWeight: "bold", 
    fontSize: 13 
  },
  badgeHot: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "rgba(239, 68, 68, 0.2)", 
    borderRadius: 8, 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    marginLeft: 4 
  },
  badgeHotText: { 
    color: "#ef4444", 
    fontWeight: "bold", 
    fontSize: 13 
  },
  gameSubtitle: { 
    color: "#aaa", 
    fontSize: 13 
  },
  gameDesc: { 
    color: "#fff", 
    fontSize: 14, 
    marginVertical: 8 
  },
  gameInfoRow: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    marginBottom: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 12,
    borderRadius: 8
  },
  gameInfoBox: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginRight: 12, 
    marginBottom: 4 
  },
  gameInfoText: { 
    color: "#aaa", 
    fontSize: 12 
  },
  gameStatsRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 12,
    borderRadius: 8
  },
  gameStatsBox: { 
    flex: 1, 
    alignItems: "center" 
  },
  gameStatsLabel: { 
    color: "#aaa", 
    fontSize: 12 
  },
  gameStatsValue: { 
    fontWeight: "bold", 
    fontSize: 14,
    color: '#fff'
  },
  playButton: { 
    flexDirection: "row", 
    backgroundColor: "#A3E635", 
    borderRadius: 10, 
    alignItems: "center", 
    justifyContent: "center", 
    paddingVertical: 12, 
    marginTop: 8 
  },
  playButtonText: { 
    color: "#000", 
    fontWeight: "bold", 
    fontSize: 16 
  },
  challengeCard: { 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: 'rgba(163, 230, 53, 0.2)' 
  },
  challengeHeaderRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    marginBottom: 4 
  },
  challengeTitle: { 
    fontWeight: "bold", 
    fontSize: 15,
    color: '#fff'
  },
  challengeRewardRow: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  challengeRewardText: { 
    color: "#A3E635", 
    fontWeight: "bold", 
    fontSize: 14 
  },
  challengeDesc: { 
    color: "#aaa", 
    fontSize: 13, 
    marginBottom: 8 
  },
  challengeProgressRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 4 
  },
  challengeProgressLabel: { 
    color: "#aaa", 
    fontSize: 13 
  },
  challengeProgressValue: { 
    fontWeight: "bold", 
    fontSize: 13,
    color: '#fff'
  },
  progressBarBackground: { 
    width: "100%", 
    height: 8, 
    backgroundColor: "rgba(0, 0, 0, 0.2)", 
    borderRadius: 4, 
    overflow: "hidden", 
    marginBottom: 8 
  },
  progressBarFill: { 
    height: 8, 
    backgroundColor: "#A3E635", 
    borderRadius: 4 
  },
  recentGameCard: { 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: 'rgba(163, 230, 53, 0.2)' 
  },
  recentGameHeaderRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    marginBottom: 4 
  },
  recentGameTypeRow: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  recentGameTypeText: { 
    color: "#A3E635", 
    fontWeight: "bold", 
    fontSize: 14 
  },
  recentGameBadge: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "rgba(163, 230, 53, 0.2)", 
    borderRadius: 8, 
    paddingHorizontal: 8, 
    paddingVertical: 2 
  },
  recentGameBadgeText: { 
    color: "#A3E635", 
    fontWeight: "bold", 
    fontSize: 13 
  },
  recentGamePlayersRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    marginBottom: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 12,
    borderRadius: 8
  },
  recentGamePlayerBox: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  recentGamePlayerText: { 
    color: "#aaa", 
    fontSize: 13, 
    marginLeft: 4 
  },
  recentGameScoreBox: { 
    alignItems: "center" 
  },
  recentGameScore: { 
    fontWeight: "bold", 
    fontSize: 18,
    color: '#fff'
  },
  recentGameTopic: { 
    color: "#aaa", 
    fontSize: 12 
  },
  recentGameXPRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    borderTopWidth: 1, 
    borderColor: 'rgba(163, 230, 53, 0.2)', 
    paddingTop: 8 
  },
  recentGameXPLabel: { 
    color: "#aaa", 
    fontSize: 13 
  },
  recentGameXPValue: { 
    color: "#A3E635", 
    fontWeight: "bold", 
    fontSize: 14 
  },
  tabsRow: { 
    flexDirection: "row", 
    marginBottom: 12, 
    marginTop: 4,
    gap: 8
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    alignItems: "center",
    position: "relative",
  },
  tabButtonActive: { 
    backgroundColor: "rgba(163, 230, 53, 0.2)" 
  },
  tabButtonText: { 
    color: "#aaa", 
    fontWeight: "500" 
  },
  tabButtonTextActive: { 
    color: "#A3E635" 
  },
  pulseDot: {
    position: "absolute",
    top: 6,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#A3E635",
  },
  competitionCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(163, 230, 53, 0.2)'
  },
  cardHeader: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between" 
  },
  iconTitleRow: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  cardTitle: { 
    fontSize: 16, 
    fontWeight: "bold",
    color: '#fff'
  },
  cardSubtitle: { 
    fontSize: 13, 
    color: "#aaa" 
  },
  statusBadgeLive: {
    backgroundColor: "rgba(163, 230, 53, 0.2)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  statusBadgeUpcoming: {
    backgroundColor: "rgba(56, 189, 248, 0.2)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  statusBadgeEnded: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  statusBadgeText: { 
    fontWeight: "bold", 
    color: "#fff", 
    fontSize: 12 
  },
  infoGrid: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 12, 
    marginTop: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 12,
    borderRadius: 8
  },
  infoBox: { 
    flex: 1, 
    alignItems: "center" 
  },
  infoLabel: { 
    fontSize: 12, 
    color: "#aaa", 
    marginTop: 2 
  },
  infoValue: { 
    fontWeight: "bold", 
    fontSize: 15, 
    marginTop: 2,
    color: '#fff'
  },
  timeRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 12,
    borderRadius: 8
  },
  timeText: { 
    marginLeft: 6, 
    fontSize: 13, 
    color: "#aaa", 
    fontWeight: "500" 
  },
  glowingButton: {
    flexDirection: "row",
    backgroundColor: "#A3E635",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    marginTop: 8,
    marginBottom: 4,
  },
  glowingButtonText: { 
    color: "#000", 
    fontWeight: "bold", 
    fontSize: 16 
  },
  upcomingButton: {
    flexDirection: "row",
    backgroundColor: "#A3E635",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    marginTop: 8,
    marginBottom: 4,
  },
  upcomingButtonText: { 
    color: "#000", 
    fontWeight: "bold", 
    fontSize: 16 
  },
  endedButton: {
    flexDirection: "row",
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    borderColor: "#A3E635",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    marginTop: 8,
    marginBottom: 4,
  },
  endedButtonText: { 
    color: "#A3E635", 
    fontWeight: "bold", 
    fontSize: 16 
  },
});

export default GamesHub; 
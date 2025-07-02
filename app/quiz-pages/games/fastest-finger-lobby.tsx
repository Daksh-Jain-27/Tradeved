import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { AnimatedCounter } from "../../../components/ui/AnimatedCounter";
import QuizNavBar from "../../../components/QuizNavBar";
import { Stack, useRouter } from 'expo-router';

const colors = {
  background: "#242620",
  foreground: "#f8fafc",
  card: "rgba(30, 41, 59, 0.5)",
  "muted-foreground": "#94a3b8",
  border: "#334155",
  primary: "#f8fafc",
  "mango-green": "#9BEC00",
  "mango-green-foreground": "#000000",
  "royal-red": "#CC0066",
  "royal-red-foreground": "#FFFFFF",
  "middle-yellow": "#FFD900",
  "middle-yellow-foreground": "#000000",
  "brilliant-azure": "#2FBEFF",
  "brilliant-azure-foreground": "#000000",
};

const tournamentModes = [
  {
    id: "knockout",
    title: "Knockout Tournament",
    subtitle: "Elimination rounds",
    description: "Survive each round to advance. Last player standing wins!",
    players: "8-16 Players",
    rounds: "3-4 Rounds",
    duration: "8-12 min",
    xpRange: "100-500 XP",
    color: "royal-red",
    bgColor: "rgba(204, 0, 102, 0.1)",
    borderColor: "rgba(204, 0, 102, 0.2)",
    isPopular: true,
    prize: "₹2,500",
  },
  {
    id: "survival",
    title: "Survival Mode",
    subtitle: "Last player standing",
    description: "Answer quickly or get eliminated. Speed and accuracy matter!",
    players: "6-12 Players",
    rounds: "Until 1 Left",
    duration: "5-10 min",
    xpRange: "75-300 XP",
    color: "brilliant-azure",
    bgColor: "rgba(47, 190, 255, 0.1)",
    borderColor: "rgba(47, 190, 255, 0.2)",
    prize: "₹1,000",
  },
  {
    id: "blitz",
    title: "Blitz Rounds",
    subtitle: "Quick elimination",
    description: "Fast-paced rounds with instant elimination for wrong answers",
    players: "4-8 Players",
    rounds: "5 Rounds",
    duration: "3-5 min",
    xpRange: "50-200 XP",
    color: "middle-yellow",
    bgColor: "rgba(255, 217, 0, 0.1)",
    borderColor: "rgba(255, 217, 0, 0.2)",
    prize: "₹500",
  },
];

const activeTournaments = [
  {
    id: 1,
    title: "Elite Traders Championship",
    mode: "Knockout",
    players: 12,
    maxPlayers: 16,
    startTime: "2m 15s",
    prize: "₹5,000",
    difficulty: "Expert",
    entryFee: "50 XP",
  },
  {
    id: 2,
    title: "Speed Trading Challenge",
    mode: "Survival",
    players: 8,
    maxPlayers: 12,
    startTime: "Starting Soon",
    prize: "₹2,000",
    difficulty: "Medium",
    entryFee: "25 XP",
  },
];

const recentResults = [
  {
    id: 1,
    tournament: "Options Masters",
    position: 2,
    totalPlayers: 16,
    prize: "₹1,500",
    xpEarned: 250,
  },
  {
    id: 2,
    tournament: "Quick Fire Round",
    position: 1,
    totalPlayers: 8,
    prize: "₹1,000",
    xpEarned: 300,
  },
];

const Progress = ({ value }: { value: number }) => (
  <View style={styles.progressContainer}>
    <View style={[styles.progressBar, { width: `${value}%` }]} />
  </View>
);

export default function FastestFingerLobbyScreen() {
  const [selectedMode, setSelectedMode] = useState("knockout");
  const [tournamentWins] = useState(23);
  const [bestPosition] = useState(1);
  const [winRate] = useState(67);
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false
        }}
      />
      <QuizNavBar />
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Fastest Finger</Text>
            <Text style={styles.headerSubtitle}>Speed and accuracy combined</Text>
          </View>
          <TouchableOpacity style={styles.iconButton} onPress={() => alert("Settings")}>
            <Feather name="settings" size={20} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        {/* Tournament Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <MaterialCommunityIcons name="trophy-outline" size={16} color={colors["royal-red"]} />
              <AnimatedCounter value={tournamentWins} style={[styles.statValue, { color: colors["royal-red"] }]} />
            </View>
            <Text style={styles.statLabel}>Tournaments Won</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <MaterialCommunityIcons name="crown-outline" size={16} color={colors["middle-yellow"]} />
              <Text style={[styles.statValue, { color: colors["middle-yellow"] }]}>#{bestPosition}</Text>
            </View>
            <Text style={styles.statLabel}>Best Position</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Feather name="target" size={16} color={colors["mango-green"]} />
              <Text style={[styles.statValue, { color: colors["mango-green"] }]}>{winRate}%</Text>
            </View>
            <Text style={styles.statLabel}>Win Rate</Text>
          </View>
        </View>

        {/* Quick Join */}
        <TouchableOpacity style={styles.glowingButton} onPress={() => router.push('/quiz-pages/games/fastest-finger-join')}>
          <Feather name="zap" size={24} color={colors["middle-yellow-foreground"]} style={{ marginRight: 12 }} />
          <Text style={styles.glowingButtonText}>Quick Join Tournament</Text>
        </TouchableOpacity>

        {/* Tournament Modes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tournament Modes</Text>
          {tournamentModes.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={[
                styles.modeCard,
                { backgroundColor: mode.bgColor, borderColor: mode.borderColor },
                selectedMode === mode.id && { borderWidth: 2, borderColor: colors.primary }
              ]}
              onPress={() => setSelectedMode(mode.id)}
            >
              <View style={styles.modeCardHeader}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Text style={styles.modeTitle}>{mode.title}</Text>
                    {mode.isPopular && (
                      <View style={styles.popularBadge}>
                        <MaterialCommunityIcons name="fire" size={14} color={colors["royal-red-foreground"]} style={{ marginRight: 4 }} />
                        <Text style={styles.popularBadgeText}>Popular</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.modeSubtitle}>{mode.subtitle}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.prizeText}>{mode.prize}</Text>
                  <Text style={styles.xpRangeText}>{mode.xpRange}</Text>
                </View>
              </View>
              <Text style={styles.modeDescription}>{mode.description}</Text>
              <View style={styles.modeDetailsGrid}>
                <View style={styles.modeDetailItem}><Text style={styles.detailLabel}>Players</Text><Text style={styles.detailValue}>{mode.players}</Text></View>
                <View style={styles.modeDetailItem}><Text style={styles.detailLabel}>Rounds</Text><Text style={styles.detailValue}>{mode.rounds}</Text></View>
                <View style={styles.modeDetailItem}><Text style={styles.detailLabel}>Duration</Text><Text style={styles.detailValue}>{mode.duration}</Text></View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Active Tournaments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Tournaments</Text>
            <View style={styles.liveBadge}><MaterialCommunityIcons name="timer-sand" size={14} color={colors["royal-red"]} /><Text style={styles.liveBadgeText}>{activeTournaments.length} Live</Text></View>
          </View>
          {activeTournaments.map((t) => (
            <View key={t.id} style={styles.tournamentCard}>
              <View style={styles.tournamentHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.tournamentTitle}>{t.title}</Text>
                  <Text style={styles.tournamentSubtitle}>{t.mode} • {t.difficulty}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.prizeText}>{t.prize}</Text>
                  <Text style={styles.xpRangeText}>Entry: {t.entryFee}</Text>
                </View>
              </View>
              <View style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}><Text style={styles.detailLabel}>Players</Text><Text style={styles.detailValue}>{t.players}/{t.maxPlayers}</Text></View>
                <Progress value={(t.players / t.maxPlayers) * 100} />
              </View>
              <View style={styles.tournamentFooter}>
                <View style={styles.infoItem}><Feather name="clock" size={14} color={colors["muted-foreground"]} /><Text style={styles.infoText}>{t.startTime}</Text></View>
                <TouchableOpacity style={[styles.joinButton, t.players >= t.maxPlayers && styles.disabledButton]} disabled={t.players >= t.maxPlayers}><Text style={styles.joinButtonText}>{t.players >= t.maxPlayers ? "Full" : "Join"}</Text></TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Results */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Results</Text>
          {recentResults.map(result => (
            <View key={result.id} style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <View>
                  <Text style={styles.tournamentTitle}>{result.tournament}</Text>
                  <Text style={styles.tournamentSubtitle}>Position #{result.position} of {result.totalPlayers}</Text>
                </View>
                <View style={[styles.positionBadge, { backgroundColor: result.position === 1 ? colors["middle-yellow"] : result.position <= 3 ? colors["mango-green"] : colors["brilliant-azure"] }]}>
                  {result.position === 1 && <MaterialCommunityIcons name="crown" size={12} color={colors["middle-yellow-foreground"]} style={{ marginRight: 4 }} />}
                  <Text style={{ color: result.position === 1 ? colors["middle-yellow-foreground"] : result.position <= 3 ? colors["mango-green-foreground"] : colors["brilliant-azure-foreground"], fontWeight: 'bold', fontSize: 12 }}>
                    {result.position === 1 ? 'Winner' : `#${result.position}`}
                  </Text>
                </View>
              </View>
              <View style={styles.resultFooter}>
                <Text style={styles.infoText}>Prize: <Text style={{ fontWeight: 'bold', color: colors["middle-yellow"] }}>{result.prize}</Text></Text>
                <Text style={styles.infoText}>XP: <Text style={{ fontWeight: 'bold', color: colors["mango-green"] }}>+{result.xpEarned}</Text></Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: colors.foreground },
  headerSubtitle: { fontSize: 14, color: colors["muted-foreground"] },
  iconButton: { padding: 8 },
  statsCard: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'rgba(204, 0, 102, 0.05)', borderRadius: 12, padding: 16, marginVertical: 24, borderWidth: 1, borderColor: 'rgba(204, 0, 102, 0.2)' },
  statItem: { alignItems: 'center' },
  statIconContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: 'bold', marginLeft: 4 },
  statLabel: { fontSize: 12, color: colors["muted-foreground"] },
  glowingButton: { backgroundColor: colors["royal-red"], paddingVertical: 16, borderRadius: 12, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginBottom: 24 },
  glowingButtonText: { color: colors["royal-red-foreground"], fontSize: 18, fontWeight: 'bold' },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: colors.foreground },
  modeCard: { borderWidth: 1, borderRadius: 12, padding: 16, marginBottom: 12 },
  modeCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  modeTitle: { fontSize: 16, fontWeight: 'bold', color: colors.foreground },
  popularBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors["royal-red"], borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4, marginLeft: 8 },
  popularBadgeText: { color: colors["royal-red-foreground"], fontSize: 12, fontWeight: 'bold' },
  modeSubtitle: { fontSize: 14, color: colors["muted-foreground"] },
  prizeText: { fontSize: 14, fontWeight: '600', color: colors["middle-yellow"] },
  xpRangeText: { fontSize: 12, color: colors["muted-foreground"] },
  modeDescription: { fontSize: 14, color: colors["muted-foreground"], marginBottom: 12, lineHeight: 20 },
  modeDetailsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  modeDetailItem: { alignItems: 'center' },
  detailLabel: { fontSize: 12, color: colors["muted-foreground"] },
  detailValue: { fontSize: 14, color: colors.foreground, fontWeight: '500', marginTop: 2 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(204, 0, 102, 0.1)', borderColor: 'rgba(204, 0, 102, 0.5)', borderWidth: 1, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 },
  liveBadgeText: { color: colors["royal-red"], fontWeight: 'bold', fontSize: 12, marginLeft: 4 },
  tournamentCard: { backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  tournamentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  tournamentTitle: { fontSize: 16, fontWeight: 'bold', color: colors.foreground },
  tournamentSubtitle: { fontSize: 14, color: colors["muted-foreground"], marginTop: 2 },
  tournamentFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  infoItem: { flexDirection: 'row', alignItems: 'center' },
  infoText: { marginLeft: 6, color: colors["muted-foreground"], fontSize: 14 },
  joinButton: { backgroundColor: colors["royal-red"], borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16 },
  joinButtonText: { color: colors["royal-red-foreground"], fontWeight: 'bold' },
  disabledButton: { opacity: 0.5 },
  resultCard: { backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  positionBadge: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 },
  resultFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 8, marginTop: 8 },
  progressContainer: { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: colors.primary },
});

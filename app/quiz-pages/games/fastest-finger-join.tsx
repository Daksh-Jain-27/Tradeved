import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import QuizNavBar from "../../../components/QuizNavBar";
import { Stack, useRouter } from 'expo-router';

// HSL to HEX conversion and color palette
const hsl = (h: number, s: number, l: number) => `hsl(${h}, ${s}%, ${l}%)`;

const colors = {
  background: '#242620',
  foreground: hsl(210, 40, 98),
  card: hsl(222.2, 84, 4.9),
  "card-foreground": hsl(210, 40, 98),
  primary: hsl(210, 40, 98),
  "primary-foreground": hsl(222.2, 47.4, 11.2),
  "muted-foreground": hsl(215, 20.2, 65.1),
  border: hsl(217.2, 32.6, 17.5),
  yellow: {
    500: "#f59e0b",
  },
};

const playersData = [
  { id: 1, name: "You", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704a", level: 5 },
  { id: 2, name: "TradeMaster92", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704b", level: 7 },
  { id: 3, name: "InvestorPro", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704c", level: 4 },
  { id: 4, name: "MarketGuru", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d", level: 6 },
  { id: 5, name: "StockWhiz", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e", level: 3 },
];

const ProgressBar = ({ value }: { value: number }) => (
  <View style={styles.progressContainer}>
    <View style={[styles.progressBar, { width: `${value}%` }]} />
  </View>
);


export default function FastestFingerJoinScreen() {
  const [matchStatus, setMatchStatus] = useState<"waiting" | "matching" | "ready">("waiting");
  const [playersJoined, setPlayersJoined] = useState(1);
  const [matchingProgress, setMatchingProgress] = useState(0);
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    if (matchStatus === "waiting") {
      const timer = setTimeout(() => setMatchStatus("matching"), 2000);
      return () => clearTimeout(timer);
    }

    if (matchStatus === "matching") {
      const progressInterval = setInterval(() => {
        setMatchingProgress((prev) => (prev >= 100 ? 100 : prev + 2));
      }, 100);

      const playerInterval = setInterval(() => {
        setPlayersJoined((prev) => (prev >= 5 ? 5 : prev + 1));
      }, 1500);

      if (matchingProgress >= 100 && playersJoined >= 5) {
        setMatchStatus("ready");
      }

      return () => {
        clearInterval(progressInterval);
        clearInterval(playerInterval);
      };
    }

    if (matchStatus === "ready") {
      const countdownTimer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            // Navigate to game
            alert("Starting game!");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdownTimer);
    }
  }, [matchStatus, matchingProgress, playersJoined]);

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
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={16} color={colors.foreground} />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.logo}>TradeVed</Text>
          <View style={{ width: 80 }} />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Feather name="zap" size={24} color={colors.yellow[500]} />
              <Text style={styles.cardTitle}>Fastest Finger First</Text>
            </View>
            <Text style={styles.cardDescription}>
              {matchStatus === "waiting" && "Finding players for your match..."}
              {matchStatus === "matching" && `${playersJoined}/5 Players joined`}
              {matchStatus === "ready" && "Match ready! Starting in..."}
            </Text>
          </View>

          <View style={styles.cardContent}>
            {matchStatus === "waiting" && (
              <View style={styles.statusContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.statusText}>Looking for players...</Text>
              </View>
            )}

            {matchStatus === "matching" && (
              <>
                <ProgressBar value={matchingProgress} />
                <View style={styles.playerListContainer}>
                  <View style={styles.playerListHeader}>
                    <Text style={styles.playerListTitle}>Players</Text>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{playersJoined}/5</Text>
                    </View>
                  </View>
                  {playersData.slice(0, playersJoined).map((player) => (
                    <View key={player.id} style={styles.playerRow}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={{ uri: player.avatar }} style={styles.avatar} />
                        <View>
                          <Text style={styles.playerName}>{player.name}</Text>
                          <Text style={styles.playerLevel}>Level {player.level}</Text>
                        </View>
                      </View>
                      {player.id === 1 && (
                        <View style={styles.youBadge}>
                          <Text style={styles.youBadgeText}>You</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              </>
            )}

            {matchStatus === "ready" && (
              <View style={styles.statusContainer}>
                <View style={styles.readyPlayerGrid}>
                  {playersData.map((player) => (
                    <View key={player.id} style={styles.readyPlayerItem}>
                      <Image source={{ uri: player.avatar }} style={styles.readyAvatar} />
                      <Text style={styles.readyPlayerName}>{player.name}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.countdownCircle}>
                  <Text style={styles.countdownText}>{countdown}</Text>
                </View>
                <Text style={styles.readyTitle}>Get ready!</Text>
                <Text style={styles.readySubtitle}>Be the first to answer correctly to earn bonus points</Text>
              </View>
            )}

            <View style={styles.footer}>
              <View style={styles.footerInfoRow}>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons name="trophy" size={16} color={colors["muted-foreground"]} />
                  <Text style={styles.infoText}>Top prize: 500 XP</Text>
                </View>
                <View style={styles.infoItem}>
                  <Feather name="clock" size={16} color={colors["muted-foreground"]} />
                  <Text style={styles.infoText}>5 questions</Text>
                </View>
                <View style={styles.infoItem}>
                  <Feather name="users" size={16} color={colors["muted-foreground"]} />
                  <Text style={styles.infoText}>5 players</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()} disabled={matchStatus === "ready"}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  backButton: { flexDirection: 'row', alignItems: 'center', },
  backButtonText: { color: colors.foreground, marginLeft: 8 },
  logo: { fontSize: 20, fontWeight: 'bold', color: colors.foreground },
  card: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12 },
  cardHeader: { alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: colors.border },
  cardTitleContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  cardTitle: { fontSize: 22, fontWeight: 'bold', color: colors["card-foreground"], marginLeft: 8 },
  cardDescription: { color: colors["muted-foreground"] },
  cardContent: { padding: 16, },
  statusContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 32 },
  statusText: { color: colors["muted-foreground"], marginTop: 16 },
  progressContainer: { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden', marginBottom: 24 },
  progressBar: { height: '100%', backgroundColor: colors.primary },
  playerListContainer: {},
  playerListHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  playerListTitle: { fontWeight: '500', color: colors.foreground },
  badge: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { color: colors.foreground, fontSize: 12 },
  playerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 8, borderWidth: 1, borderColor: colors.border, borderRadius: 8, marginBottom: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  playerName: { fontWeight: '500', color: colors.foreground },
  playerLevel: { fontSize: 12, color: colors["muted-foreground"] },
  youBadge: { backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 },
  youBadgeText: { color: colors["primary-foreground"], fontSize: 12, fontWeight: 'bold' },
  readyPlayerGrid: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 24 },
  readyPlayerItem: { alignItems: 'center', width: 60 },
  readyAvatar: { width: 48, height: 48, borderRadius: 24, marginBottom: 8 },
  readyPlayerName: { fontSize: 12, fontWeight: '500', color: colors.foreground, textAlign: 'center' },
  countdownCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  countdownText: { fontSize: 48, fontWeight: 'bold', color: colors["primary-foreground"] },
  readyTitle: { fontSize: 18, fontWeight: '500', color: colors.foreground, marginBottom: 4 },
  readySubtitle: { color: colors["muted-foreground"], textAlign: 'center' },
  footer: { marginTop: 24 },
  footerInfoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  infoItem: { flexDirection: 'row', alignItems: 'center' },
  infoText: { marginLeft: 4, color: colors["muted-foreground"], fontSize: 12 },
  cancelButton: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, alignItems: 'center' },
  cancelButtonText: { color: colors.foreground },
}); 
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QuizNavBar from "../../components/QuizNavBar";

const PostMatchResults: React.FC = () => {
  const router = useRouter();
  return (
    <>
      <QuizNavBar />
      <Stack.Screen
        options={{
          headerShown: false
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Victory Header */}
        <View style={styles.centered}>
          <View style={styles.trophyWrap}>
            <Feather name="award" size={64} color="#fde047" style={styles.trophyIcon} />
            <View style={styles.trophyGlow} />
          </View>
          <View style={styles.badgeVictory}>
            <Text style={styles.badgeVictoryText}>Victory!</Text>
          </View>
          <Text style={styles.headerTitle}>Match Complete</Text>
        </View>
        {/* Score Card */}
        <LinearGradient
          colors={['rgba(163, 230, 53, 0.1)', 'rgba(56, 189, 248, 0.1)']}
          style={styles.cardScore}
        >
          <View style={styles.scoreRow}>
            <View style={styles.playerCol}>
              <View style={styles.avatarWrap}>
                <Image source={require("../../assets/images/profile.png")} style={styles.avatar} />
              </View>
              <Text style={styles.playerName}>You</Text>
              <View style={styles.eloRow}>
                <Feather name="trending-up" size={14} color="#A3E635" style={{ marginRight: 2 }} />
                <Text style={styles.eloChange}>+18 ELO</Text>
              </View>
            </View>
            <View style={styles.scoreCol}>
              <Text style={styles.scoreText}>8 - 5</Text>
              <Text style={styles.scoreSub}>Options Trading</Text>
            </View>
            <View style={styles.playerCol}>
              <View style={styles.avatarWrap}>
                <Image source={require("../../assets/images/profile.png")} style={styles.avatar} />
              </View>
              <Text style={styles.playerName}>Alex_Trader</Text>
              <View style={styles.eloRow}>
                <Feather name="trending-up" size={14} color="#ef4444" style={{ marginRight: 2, transform: [{ rotate: "180deg" }] }} />
                <Text style={[styles.eloChange, { color: "#ef4444" }]}>-15 ELO</Text>
              </View>
            </View>
          </View>
          {/* Rewards */}
          <View style={styles.rewardsRow}>
            <View style={styles.rewardCard}>
              <Text style={styles.rewardLabel}>XP Earned</Text>
              <Text style={styles.rewardValue}>+125</Text>
            </View>
            <View style={styles.rewardCard}>
              <Text style={styles.rewardLabel}>New Rating</Text>
              <Text style={styles.rewardValue}>1,860</Text>
            </View>
            <View style={styles.rewardCard}>
              <Text style={styles.rewardLabel}>Streak</Text>
              <Text style={[styles.rewardValue, { color: "#fde047" }]}>8</Text>
            </View>
          </View>
        </LinearGradient>
        {/* Performance Comparison */}
        <LinearGradient
          colors={['rgba(163, 230, 53, 0.1)', 'rgba(56, 189, 248, 0.1)']}
          style={styles.card}
        >
          <Text style={styles.sectionTitle}>Performance vs Opponent</Text>
          <View style={styles.comparisonRow}>
            <View style={styles.comparisonCol}>
              <Feather name="clock" size={16} color="#94a3b8" style={{ marginRight: 4 }} />
              <View>
                <Text style={styles.comparisonLabel}>Avg. Response</Text>
                <Text style={styles.comparisonValue}>3.2s <Text style={styles.comparisonDelta}>(20% faster)</Text></Text>
              </View>
            </View>
            <View style={styles.comparisonCol}>
              <Feather name="target" size={16} color="#94a3b8" style={{ marginRight: 4 }} />
              <View>
                <Text style={styles.comparisonLabel}>Accuracy</Text>
                <Text style={styles.comparisonValue}>80% <Text style={styles.comparisonDelta}>(+15%)</Text></Text>
              </View>
            </View>
          </View>
        </LinearGradient>
        {/* Skill Radar */}
        <LinearGradient
          colors={['rgba(163, 230, 53, 0.1)', 'rgba(56, 189, 248, 0.1)']}
          style={styles.card}
        >
          <Text style={styles.sectionTitle}>Skill Breakdown</Text>
          <View style={styles.radarChartStub}><Text style={styles.radarChartStubText}>[Radar Chart Placeholder]</Text></View>
        </LinearGradient>
        {/* Action Buttons */}
        <View style={styles.actionCol}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push("/quiz-pages/learning-hub")}>
            <Feather name="target" size={18} color="#000" style={{ marginRight: 8 }} />
            <Text style={styles.primaryBtnText}>Fix Weak Areas</Text>
          </TouchableOpacity>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push('/quiz-pages/duel-lobby')}>
              <Feather name="rotate-ccw" size={18} color="#A3E635" style={{ marginRight: 8 }} />
              <Text style={styles.secondaryBtnText}>Rematch</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push('/quiz-pages/duel-lobby?mode=friend')}>
              <Feather name="users" size={18} color="#A3E635" style={{ marginRight: 8 }} />
              <Text style={styles.secondaryBtnText}>Challenge Friend</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Fun Fact */}
        <LinearGradient
          colors={['rgba(56, 189, 248, 0.1)', 'rgba(56, 189, 248, 0.2)']}
          style={styles.cardFact}
        >
          <Text style={styles.sectionTitle}>💡 Trading Fact</Text>
          <Text style={styles.funFactText}>
            A "Short Straddle" involves selling both a call and put option at the same strike price, profiting when the stock price stays near the strike price at expiration.
          </Text>
          <TouchableOpacity style={styles.learnMoreRow} onPress={() => Alert.alert("Learn More")}>
            <Text style={styles.learnMoreText}>Learn more about straddle strategies</Text>
            <Feather name="arrow-right" size={14} color="#38bdf8" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </LinearGradient>
        {/* Back to Home */}
        <TouchableOpacity style={styles.ghostBtn} onPress={() => router.push('/(tabs)/Quiz')}>
          <Text style={styles.ghostBtnText}>Back to Arena</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#242620", padding: 16 },
  centered: { alignItems: "center", marginBottom: 12 },
  trophyWrap: { alignItems: "center", justifyContent: "center", marginBottom: 8 },
  trophyIcon: { zIndex: 2 },
  trophyGlow: { position: "absolute", width: 64, height: 64, borderRadius: 32, backgroundColor: "#fde047", opacity: 0.2, top: 0, left: 0, zIndex: 1 },
  badgeVictory: { backgroundColor: "rgba(163, 230, 53, 0.1)", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 6, marginBottom: 4, borderWidth: 1, borderColor: "rgba(163, 230, 53, 0.2)" },
  badgeVictoryText: { color: "#A3E635", fontWeight: "bold", fontSize: 16 },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  cardScore: { borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "rgba(163, 230, 53, 0.2)" },
  scoreRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  playerCol: { alignItems: "center", flex: 1 },
  avatarWrap: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: "#A3E635", marginBottom: 4, overflow: "hidden" },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  playerName: { fontWeight: "bold", fontSize: 15, marginBottom: 2, color: "#fff" },
  eloRow: { flexDirection: "row", alignItems: "center" },
  eloChange: { color: "#A3E635", fontWeight: "bold", fontSize: 13 },
  scoreCol: { alignItems: "center", flex: 1 },
  scoreText: { fontWeight: "bold", fontSize: 32, color: "#A3E635" },
  scoreSub: { color: "#94a3b8", fontSize: 12 },
  rewardsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8, gap: 8 },
  rewardCard: { backgroundColor: "rgba(0, 0, 0, 0.2)", borderRadius: 10, padding: 12, alignItems: "center", flex: 1, borderWidth: 1, borderColor: "rgba(163, 230, 53, 0.2)" },
  rewardLabel: { color: "#94a3b8", fontSize: 12 },
  rewardValue: { fontWeight: "bold", fontSize: 18, color: "#A3E635" },
  card: { borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "rgba(163, 230, 53, 0.2)" },
  sectionTitle: { fontWeight: "bold", fontSize: 15, marginBottom: 6, color: "#fff" },
  comparisonRow: { flexDirection: "row", justifyContent: "space-between" },
  comparisonCol: { flexDirection: "row", alignItems: "center", flex: 1 },
  comparisonLabel: { color: "#94a3b8", fontSize: 11 },
  comparisonValue: { fontWeight: "bold", fontSize: 14, color: "#fff" },
  comparisonDelta: { color: "#A3E635", fontSize: 11 },
  radarChartStub: { height: 120, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0, 0, 0, 0.2)", borderRadius: 10, borderWidth: 1, borderColor: "rgba(163, 230, 53, 0.2)" },
  radarChartStubText: { color: "#94a3b8", fontSize: 14 },
  actionCol: { flexDirection: "column", gap: 10, marginTop: 8, marginBottom: 8 },
  actionRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8, gap: 8 },
  primaryBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#9bec00", borderRadius: 8, paddingVertical: 12, paddingHorizontal: 16, justifyContent: "center", marginBottom: 8 },
  primaryBtnText: { color: "#000", fontWeight: "bold", fontSize: 15 },
  secondaryBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.2)", borderRadius: 8, paddingVertical: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: "rgba(163, 230, 53, 0.2)", justifyContent: "center", flex: 1 },
  secondaryBtnText: { color: "#A3E635", fontWeight: "bold", fontSize: 15 },
  cardFact: { borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "rgba(56, 189, 248, 0.2)" },
  funFactText: { color: "#94a3b8", fontSize: 13, marginTop: 4 },
  learnMoreRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  learnMoreText: { color: "#38bdf8", fontWeight: "bold", fontSize: 13 },
  ghostBtn: { backgroundColor: "rgba(0, 0, 0, 0.2)", borderRadius: 8, paddingVertical: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: "rgba(163, 230, 53, 0.2)", alignItems: "center" },
  ghostBtnText: { color: "#94a3b8", fontWeight: "bold", fontSize: 15 },
});

export default PostMatchResults; 
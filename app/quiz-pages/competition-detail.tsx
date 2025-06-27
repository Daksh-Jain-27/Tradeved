import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import QuizNavBar from "../../components/QuizNavBar";
import { Stack } from 'expo-router';

type LeaderboardEntry = {
  rank: number;
  name: string;
  college: string;
  score: number;
};

interface CompetitionDetailProps {
  competitionId: string;
}

const competition = {
  id: "1",
  name: "College Championship",
  description: "Inter-college trading competition for students",
  prize: "₹1,00,000",
  participants: 1247,
  maxParticipants: 2000,
  startDate: "Dec 20, 2024",
  endDate: "Dec 22, 2024",
  status: "upcoming",
  type: "college",
  requiresEmail: true,
  rules: [
    "Must be a current college student",
    "Valid college email required",
    "Roll number verification needed",
    "10 questions per round",
    "3 rounds total",
  ],
  leaderboard: [
    { rank: 1, name: "Sarah Chen", college: "IIT Delhi", score: 2850 },
    { rank: 2, name: "Raj Patel", college: "IIM Ahmedabad", score: 2720 },
    { rank: 3, name: "Priya Singh", college: "SRCC Delhi", score: 2680 },
  ],
};

const CompetitionDetail: React.FC<CompetitionDetailProps> = ({ competitionId }) => {
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [tab, setTab] = useState<"rules" | "leaderboard" | "results">("rules");

  const handleJoinCompetition = async () => {
    setIsJoining(true);

    // Simulate email validation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (
      !email.includes(".edu") &&
      !email.includes("college") &&
      !email.includes("university")
    ) {
      Alert.alert("Invalid Email", "Please use your college email address");
      setIsJoining(false);
      return;
    }

    setHasJoined(true);
    setIsJoining(false);
    setModalVisible(false);
    Alert.alert("Successfully Joined!", "You're now registered for the competition");
  };

  const handleSetReminder = () => {
    // In React Native, you can't open Google Calendar directly in the same way.
    // You can use Linking.openURL, but for now, just show an alert.
    Alert.alert("Reminder Set!", "Google Calendar event created (demo)");
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
          <Text style={styles.headerTitle}>{competition.name}</Text>
          <Text style={styles.headerSubtitle}>{competition.description}</Text>
          <View style={styles.prizeBadge}>
            <FontAwesome5 name="trophy" size={14} color="#eab308" style={{ marginRight: 4 }} />
            <Text style={styles.prizeBadgeText}>{competition.prize} Prize Pool</Text>
          </View>
        </View>

        {/* Competition Info */}
        <View style={styles.card}>
          <View style={styles.infoGrid}>
            <View style={styles.infoBox}>
              <Feather name="users" size={20} color="#22c55e" style={{ alignSelf: "center" }} />
              <Text style={styles.infoLabel}>Participants</Text>
              <Text style={styles.infoValue}>
                {competition.participants}/{competition.maxParticipants}
              </Text>
            </View>
            <View style={styles.infoBox}>
              <Ionicons name="calendar" size={20} color="#38bdf8" style={{ alignSelf: "center" }} />
              <Text style={styles.infoLabel}>Start Date</Text>
              <Text style={styles.infoValue}>{competition.startDate}</Text>
            </View>
          </View>

          {/* Join/Reminder Buttons */}
          <View style={{ marginTop: 12 }}>
            {!hasJoined ? (
              <>
                <TouchableOpacity
                  style={styles.joinButton}
                  onPress={() => setModalVisible(true)}
                >
                  <Feather name="mail" size={18} color="#000" style={{ marginRight: 8 }} />
                  <Text style={styles.joinButtonText}>Join with College Email</Text>
                </TouchableOpacity>
                <Modal
                  visible={modalVisible}
                  animationType="slide"
                  transparent
                  onRequestClose={() => setModalVisible(false)}
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                      <Text style={styles.modalTitle}>Join Competition</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="your.name@college.edu"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your roll number"
                        value={rollNumber}
                        onChangeText={setRollNumber}
                      />
                      <TouchableOpacity
                        style={[
                          styles.joinButton,
                          (!email || !rollNumber || isJoining) && { opacity: 0.5 },
                        ]}
                        onPress={handleJoinCompetition}
                        disabled={isJoining || !email || !rollNumber}
                      >
                        <Text style={styles.joinButtonText}>
                          {isJoining ? "Verifying..." : "Join Competition"}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => setModalVisible(false)}
                      >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              </>
            ) : (
              <View style={styles.successBox}>
                <Feather name="check-circle" size={20} color="#22c55e" style={{ marginRight: 8 }} />
                <Text style={styles.successText}>Successfully Registered!</Text>
              </View>
            )}

            <TouchableOpacity style={styles.reminderButton} onPress={handleSetReminder}>
              <Feather name="bell" size={18} color="#22c55e" style={{ marginRight: 8 }} />
              <Text style={styles.reminderButtonText}>Set Google Reminder</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tabButton, tab === "rules" && styles.tabButtonActive]}
            onPress={() => setTab("rules")}
          >
            <Text style={[styles.tabButtonText, tab === "rules" && styles.tabButtonTextActive]}>
              Rules
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, tab === "leaderboard" && styles.tabButtonActive]}
            onPress={() => setTab("leaderboard")}
          >
            <Text style={[styles.tabButtonText, tab === "leaderboard" && styles.tabButtonTextActive]}>
              Leaderboard
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, tab === "results" && styles.tabButtonActive]}
            onPress={() => setTab("results")}
          >
            <Text style={[styles.tabButtonText, tab === "results" && styles.tabButtonTextActive]}>
              Results
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {tab === "rules" && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Competition Rules</Text>
            {competition.rules.map((rule, idx) => (
              <View key={idx} style={styles.ruleRow}>
                <Feather name="check-circle" size={16} color="#22c55e" style={{ marginRight: 8 }} />
                <Text style={styles.ruleText}>{rule}</Text>
              </View>
            ))}
          </View>
        )}

        {tab === "leaderboard" && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Current Standings</Text>
            {competition.leaderboard.map((entry) => (
              <View key={entry.rank} style={styles.leaderboardRow}>
                <View style={styles.leaderboardLeft}>
                  <View
                    style={[
                      styles.rankBadge,
                      entry.rank === 1
                        ? styles.rankBadgeGold
                        : entry.rank === 2
                        ? styles.rankBadgeSilver
                        : entry.rank === 3
                        ? styles.rankBadgeBronze
                        : styles.rankBadgeDefault,
                    ]}
                  >
                    <Text style={styles.rankBadgeText}>#{entry.rank}</Text>
                  </View>
                  <Image
                    source={require("../../assets/images/profile.png")}
                    style={styles.avatar}
                  />
                  <View>
                    <Text style={styles.leaderboardName}>{entry.name}</Text>
                    <Text style={styles.leaderboardCollege}>{entry.college}</Text>
                  </View>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.leaderboardScore}>{entry.score}</Text>
                  <Text style={styles.leaderboardPoints}>points</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {tab === "results" && (
          <View style={styles.card}>
            <View style={{ alignItems: "center", padding: 24 }}>
              <Feather name="clock" size={48} color="#64748b" style={{ marginBottom: 12 }} />
              <Text style={styles.sectionTitle}>Results Pending</Text>
              <Text style={styles.resultsText}>
                Competition results will be available after the event concludes on {competition.endDate}.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 16 },
  header: { alignItems: "center", marginBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  headerSubtitle: { color: "#64748b", fontSize: 14, marginBottom: 8 },
  prizeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef9c3",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 8,
  },
  prizeBadgeText: { color: "#eab308", fontWeight: "bold", fontSize: 13 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  infoGrid: { flexDirection: "row", justifyContent: "space-between" },
  infoBox: { flex: 1, alignItems: "center" },
  infoLabel: { fontSize: 12, color: "#64748b", marginTop: 2 },
  infoValue: { fontWeight: "bold", fontSize: 15, marginTop: 2 },
  joinButton: {
    flexDirection: "row",
    backgroundColor: "#bbf7d0",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    marginTop: 8,
    marginBottom: 4,
  },
  joinButtonText: { color: "#000", fontWeight: "bold", fontSize: 16 },
  reminderButton: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#22c55e",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    marginTop: 8,
    marginBottom: 4,
  },
  reminderButtonText: { color: "#22c55e", fontWeight: "bold", fontSize: 16 },
  successBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#bbf7d0",
    borderRadius: 12,
    justifyContent: "center",
    paddingVertical: 14,
    marginTop: 8,
    marginBottom: 4,
  },
  successText: { color: "#22c55e", fontWeight: "bold", fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 15,
  },
  cancelButton: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
  },
  cancelButtonText: { color: "#64748b", fontWeight: "bold" },
  tabsRow: { flexDirection: "row", marginBottom: 12, marginTop: 4 },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    marginHorizontal: 2,
    alignItems: "center",
  },
  tabButtonActive: { backgroundColor: "#22c55e" },
  tabButtonText: { color: "#64748b", fontWeight: "500" },
  tabButtonTextActive: { color: "#fff" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  ruleRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  ruleText: { fontSize: 14 },
  leaderboardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  leaderboardLeft: { flexDirection: "row", alignItems: "center" },
  rankBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  rankBadgeGold: { backgroundColor: "#fde68a" },
  rankBadgeSilver: { backgroundColor: "#d1d5db" },
  rankBadgeBronze: { backgroundColor: "#92400e" },
  rankBadgeDefault: { backgroundColor: "#f1f5f9" },
  rankBadgeText: { fontWeight: "bold", color: "#000", fontSize: 13 },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#e5e7eb", marginRight: 8 },
  leaderboardName: { fontWeight: "500", fontSize: 14 },
  leaderboardCollege: { color: "#64748b", fontSize: 11 },
  leaderboardScore: { fontWeight: "bold", color: "#22c55e", fontSize: 16 },
  leaderboardPoints: { color: "#64748b", fontSize: 12 },
  resultsText: { color: "#64748b", fontSize: 13, textAlign: "center", marginTop: 8 },
});

export default CompetitionDetail; 
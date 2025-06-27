import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { Stack, router } from 'expo-router';
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import QuizNavBar from "../../components/QuizNavBar";

const competitions = {
  live: [
    {
      id: 1,
      title: "Weekly Championship",
      subtitle: "Options Trading Masters",
      icon: <FontAwesome5 name="trophy" size={24} color="#eab308" />,
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
      icon: <Feather name="zap" size={24} color="#38bdf8" />,
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
      icon: <FontAwesome5 name="gift" size={24} color="#22c55e" />,
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
      icon: <FontAwesome5 name="trophy" size={24} color="#ef4444" />,
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
      icon: <FontAwesome5 name="trophy" size={24} color="#a3a3a3" />,
      participants: 2341,
      prizePool: "₹30,000",
      winner: "Alex Trader",
      endDate: "Dec 10, 2024",
      status: "Ended",
      type: "beginner",
    },
  ],
};

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

const CompetitionHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"live" | "upcoming" | "ended">("live");

  const handleJoinCompetition = (competition: any) => {
    router.push(`/quiz-pages/competition-detail?id=${competition.id}`);
  };

  const handleViewResults = (competition: any) => {
    Alert.alert("View Results", competition.title);
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
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Competition Hub</Text>
          <Text style={styles.headerSubtitle}>Join tournaments and win prizes</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          <TabButton
            label="Live"
            active={activeTab === "live"}
            onPress={() => setActiveTab("live")}
            count={competitions.live.length}
            pulse
          />
          <TabButton
            label="Upcoming"
            active={activeTab === "upcoming"}
            onPress={() => setActiveTab("upcoming")}
            count={competitions.upcoming.length}
          />
          <TabButton
            label="Ended"
            active={activeTab === "ended"}
            onPress={() => setActiveTab("ended")}
            count={competitions.ended.length}
          />
        </View>

        {/* Tab Content */}
        {activeTab === "live" &&
          competitions.live.map((competition) => (
            <View key={competition.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconTitleRow}>
                  {competition.icon}
                  <View>
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
                  <Feather name="users" size={16} color="#64748b" />
                  <Text style={styles.infoLabel}>Participants</Text>
                  <Text style={styles.infoValue}>{competition.participants.toLocaleString()}</Text>
                </View>
                <View style={styles.infoBox}>
                  <FontAwesome5 name="gift" size={16} color="#eab308" />
                  <Text style={styles.infoLabel}>Prize Pool</Text>
                  <Text style={[styles.infoValue, { color: "#eab308" }]}>{competition.prizePool}</Text>
                </View>
              </View>
              <View style={styles.timeRow}>
                <Feather name="clock" size={16} color="#ef4444" />
                <Text style={styles.timeText}>Ends in {competition.timeLeft}</Text>
              </View>
              <TouchableOpacity
                style={styles.glowingButton}
                onPress={() => handleJoinCompetition(competition)}
              >
                <FontAwesome5 name="trophy" size={16} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.glowingButtonText}>Join Competition</Text>
              </TouchableOpacity>
            </View>
          ))}

        {activeTab === "upcoming" &&
          competitions.upcoming.map((competition) => (
            <View key={competition.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconTitleRow}>
                  {competition.icon}
                  <View>
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
                  <Feather name="users" size={16} color="#64748b" />
                  <Text style={styles.infoLabel}>Registered</Text>
                  <Text style={styles.infoValue}>
                    {competition.participants}/{competition.maxParticipants}
                  </Text>
                </View>
                <View style={styles.infoBox}>
                  <FontAwesome5 name="gift" size={16} color="#eab308" />
                  <Text style={styles.infoLabel}>Prize Pool</Text>
                  <Text style={[styles.infoValue, { color: "#eab308" }]}>{competition.prizePool}</Text>
                </View>
              </View>
              <View style={styles.timeRow}>
                <Feather name="calendar" size={16} color="#64748b" />
                <Text style={styles.timeText}>Starts {competition.startDate}</Text>
              </View>
              <TouchableOpacity
                style={styles.upcomingButton}
                onPress={() => handleJoinCompetition(competition)}
              >
                <FontAwesome5 name="trophy" size={16} color="#000" style={{ marginRight: 8 }} />
                <Text style={styles.upcomingButtonText}>Register Now</Text>
              </TouchableOpacity>
            </View>
          ))}

        {activeTab === "ended" &&
          competitions.ended.map((competition) => (
            <View key={competition.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconTitleRow}>
                  {competition.icon}
                  <View>
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
                  <Feather name="users" size={16} color="#64748b" />
                  <Text style={styles.infoLabel}>Participants</Text>
                  <Text style={styles.infoValue}>{competition.participants.toLocaleString()}</Text>
                </View>
                <View style={styles.infoBox}>
                  <FontAwesome5 name="trophy" size={16} color="#eab308" />
                  <Text style={styles.infoLabel}>Winner</Text>
                  <Text style={styles.infoValue}>{competition.winner}</Text>
                </View>
              </View>
              <View style={styles.timeRow}>
                <Feather name="calendar" size={16} color="#64748b" />
                <Text style={styles.timeText}>Ended {competition.endDate}</Text>
              </View>
              <TouchableOpacity
                style={styles.endedButton}
                onPress={() => handleViewResults(competition)}
              >
                <FontAwesome5 name="trophy" size={16} color="#22c55e" style={{ marginRight: 8 }} />
                <Text style={styles.endedButtonText}>View Results</Text>
              </TouchableOpacity>
            </View>
          ))}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 16 },
  header: { alignItems: "center", marginBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  headerSubtitle: { color: "#64748b", fontSize: 14 },
  tabsRow: { flexDirection: "row", marginBottom: 12, marginTop: 4 },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    marginHorizontal: 2,
    alignItems: "center",
    position: "relative",
  },
  tabButtonActive: { backgroundColor: "#22c55e" },
  tabButtonText: { color: "#64748b", fontWeight: "500" },
  tabButtonTextActive: { color: "#fff" },
  pulseDot: {
    position: "absolute",
    top: 6,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22c55e",
  },
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
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  iconTitleRow: { flexDirection: "row", alignItems: "center" },
  cardTitle: { fontSize: 16, fontWeight: "bold" },
  cardSubtitle: { fontSize: 13, color: "#64748b" },
  statusBadgeLive: {
    backgroundColor: "#bbf7d0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  statusBadgeUpcoming: {
    backgroundColor: "#bae6fd",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  statusBadgeEnded: {
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  statusBadgeText: { fontWeight: "bold", color: "#000", fontSize: 12 },
  infoGrid: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12, marginTop: 8 },
  infoBox: { flex: 1, alignItems: "center" },
  infoLabel: { fontSize: 12, color: "#64748b", marginTop: 2 },
  infoValue: { fontWeight: "bold", fontSize: 15, marginTop: 2 },
  timeRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  timeText: { marginLeft: 6, fontSize: 13, color: "#ef4444", fontWeight: "500" },
  glowingButton: {
    flexDirection: "row",
    backgroundColor: "#22c55e",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    marginTop: 8,
    marginBottom: 4,
    shadowColor: "#22c55e",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  glowingButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  upcomingButton: {
    flexDirection: "row",
    backgroundColor: "#38bdf8",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    marginTop: 8,
    marginBottom: 4,
  },
  upcomingButtonText: { color: "#000", fontWeight: "bold", fontSize: 16 },
  endedButton: {
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
  endedButtonText: { color: "#22c55e", fontWeight: "bold", fontSize: 16 },
});

export default CompetitionHub; 
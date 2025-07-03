import { Feather } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QuizNavBar from "../../components/QuizNavBar";

const participants = [
  { id: 1, name: "You", score: 850, isYou: true, answered: true },
  { id: 2, name: "Sarah", score: 920, answered: true, fastest: true },
  { id: 3, name: "Mike", score: 780, answered: false },
  { id: 4, name: "Alex", score: 690, answered: true },
  { id: 5, name: "Emma", score: 560, answered: false },
  { id: 6, name: "John", score: 430, answered: true },
];

const question = {
  text: "What is the maximum loss in a covered call strategy?",
  options: [
    "Unlimited",
    "Premium received",
    "Strike price minus premium",
    "Stock price minus premium received",
  ],
};

const GroupRoom: React.FC = () => {
  const [roomCode] = useState("TRADE2024");
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (gameStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, timeLeft]);

  const copyRoomCode = () => {
    Alert.alert("Copied!", `Join my TradeVed room: ${roomCode}`);
  };

  if (!gameStarted) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: false
          }}
        />
        <QuizNavBar />
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Group Room</Text>
            <Text style={styles.headerSubtitle}>Invite friends for a multiplayer duel</Text>
          </View>
          {/* Room Code */}
          <LinearGradient
            colors={['rgba(163, 230, 53, 0.1)', 'rgba(56, 189, 248, 0.1)']}
            style={styles.card}
          >
            <Text style={styles.roomCodeLabel}>Room Code</Text>
            <View style={styles.roomCodeRow}>
              <Text style={styles.roomCode}>{roomCode}</Text>
              <TouchableOpacity style={styles.copyButton} onPress={copyRoomCode}>
                <Feather name="copy" size={18} color="#94a3b8" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.shareButton} onPress={() => Alert.alert("Share Invite Link")}>
              <Feather name="share-2" size={18} color="#A3E635" style={{ marginRight: 8 }} />
              <Text style={styles.shareButtonText}>Share Invite Link</Text>
            </TouchableOpacity>
          </LinearGradient>
          {/* Participants Grid */}
          <LinearGradient
            colors={['rgba(163, 230, 53, 0.1)', 'rgba(56, 189, 248, 0.1)']}
            style={styles.card}
          >
            <Text style={styles.participantsTitle}>Participants ({participants.length}/10)</Text>
            <View style={styles.participantsGrid}>
              {participants.map((participant) => (
                <View
                  key={participant.id}
                  style={[styles.participantBox, participant.isYou && styles.participantBoxYou]}
                >
                  <View style={styles.avatarCircle}>
                    <Feather name="user" size={18} color="#94a3b8" />
                  </View>
                  <Text style={styles.participantName}>{participant.name}</Text>
                  {participant.isYou && <Text style={styles.youBadge}>You</Text>}
                </View>
              ))}
              {/* Empty slots */}
              {Array.from({ length: 10 - participants.length }).map((_, i) => (
                <View key={`empty-${i}`} style={styles.participantBoxEmpty}>
                  <View style={styles.avatarCircleEmpty}>
                    <Feather name="users" size={16} color="#94a3b8" />
                  </View>
                  <Text style={styles.participantEmptyText}>Waiting...</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
          {/* Start Game */}
          <TouchableOpacity
            style={[styles.startButton, participants.length < 2 && { opacity: 0.5 }]}
            onPress={() => setGameStarted(true)}
            disabled={participants.length < 2}
          >
            <Feather name="zap" size={22} color="#000" style={{ marginRight: 8 }} />
            <Text style={styles.startButtonText}>Start Group Duel</Text>
          </TouchableOpacity>
          {participants.length < 2 && (
            <Text style={styles.needParticipantsText}>Need at least 2 participants to start</Text>
          )}
        </ScrollView>
      </>
    );
  }

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
        <View style={styles.liveHeaderRow}>
          <View style={styles.liveBadge}>
            <Text style={styles.liveBadgeText}>Question {currentQuestion}/10</Text>
          </View>
          <View style={styles.timerRow}>
            <View style={styles.timerCircle}>
              <Text style={styles.timerText}>{timeLeft}s</Text>
            </View>
          </View>
          <View style={styles.liveBadgeGreen}>
            <Text style={styles.liveBadgeGreenText}>Group Duel</Text>
          </View>
        </View>
        {/* Question */}
        <LinearGradient
          colors={['rgba(163, 230, 53, 0.1)', 'rgba(56, 189, 248, 0.1)']}
          style={styles.card}
        >
          <Text style={styles.questionText}>{question.text}</Text>
          {question.options.map((option, index) => (
            <TouchableOpacity key={index} style={styles.optionButton}>
              <Text style={styles.optionButtonText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </LinearGradient>
        {/* Live Participant Grid */}
        <LinearGradient
          colors={['rgba(163, 230, 53, 0.1)', 'rgba(56, 189, 248, 0.1)']}
          style={styles.card}
        >
          <Text style={styles.liveScoresTitle}>Live Scores</Text>
          <View style={styles.liveScoresList}>
            {participants
              .sort((a, b) => b.score - a.score)
              .map((participant, index) => (
                <View
                  key={participant.id}
                  style={[styles.liveScoreRow, participant.isYou && styles.participantBoxYou]}
                >
                  <View style={styles.liveScoreRank}>
                    <Text style={styles.liveScoreRankText}>#{index + 1}</Text>
                  </View>
                  <View style={styles.avatarCircle}>
                    <Feather name="user" size={18} color="#94a3b8" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.liveScoreName}>
                      {participant.name}
                      {participant.fastest && <Text style={styles.fastestBadge}> Fastest</Text>}
                    </Text>
                    <View style={styles.liveScoreStatusRow}>
                      <View style={[styles.statusDot, { backgroundColor: participant.answered ? "#A3E635" : "#94a3b8" }]} />
                      <Text style={styles.liveScoreStatusText}>
                        {participant.answered ? "Answered" : "Thinking..."}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.liveScoreValue}>{participant.score}</Text>
                </View>
              ))}
          </View>
        </LinearGradient>
        {/* Chat/Emotes */}
        <LinearGradient
          colors={['rgba(163, 230, 53, 0.1)', 'rgba(56, 189, 248, 0.1)']}
          style={styles.card}
        >
          <View style={styles.chatRow}>
            <TouchableOpacity style={styles.chatButton} onPress={() => router.push('/quiz-pages/chat-screen')}>
              <Feather name="message-square" size={16} color="#A3E635" style={{ marginRight: 6 }} />
              <Text style={styles.chatButtonText}>Chat</Text>
            </TouchableOpacity>
            <View style={styles.emotesRow}>
              {['👍', '🔥', '😅', '🎯'].map((emote, i) => (
                <TouchableOpacity key={i} style={styles.emoteButton} onPress={() => Alert.alert("Emote", emote)}>
                  <Text style={styles.emoteText}>{emote}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#242620", padding: 16 },
  header: { alignItems: "center", marginBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 4, color: "#fff" },
  headerSubtitle: { color: "#94a3b8", fontSize: 14, textAlign: "center" },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(163, 230, 53, 0.2)"
  },
  roomCodeLabel: { color: "#94a3b8", fontSize: 13, marginBottom: 4 },
  roomCodeRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  roomCode: {
    fontWeight: "bold",
    fontSize: 22,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    color: "#fff",
    borderWidth: 1,
    borderColor: "rgba(163, 230, 53, 0.2)"
  },
  copyButton: { marginLeft: 8, backgroundColor: "rgba(0, 0, 0, 0.2)", borderRadius: 8, padding: 8, borderWidth: 1, borderColor: "rgba(163, 230, 53, 0.2)" },
  shareButton: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.2)", borderRadius: 10, borderWidth: 1, borderColor: "rgba(163, 230, 53, 0.2)", paddingVertical: 12, paddingHorizontal: 16, marginTop: 8 },
  shareButtonText: { color: "#A3E635", fontWeight: "bold", fontSize: 15 },
  participantsTitle: { fontWeight: "bold", fontSize: 15, marginBottom: 8, color: "#fff" },
  participantsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  participantBox: { width: "48%", backgroundColor: "rgba(0, 0, 0, 0.2)", borderRadius: 10, alignItems: "center", padding: 10, borderWidth: 1, borderColor: "rgba(163, 230, 53, 0.2)" },
  participantBoxYou: { borderColor: "#A3E635", borderWidth: 2, backgroundColor: "rgba(163, 230, 53, 0.1)" },
  avatarCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(0, 0, 0, 0.2)", alignItems: "center", justifyContent: "center", marginBottom: 4, borderWidth: 1, borderColor: "rgba(163, 230, 53, 0.2)" },
  participantName: { fontWeight: "bold", fontSize: 14, color: "#fff" },
  youBadge: { color: "#A3E635", fontWeight: "bold", fontSize: 12, marginTop: 2 },
  participantBoxEmpty: { width: "48%", backgroundColor: "rgba(0, 0, 0, 0.2)", borderRadius: 10, alignItems: "center", padding: 10, borderWidth: 2, borderColor: "rgba(163, 230, 53, 0.2)", borderStyle: "dashed" },
  avatarCircleEmpty: { width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(0, 0, 0, 0.2)", alignItems: "center", justifyContent: "center", marginBottom: 4, borderWidth: 1, borderColor: "rgba(163, 230, 53, 0.2)" },
  participantEmptyText: { color: "#94a3b8", fontSize: 13 },
  startButton: { flexDirection: "row", backgroundColor: "#A3E635", borderRadius: 12, alignItems: "center", justifyContent: "center", paddingVertical: 18, marginTop: 8, marginBottom: 4 },
  startButtonText: { color: "#000", fontWeight: "bold", fontSize: 18 },
  needParticipantsText: { color: "#94a3b8", fontSize: 13, textAlign: "center", marginTop: 8 },
  liveHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  liveBadge: { backgroundColor: "rgba(0, 0, 0, 0.2)", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: "rgba(163, 230, 53, 0.2)" },
  liveBadgeText: { color: "#94a3b8", fontWeight: "bold", fontSize: 13 },
  timerRow: { alignItems: "center" },
  timerCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(0, 0, 0, 0.2)", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(163, 230, 53, 0.2)" },
  timerText: { color: "#A3E635", fontWeight: "bold", fontSize: 16 },
  liveBadgeGreen: { backgroundColor: "rgba(163, 230, 53, 0.1)", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: "rgba(163, 230, 53, 0.2)" },
  liveBadgeGreenText: { color: "#A3E635", fontWeight: "bold", fontSize: 13 },
  questionText: { fontWeight: "bold", fontSize: 16, marginBottom: 12, color: "#fff" },
  optionButton: { backgroundColor: "rgba(0, 0, 0, 0.2)", borderRadius: 8, paddingVertical: 14, paddingHorizontal: 12, marginBottom: 8, borderWidth: 1, borderColor: "rgba(163, 230, 53, 0.2)" },
  optionButtonText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  liveScoresTitle: { fontWeight: "bold", fontSize: 15, marginBottom: 8, color: "#fff" },
  liveScoresList: { gap: 8 },
  liveScoreRow: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.2)", borderRadius: 8, padding: 10, borderWidth: 1, borderColor: "rgba(163, 230, 53, 0.2)" },
  liveScoreRank: { width: 28, height: 28, borderRadius: 14, backgroundColor: "rgba(0, 0, 0, 0.2)", alignItems: "center", justifyContent: "center", marginRight: 8, borderWidth: 1, borderColor: "rgba(163, 230, 53, 0.2)" },
  liveScoreRankText: { color: "#A3E635", fontWeight: "bold", fontSize: 13 },
  liveScoreName: { fontWeight: "bold", fontSize: 14, color: "#fff" },
  fastestBadge: { color: "#fde047", fontWeight: "bold", fontSize: 12 },
  liveScoreStatusRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 4 },
  liveScoreStatusText: { color: "#94a3b8", fontSize: 12 },
  liveScoreValue: { fontWeight: "bold", fontSize: 16, color: "#A3E635" },
  chatRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  chatButton: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.2)", borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16, borderWidth: 1, borderColor: "rgba(163, 230, 53, 0.2)" },
  chatButtonText: { color: "#A3E635", fontWeight: "bold", fontSize: 15 },
  emotesRow: { flexDirection: "row", gap: 6 },
  emoteButton: { backgroundColor: "rgba(0, 0, 0, 0.2)", borderRadius: 8, paddingVertical: 10, paddingHorizontal: 14, borderWidth: 1, borderColor: "rgba(163, 230, 53, 0.2)" },
  emoteText: { fontSize: 18 },
});

export default GroupRoom; 
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import QuizNavBar from "../../components/QuizNavBar";
import { Stack, useRouter } from 'expo-router';

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
          <View style={styles.cardGreen}>
            <Text style={styles.roomCodeLabel}>Room Code</Text>
            <View style={styles.roomCodeRow}>
              <Text style={styles.roomCode}>{roomCode}</Text>
              <TouchableOpacity style={styles.copyButton} onPress={copyRoomCode}>
                <Feather name="copy" size={18} color="#64748b" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.shareButton} onPress={() => Alert.alert("Share Invite Link")}>
              <Feather name="share-2" size={18} color="#22c55e" style={{ marginRight: 8 }} />
              <Text style={styles.shareButtonText}>Share Invite Link</Text>
            </TouchableOpacity>
          </View>
          {/* Participants Grid */}
          <View style={styles.cardWhite}>
            <Text style={styles.participantsTitle}>Participants ({participants.length}/10)</Text>
            <View style={styles.participantsGrid}>
              {participants.map((participant) => (
                <View
                  key={participant.id}
                  style={[styles.participantBox, participant.isYou && styles.participantBoxYou]}
                >
                  <View style={styles.avatarCircle}>
                    <Feather name="user" size={18} color="#64748b" />
                  </View>
                  <Text style={styles.participantName}>{participant.name}</Text>
                  {participant.isYou && <Text style={styles.youBadge}>You</Text>}
                </View>
              ))}
              {/* Empty slots */}
              {Array.from({ length: 10 - participants.length }).map((_, i) => (
                <View key={`empty-${i}`} style={styles.participantBoxEmpty}>
                  <View style={styles.avatarCircleEmpty}>
                    <Feather name="users" size={16} color="#e5e7eb" />
                  </View>
                  <Text style={styles.participantEmptyText}>Waiting...</Text>
                </View>
              ))}
            </View>
          </View>
          {/* Start Game */}
          <TouchableOpacity
            style={[styles.startButton, participants.length < 2 && { opacity: 0.5 }]}
            onPress={() => setGameStarted(true)}
            disabled={participants.length < 2}
          >
            <Feather name="zap" size={22} color="#fff" style={{ marginRight: 8 }} />
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
          <View style={styles.liveBadge}><Text style={styles.liveBadgeText}>Question {currentQuestion}/10</Text></View>
          <View style={styles.timerRow}>
            <View style={styles.timerCircle}><Text style={styles.timerText}>{timeLeft}s</Text></View>
          </View>
          <View style={styles.liveBadgeGreen}><Text style={styles.liveBadgeGreenText}>Group Duel</Text></View>
        </View>
        {/* Question */}
        <View style={styles.cardWhite}>
          <Text style={styles.questionText}>{question.text}</Text>
          {question.options.map((option, index) => (
            <TouchableOpacity key={index} style={styles.optionButton}>
              <Text style={styles.optionButtonText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Live Participant Grid */}
        <View style={styles.cardWhite}>
          <Text style={styles.liveScoresTitle}>Live Scores</Text>
          <View style={styles.liveScoresList}>
            {participants
              .sort((a, b) => b.score - a.score)
              .map((participant, index) => (
                <View
                  key={participant.id}
                  style={[styles.liveScoreRow, participant.isYou && styles.participantBoxYou]}
                >
                  <View style={styles.liveScoreRank}><Text style={styles.liveScoreRankText}>#{index + 1}</Text></View>
                  <View style={styles.avatarCircle}><Feather name="user" size={18} color="#64748b" /></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.liveScoreName}>{participant.name}{participant.fastest && <Text style={styles.fastestBadge}> Fastest</Text>}</Text>
                    <View style={styles.liveScoreStatusRow}>
                      <View style={[styles.statusDot, { backgroundColor: participant.answered ? "#22c55e" : "#e5e7eb" }]} />
                      <Text style={styles.liveScoreStatusText}>{participant.answered ? "Answered" : "Thinking..."}</Text>
                    </View>
                  </View>
                  <Text style={styles.liveScoreValue}>{participant.score}</Text>
                </View>
              ))}
          </View>
        </View>
        {/* Chat/Emotes */}
        <View style={styles.cardWhite}>
          <View style={styles.chatRow}>
            <TouchableOpacity style={styles.chatButton} onPress={() => router.push('/quiz-pages/chat-screen')}>
              <Feather name="message-square" size={16} color="#22c55e" style={{ marginRight: 6 }} />
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
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 16 },
  header: { alignItems: "center", marginBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  headerSubtitle: { color: "#64748b", fontSize: 14, textAlign: "center" },
  cardGreen: { backgroundColor: "#bbf7d0", borderRadius: 16, padding: 16, marginBottom: 16, alignItems: "center" },
  roomCodeLabel: { color: "#64748b", fontSize: 13, marginBottom: 4 },
  roomCodeRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  roomCode: { fontWeight: "bold", fontSize: 22, backgroundColor: "#f1f5f9", paddingHorizontal: 16, paddingVertical: 6, borderRadius: 8 },
  copyButton: { marginLeft: 8, backgroundColor: "#f1f5f9", borderRadius: 8, padding: 8 },
  shareButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 10, borderWidth: 1, borderColor: "#22c55e", paddingVertical: 12, paddingHorizontal: 16, marginTop: 8 },
  shareButtonText: { color: "#22c55e", fontWeight: "bold", fontSize: 15 },
  cardWhite: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#e5e7eb" },
  participantsTitle: { fontWeight: "bold", fontSize: 15, marginBottom: 8 },
  participantsGrid: { flexDirection: "row", flexWrap: "wrap" },
  participantBox: { width: "48%", backgroundColor: "#f1f5f9", borderRadius: 10, alignItems: "center", padding: 10, margin: "1%" },
  participantBoxYou: { borderColor: "#22c55e", borderWidth: 2, backgroundColor: "#bbf7d0" },
  avatarCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#e5e7eb", alignItems: "center", justifyContent: "center", marginBottom: 4 },
  participantName: { fontWeight: "bold", fontSize: 14 },
  youBadge: { color: "#22c55e", fontWeight: "bold", fontSize: 12, marginTop: 2 },
  participantBoxEmpty: { width: "48%", backgroundColor: "#f1f5f9", borderRadius: 10, alignItems: "center", padding: 10, margin: "1%", borderWidth: 2, borderColor: "#e5e7eb", borderStyle: "dashed" },
  avatarCircleEmpty: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#e5e7eb", alignItems: "center", justifyContent: "center", marginBottom: 4 },
  participantEmptyText: { color: "#64748b", fontSize: 13 },
  startButton: { flexDirection: "row", backgroundColor: "#22c55e", borderRadius: 12, alignItems: "center", justifyContent: "center", paddingVertical: 18, marginTop: 8, marginBottom: 4 },
  startButtonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  needParticipantsText: { color: "#64748b", fontSize: 13, textAlign: "center", marginTop: 8 },
  liveHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  liveBadge: { backgroundColor: "#f1f5f9", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  liveBadgeText: { color: "#64748b", fontWeight: "bold", fontSize: 13 },
  timerRow: { alignItems: "center" },
  timerCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#e0f2fe", alignItems: "center", justifyContent: "center" },
  timerText: { color: "#22c55e", fontWeight: "bold", fontSize: 16 },
  liveBadgeGreen: { backgroundColor: "#bbf7d0", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  liveBadgeGreenText: { color: "#22c55e", fontWeight: "bold", fontSize: 13 },
  questionText: { fontWeight: "bold", fontSize: 16, marginBottom: 12 },
  optionButton: { backgroundColor: "#f1f5f9", borderRadius: 8, paddingVertical: 14, paddingHorizontal: 12, marginBottom: 8 },
  optionButtonText: { color: "#222", fontWeight: "bold", fontSize: 15 },
  liveScoresTitle: { fontWeight: "bold", fontSize: 15, marginBottom: 8 },
  liveScoresList: {},
  liveScoreRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#f1f5f9", borderRadius: 8, padding: 10, marginBottom: 6 },
  liveScoreRank: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#e0f2fe", alignItems: "center", justifyContent: "center", marginRight: 8 },
  liveScoreRankText: { color: "#22c55e", fontWeight: "bold", fontSize: 13 },
  liveScoreName: { fontWeight: "bold", fontSize: 14 },
  fastestBadge: { color: "#eab308", fontWeight: "bold", fontSize: 12 },
  liveScoreStatusRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 4 },
  liveScoreStatusText: { color: "#64748b", fontSize: 12 },
  liveScoreValue: { fontWeight: "bold", fontSize: 16, color: "#22c55e" },
  chatRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  chatButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#e0f2fe", borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16 },
  chatButtonText: { color: "#22c55e", fontWeight: "bold", fontSize: 15 },
  emotesRow: { flexDirection: "row" },
  emoteButton: { backgroundColor: "#f1f5f9", borderRadius: 8, paddingVertical: 10, paddingHorizontal: 14, marginLeft: 6 },
  emoteText: { fontSize: 18 },
});

export default GroupRoom; 
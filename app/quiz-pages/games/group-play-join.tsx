import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import QuizNavBar from "../../../components/QuizNavBar";
import { Stack, useRouter } from 'expo-router';

const colors = {
  background: "#242620",
  foreground: "#f8fafc",
  card: "rgba(30, 41, 59, 0.5)",
  "muted-foreground": "#94a3b8",
  border: "#334155",
  primary: "#f8fafc",
  "primary-foreground": "#0b1120",
  secondary: "#1e293b",
};

const playersData = [
  { id: 1, name: "You (Host)", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704a", status: "ready" },
];

export default function GroupPlayJoinScreen() {
  const [activeTab, setActiveTab] = useState("create");
  const [roomCode] = useState("TRADE24");
  const [players, setPlayers] = useState(playersData);
  const router = useRouter();

  const showToast = (title: string, description: string) => {
    Alert.alert(title, description);
  };

  const handleCopyCode = () => {
    // In a real app, you'd use a clipboard library like @react-native-clipboard/clipboard
    showToast("Room code copied!", "Share this code with your friends.");
  };

  const handleAddBot = () => {
    if (players.length < 5) {
      const botNames = ["TradeBot", "InvestorAI", "MarketBot", "StockAI", "FinanceBot"];
      const newBot = {
        id: players.length + 1,
        name: botNames[players.length - 1],
        avatar: `https://i.pravatar.cc/150?u=bot${players.length}`,
        status: "bot",
      };
      setPlayers([...players, newBot]);
      showToast("Bot added", `${newBot.name} has joined the room.`);
    }
  };

  const handleJoinRoom = () => {
    showToast("Joining room...", "Connecting to the game room.");
    // navigation.navigate('GroupPlayRoom');
  };

  const handleStartGame = () => {
    if (players.length < 2) {
      showToast("Not enough players", "You need at least 2 players to start.");
      return;
    }
    // navigation.navigate('GroupPlayRoom');
    showToast("Starting Game!", "Let's go!");
  };

  const CreateRoomTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Group Play Room</Text>
          <Text style={styles.cardDescription}>Create a room and invite friends</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.label}>Room Code</Text>
          <View style={styles.inputRow}>
            <TextInput value={roomCode} readOnly style={styles.input} />
            <TouchableOpacity style={styles.iconButton} onPress={handleCopyCode}>
              <Feather name="copy" size={18} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          <View style={styles.playerHeader}>
            <Text style={styles.sectionTitle}>Players ({players.length}/5)</Text>
            <TouchableOpacity style={styles.addBotButton} onPress={handleAddBot}>
              <Feather name="plus" size={16} color={colors.foreground} style={{ marginRight: 4 }} />
              <Text style={styles.addBotButtonText}>Add Bot</Text>
            </TouchableOpacity>
          </View>

          {players.map((player) => (
            <View key={player.id} style={styles.playerRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={{ uri: player.avatar }} style={styles.avatar} />
                <Text style={styles.playerName}>{player.name}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: player.status === 'bot' ? colors.secondary : colors.primary }]}>
                <Text style={[styles.badgeText, { color: player.status === 'bot' ? colors.foreground : colors["primary-foreground"] }]}>{player.status === 'bot' ? 'Bot' : 'Ready'}</Text>
              </View>
            </View>
          ))}

          <Text style={styles.sectionTitle}>Game Settings</Text>
          <View style={styles.settingRow}><Text style={styles.infoText}>Topic</Text><Text style={styles.infoText}>Mixed</Text></View>
          <View style={styles.settingRow}><Text style={styles.infoText}>Questions</Text><Text style={styles.infoText}>10</Text></View>
          <View style={styles.settingRow}><Text style={styles.infoText}>Time per question</Text><Text style={styles.infoText}>20s</Text></View>

        </View>
        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleStartGame}><Text style={styles.primaryButtonText}>Start Game</Text></TouchableOpacity>
          <View style={styles.secondaryActions}>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleCopyCode}><Feather name="copy" size={16} color={colors.foreground} /><Text style={styles.secondaryButtonText}>Copy Code</Text></TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}><Feather name="share-2" size={16} color={colors.foreground} /><Text style={styles.secondaryButtonText}>Share Link</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const JoinRoomTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Join a Room</Text>
          <Text style={styles.cardDescription}>Enter a room code to join a friend's game</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.label}>Room Code</Text>
          <TextInput placeholder="Enter room code" style={styles.input} placeholderTextColor={colors["muted-foreground"]} />
          <Text style={styles.helpText}>Ask your friend for the 6-digit room code.</Text>
        </View>
        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleJoinRoom}><Text style={styles.primaryButtonText}>Join Room</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );

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
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={styles.logo}>TradeVed</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "create" && styles.activeTab]}
            onPress={() => setActiveTab("create")}
          >
            <Feather name="plus" size={16} color={activeTab === 'create' ? colors['primary-foreground'] : colors.foreground} style={{ marginRight: 8 }} />
            <Text style={[styles.tabText, activeTab === "create" && styles.activeTabText]}>Create Room</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "join" && styles.activeTab]}
            onPress={() => setActiveTab("join")}
          >
            <Feather name="users" size={16} color={activeTab === 'join' ? colors['primary-foreground'] : colors.foreground} style={{ marginRight: 8 }} />
            <Text style={[styles.tabText, activeTab === "join" && styles.activeTabText]}>Join Room</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'create' ? <CreateRoomTab /> : <JoinRoomTab />}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  logo: { fontSize: 22, fontWeight: 'bold', color: colors.foreground },
  tabsContainer: { flexDirection: 'row', backgroundColor: colors.secondary, borderRadius: 8, padding: 4, marginBottom: 16 },
  tab: { flex: 1, flexDirection: 'row', paddingVertical: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 6 },
  activeTab: { backgroundColor: colors.primary },
  tabText: { color: colors.foreground, fontWeight: '500' },
  activeTabText: { color: colors["primary-foreground"] },
  tabContent: { marginTop: 4 },
  card: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12 },
  cardHeader: { padding: 16, borderBottomWidth: 1, borderColor: colors.border },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: colors.foreground, marginBottom: 4 },
  cardDescription: { color: colors["muted-foreground"] },
  cardContent: { padding: 16 },
  cardFooter: { padding: 16, borderTopWidth: 1, borderColor: colors.border },
  label: { color: colors.foreground, fontSize: 14, fontWeight: '500', marginBottom: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, backgroundColor: colors.secondary, color: colors.foreground, padding: 12, borderRadius: 8, fontSize: 16, textAlign: 'center' },
  iconButton: { padding: 12, marginLeft: 8, borderWidth: 1, borderColor: colors.border, borderRadius: 8 },
  playerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.foreground },
  addBotButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10 },
  addBotButtonText: { color: colors.foreground, marginLeft: 4 },
  playerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 8, borderWidth: 1, borderColor: colors.border, borderRadius: 8, marginBottom: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  playerName: { color: colors.foreground, fontWeight: '500' },
  badge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontWeight: 'bold', fontSize: 12 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderWidth: 1, borderColor: colors.border, borderRadius: 8, marginBottom: 8 },
  infoText: { color: colors.foreground },
  primaryButton: { backgroundColor: colors.primary, padding: 16, borderRadius: 8, alignItems: 'center' },
  primaryButtonText: { color: colors["primary-foreground"], fontSize: 16, fontWeight: 'bold' },
  secondaryActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  secondaryButton: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, marginHorizontal: 4 },
  secondaryButtonText: { color: colors.foreground, marginLeft: 8 },
  helpText: { color: colors["muted-foreground"], fontSize: 12, textAlign: 'center', marginTop: 16 },
}); 
import { Feather } from "@expo/vector-icons";
import { Stack, useRouter } from 'expo-router';
import React, { useState } from "react";
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import QuizNavBar from "../../components/QuizNavBar";


const friends = [
  { id: "1", name: "Alex Trader", online: true },
  { id: "2", name: "Sarah Investor", online: true },
  { id: "3", name: "Mike Options", online: false },
  { id: "4", name: "Lisa Charts", online: false },
];

const DuelLobby: React.FC = () => {
  const [duelMode, setDuelMode] = useState("random");
  const [isMatching, setIsMatching] = useState(false);
  const [duration, setDuration] = useState("2min");
  const [topic, setTopic] = useState("auto");
  const [difficulty, setDifficulty] = useState("medium");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [topicDropdownOpen, setTopicDropdownOpen] = useState(false);
  const [difficultyDropdownOpen, setDifficultyDropdownOpen] = useState(false);
  const router = useRouter();

  const topicOptions = [
    { label: '🎲 Auto Mix', value: 'auto' },
    { label: '📊 Options', value: 'options' },
    { label: '⚠️ Risk Mgmt', value: 'risk' },
    { label: '📈 Technical', value: 'technical' },
    { label: '📋 Fundamental', value: 'fundamental' },
  ];
  const difficultyOptions = [
    { label: '🟢 Easy', value: 'easy' },
    { label: '🟡 Medium', value: 'medium' },
    { label: '🔴 Hard', value: 'hard' },
    { label: '💎 Challenger', value: 'challenger' },
  ];

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartDuel = () => {
    setIsMatching(true);
    setTimeout(() => {
      useRouter().push('/quiz-pages/live-duel');
      setIsMatching(false);
    }, 2000);
  };

  const handleCreateRoom = () => {
    router.push('/quiz-pages/group-room' as any);
  };

  return (
    <>
      <QuizNavBar />
      <Stack.Screen
        options={{
          headerShown: false
        }}
      />
      <FlatList
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        data={[{}]}
        keyExtractor={() => 'duel-lobby-content'}
        renderItem={() => (
          <>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Duel Setup</Text>
            <Text style={styles.headerSubtitle}>Configure your battle</Text>
          </View>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardGreen}>
          {/* Duration Selection */}
          <Text style={styles.sectionTitle}>Time Limit</Text>
          <View style={styles.tabsRow}>
            {[
              { label: "1", value: "1min" },
              { label: "2", value: "2min" },
              { label: "5", value: "5min" },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.value}
                style={[styles.tabButton, duration === tab.value && styles.tabButtonActive]}
                onPress={() => setDuration(tab.value)}
              >
                <Text style={[styles.tabButtonText, duration === tab.value && styles.tabButtonTextActive]}>{tab.label}</Text>
                <Text style={styles.tabButtonSub}>min</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Topic & Difficulty */}
          <View style={styles.selectRow}>
            <View style={styles.selectBox}>
              <Text style={styles.selectLabel}>Topic</Text>
                  <DropDownPicker
                    open={topicDropdownOpen}
                    value={topic}
                    items={topicOptions}
                    setOpen={setTopicDropdownOpen}
                    setValue={setTopic}
                    containerStyle={{ marginBottom: 8, zIndex: 1000 }}
                    style={{ backgroundColor: '#242620', borderRadius: 8, borderColor: '#e5e7eb' }}
                    dropDownContainerStyle={{ borderColor: '#e5e7eb', zIndex: 2000 }}
                    textStyle={{ color: '#222', fontWeight: 'bold', fontSize: 15 }}
                  />
            </View>
            <View style={styles.selectBox}>
              <Text style={styles.selectLabel}>Difficulty</Text>
                  <DropDownPicker
                    open={difficultyDropdownOpen}
                    value={difficulty}
                    items={difficultyOptions}
                    setOpen={setDifficultyDropdownOpen}
                    setValue={setDifficulty}
                    containerStyle={{ marginBottom: 8, zIndex: 999 }}
                    style={{ backgroundColor: '#f1f5f9', borderRadius: 8, borderColor: '#e5e7eb' }}
                    dropDownContainerStyle={{ borderColor: '#e5e7eb', zIndex: 1999 }}
                    textStyle={{ color: '#222', fontWeight: 'bold', fontSize: 15 }}
                  />
            </View>
          </View>

          {/* Opponent Type */}
          <Text style={styles.sectionTitle}>Choose Opponent</Text>
          <View style={styles.tabsRow}>
            {[
              { label: "Random", value: "random", icon: "users" },
              { label: "Friend", value: "friend", icon: "share-2" },
              { label: "Bot", value: "bot", icon: "cpu" },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.value}
                style={[styles.tabButton, duelMode === tab.value && styles.tabButtonActive]}
                onPress={() => setDuelMode(tab.value)}
              >
                <Feather name={tab.icon as any} size={20} color={duelMode === tab.value ? "#22c55e" : "#64748b"} />
                <Text style={[styles.tabButtonText, duelMode === tab.value && styles.tabButtonTextActive]}>{tab.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Friend Selection */}
          {duelMode === "friend" && (
            <View style={styles.friendSection}>
              <TextInput
                style={styles.friendSearch}
                placeholder="Search friends..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <View style={styles.friendList}>
                {filteredFriends.length > 0 ? (
                  filteredFriends.map((friend) => (
                    <TouchableOpacity
                      key={friend.id}
                      style={[
                        styles.friendRow,
                        selectedFriend === friend.id && styles.friendRowActive,
                      ]}
                      onPress={() => setSelectedFriend(friend.id)}
                    >
                      <View style={styles.friendAvatar}>
                        <Feather name="user" size={22} color="#64748b" />
                        <View
                          style={[
                            styles.friendStatusDot,
                            { backgroundColor: friend.online ? "#22c55e" : "#e5e7eb" },
                          ]}
                        />
                      </View>
                      <View>
                        <Text style={styles.friendName}>{friend.name}</Text>
                        <Text style={styles.friendStatus}>{friend.online ? "Online" : "Offline"}</Text>
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.noFriendsBox}>
                    <Text style={styles.noFriendsText}>No friends found</Text>
                    <TouchableOpacity onPress={() => Alert.alert("Add Friends")}>
                      <Feather name="user-plus" size={16} color="#22c55e" style={{ marginRight: 4 }} />
                      <Text style={styles.addFriendText}>Add Friends</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={styles.groupRoomButton}
                onPress={handleCreateRoom}
              >
                <Feather name="users" size={18} color="#22c55e" style={{ marginRight: 8 }} />
                <Text style={styles.groupRoomButtonText}>Create Group Room (Up to 10 Players)</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Power-ups Preview */}
          <View style={styles.powerupsBox}>
            <Text style={styles.powerupsTitle}>Available Power-ups</Text>
            <View style={styles.powerupsRow}>
              <View style={[styles.powerupBadge, { borderColor: "#eab308", backgroundColor: "#fef9c3" }]}>
                <Feather name="zap" size={14} color="#eab308" style={{ marginRight: 4 }} />
                <Text style={[styles.powerupText, { color: "#eab308" }]}>Hint (2)</Text>
              </View>
              <View style={[styles.powerupBadge, { borderColor: "#38bdf8", backgroundColor: "#e0f2fe" }]}>
                <Feather name="arrow-right" size={14} color="#38bdf8" style={{ marginRight: 4 }} />
                <Text style={[styles.powerupText, { color: "#38bdf8" }]}>Skip (1)</Text>
              </View>
              <View style={[styles.powerupBadge, { borderColor: "#ef4444", backgroundColor: "#fee2e2" }]}>
                <Feather name="zap" size={14} color="#ef4444" style={{ marginRight: 4 }} />
                <Text style={[styles.powerupText, { color: "#ef4444" }]}>2x XP (1)</Text>
              </View>
            </View>
          </View>

          {/* Start Button or Matching */}
          {isMatching ? (
            <View style={styles.matchingBox}>
              <Feather name="loader" size={32} color="#22c55e" style={{ marginBottom: 8 }} />
              <Text style={styles.matchingText}>Matching...</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.startButton, duelMode === "friend" && !selectedFriend && { opacity: 0.5 }]}
              onPress={handleStartDuel}
              disabled={duelMode === "friend" && !selectedFriend}
            >
              <Feather name="zap" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.startButtonText}>Start Battle</Text>
            </TouchableOpacity>
          )}
        </View>
          </>
        )}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: "bold" },
  headerSubtitle: { color: "#64748b", fontSize: 14 },
  cancelText: { color: "#64748b", fontSize: 15 },
  cardGreen: {
    backgroundColor: "#bbf7d0",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 8 },
  tabsRow: { flexDirection: "row", marginBottom: 12, marginTop: 4 },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    marginHorizontal: 2,
  },
  tabButtonActive: { backgroundColor: "#22c55e" },
  tabButtonText: { color: "#64748b", fontWeight: "500" },
  tabButtonTextActive: { color: "#fff" },
  tabButtonSub: { color: "#64748b", fontSize: 12 },
  selectRow: { flexDirection: "row", marginBottom: 12 },
  selectBox: { flex: 1, marginHorizontal: 4 },
  selectLabel: { color: "#64748b", fontSize: 13, marginBottom: 4 },
  friendSection: { marginBottom: 12 },
  friendSearch: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    fontSize: 15,
  },
  friendList: { maxHeight: 180, marginBottom: 8 },
  friendRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
  },
  friendRowActive: { backgroundColor: "#bbf7d0", borderWidth: 1, borderColor: "#22c55e" },
  friendAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#e5e7eb", alignItems: "center", justifyContent: "center", marginRight: 10, position: "relative" },
  friendStatusDot: { position: "absolute", bottom: 4, right: 4, width: 8, height: 8, borderRadius: 4 },
  friendName: { fontWeight: "bold", fontSize: 14 },
  friendStatus: { color: "#64748b", fontSize: 12 },
  noFriendsBox: { alignItems: "center", padding: 12 },
  noFriendsText: { color: "#64748b", fontSize: 14, marginBottom: 4 },
  addFriendText: { color: "#22c55e", fontWeight: "bold", fontSize: 14 },
  groupRoomButton: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#22c55e",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginTop: 8,
  },
  groupRoomButtonText: { color: "#22c55e", fontWeight: "bold", fontSize: 15 },
  powerupsBox: { backgroundColor: "#f1f5f9", borderRadius: 10, padding: 12, marginBottom: 12 },
  powerupsTitle: { fontWeight: "bold", fontSize: 14, marginBottom: 6 },
  powerupsRow: { flexDirection: "row", justifyContent: "space-between" },
  powerupBadge: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10, marginRight: 6 },
  powerupText: { fontWeight: "bold", fontSize: 13 },
  matchingBox: { alignItems: "center", justifyContent: "center", padding: 24 },
  matchingText: { color: "#22c55e", fontWeight: "bold", fontSize: 16, marginTop: 8 },
  startButton: {
    flexDirection: "row",
    backgroundColor: "#22c55e",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  startButtonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
});

export default DuelLobby; 
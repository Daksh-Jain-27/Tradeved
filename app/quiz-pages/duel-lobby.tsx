import { Feather } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
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

            <LinearGradient
              colors={['rgba(163, 230, 53, 0.1)', 'rgba(56, 189, 248, 0.1)']}
              style={styles.card}
            >
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
                    style={styles.dropdownStyle}
                    dropDownContainerStyle={styles.dropdownContainerStyle}
                    textStyle={styles.dropdownTextStyle}
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
                    style={styles.dropdownStyle}
                    dropDownContainerStyle={styles.dropdownContainerStyle}
                    textStyle={styles.dropdownTextStyle}
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
                    <Feather name={tab.icon as any} size={20} color={duelMode === tab.value ? "#A3E635" : "#94a3b8"} />
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
                    placeholderTextColor="#94a3b8"
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
                            <Feather name="user" size={22} color="#94a3b8" />
                            <View
                              style={[
                                styles.friendStatusDot,
                                { backgroundColor: friend.online ? "#A3E635" : "#94a3b8" },
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
                          <Feather name="user-plus" size={16} color="#A3E635" style={{ marginRight: 4 }} />
                          <Text style={styles.addFriendText}>Add Friends</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.groupRoomButton}
                    onPress={handleCreateRoom}
                  >
                    <Feather name="users" size={18} color="#A3E635" style={{ marginRight: 8 }} />
                    <Text style={styles.groupRoomButtonText}>Create Group Room (Up to 10 Players)</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Power-ups Preview */}
              <View style={styles.powerupsBox}>
                <Text style={styles.powerupsTitle}>Available Power-ups</Text>
                <View style={styles.powerupsRow}>
                  <View style={[styles.powerupBadge, { borderColor: "rgba(234, 179, 8, 0.2)" }]}>
                    <Feather name="zap" size={14} color="#fde047" style={{ marginRight: 4 }} />
                    <Text style={[styles.powerupText, { color: "#fde047" }]}>Hint (2)</Text>
                  </View>
                  <View style={[styles.powerupBadge, { borderColor: "rgba(56, 189, 248, 0.2)" }]}>
                    <Feather name="arrow-right" size={14} color="#38bdf8" style={{ marginRight: 4 }} />
                    <Text style={[styles.powerupText, { color: "#38bdf8" }]}>Skip (1)</Text>
                  </View>
                  <View style={[styles.powerupBadge, { borderColor: "rgba(239, 68, 68, 0.2)" }]}>
                    <Feather name="zap" size={14} color="#ef4444" style={{ marginRight: 4 }} />
                    <Text style={[styles.powerupText, { color: "#ef4444" }]}>2x XP (1)</Text>
                  </View>
                </View>
              </View>

              {/* Start Button or Matching */}
              {isMatching ? (
                <View style={styles.matchingBox}>
                  <Feather name="loader" size={32} color="#A3E635" style={{ marginBottom: 8 }} />
                  <Text style={styles.matchingText}>Matching...</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.startButton, duelMode === "friend" && !selectedFriend && { opacity: 0.5 }]}
                  onPress={handleStartDuel}
                  disabled={duelMode === "friend" && !selectedFriend}
                >
                  <Feather name="zap" size={20} color="#000" style={{ marginRight: 8 }} />
                  <Text style={styles.startButtonText}>Start Battle</Text>
                </TouchableOpacity>
              )}
            </LinearGradient>
          </>
        )}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#242620", 
    padding: 16 
  },
  headerRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 16 
  },
  headerTitle: { 
    fontSize: 22, 
    fontWeight: "bold",
    color: "#fff"
  },
  headerSubtitle: { 
    color: "#94a3b8", 
    fontSize: 14 
  },
  cancelText: { 
    color: "#94a3b8", 
    fontSize: 15 
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(163, 230, 53, 0.2)"
  },
  sectionTitle: { 
    fontWeight: "bold", 
    fontSize: 16, 
    marginBottom: 8,
    color: "#fff"
  },
  tabsRow: { 
    flexDirection: "row", 
    marginBottom: 12, 
    marginTop: 4,
    gap: 8
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(163, 230, 53, 0.2)"
  },
  tabButtonActive: { 
    backgroundColor: "rgba(163, 230, 53, 0.1)" 
  },
  tabButtonText: { 
    color: "#94a3b8", 
    fontWeight: "500" 
  },
  tabButtonTextActive: { 
    color: "#A3E635" 
  },
  tabButtonSub: { 
    color: "#94a3b8", 
    fontSize: 12 
  },
  selectRow: { 
    flexDirection: "row", 
    marginBottom: 12,
    gap: 8
  },
  selectBox: { 
    flex: 1
  },
  selectLabel: { 
    color: "#94a3b8", 
    fontSize: 13, 
    marginBottom: 4 
  },
  dropdownStyle: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 8,
    borderColor: "rgba(163, 230, 53, 0.2)"
  },
  dropdownContainerStyle: {
    backgroundColor: "#242620",
    borderColor: "rgba(163, 230, 53, 0.2)",
    borderRadius: 8
  },
  dropdownTextStyle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15
  },
  friendSection: { 
    marginBottom: 12 
  },
  friendSearch: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(163, 230, 53, 0.2)",
    fontSize: 15,
    color: "#fff"
  },
  friendList: { 
    maxHeight: 180, 
    marginBottom: 8 
  },
  friendRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "rgba(163, 230, 53, 0.2)"
  },
  friendRowActive: { 
    backgroundColor: "rgba(163, 230, 53, 0.1)", 
    borderColor: "#A3E635" 
  },
  friendAvatar: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    backgroundColor: "rgba(0, 0, 0, 0.2)", 
    alignItems: "center", 
    justifyContent: "center", 
    marginRight: 10, 
    position: "relative" 
  },
  friendStatusDot: { 
    position: "absolute", 
    bottom: 4, 
    right: 4, 
    width: 8, 
    height: 8, 
    borderRadius: 4 
  },
  friendName: { 
    fontWeight: "bold", 
    fontSize: 14,
    color: "#fff"
  },
  friendStatus: { 
    color: "#94a3b8", 
    fontSize: 12 
  },
  noFriendsBox: { 
    alignItems: "center", 
    padding: 12 
  },
  noFriendsText: { 
    color: "#94a3b8", 
    fontSize: 14, 
    marginBottom: 4 
  },
  addFriendText: { 
    color: "#A3E635", 
    fontWeight: "bold", 
    fontSize: 14 
  },
  groupRoomButton: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(163, 230, 53, 0.2)",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginTop: 8,
  },
  groupRoomButtonText: { 
    color: "#A3E635", 
    fontWeight: "bold", 
    fontSize: 15 
  },
  powerupsBox: { 
    backgroundColor: "rgba(0, 0, 0, 0.2)", 
    borderRadius: 10, 
    padding: 12, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(163, 230, 53, 0.2)"
  },
  powerupsTitle: { 
    fontWeight: "bold", 
    fontSize: 14, 
    marginBottom: 6,
    color: "#fff"
  },
  powerupsRow: { 
    flexDirection: "row", 
    justifyContent: "space-between" 
  },
  powerupBadge: { 
    flexDirection: "row", 
    alignItems: "center", 
    borderWidth: 1, 
    borderRadius: 8, 
    paddingVertical: 6, 
    paddingHorizontal: 10, 
    marginRight: 6,
    backgroundColor: "rgba(0, 0, 0, 0.2)"
  },
  powerupText: { 
    fontWeight: "bold", 
    fontSize: 13 
  },
  matchingBox: { 
    alignItems: "center", 
    justifyContent: "center", 
    padding: 24 
  },
  matchingText: { 
    color: "#A3E635", 
    fontWeight: "bold", 
    fontSize: 16, 
    marginTop: 8 
  },
  startButton: {
    flexDirection: "row",
    backgroundColor: "#9bec00",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  startButtonText: { 
    color: "#000", 
    fontWeight: "bold", 
    fontSize: 18 
  },
});

export default DuelLobby; 
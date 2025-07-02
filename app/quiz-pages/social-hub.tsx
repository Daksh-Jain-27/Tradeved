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
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import QuizNavBar from "../../components/QuizNavBar";
import { Stack, useRouter } from 'expo-router';

const friends = [
  {
    id: 1,
    name: "Alex Trader",
    username: "@alex_trader",
    avatar: undefined,
    elo: 1842,
    winRate: 78,
    level: 7,
    streak: 5,
    isOnline: true,
  },
  {
    id: 2,
    name: "Sarah Investor",
    username: "@sarah_inv",
    avatar: undefined,
    elo: 1756,
    winRate: 65,
    level: 6,
    streak: 0,
    isOnline: false,
  },
  {
    id: 3,
    name: "Mike Options",
    username: "@mike_opt",
    avatar: undefined,
    elo: 1920,
    winRate: 82,
    level: 8,
    streak: 12,
    isOnline: true,
  },
];

const friendRequests = [
  {
    id: 4,
    name: "Emma Futures",
    username: "@emma_futures",
    avatar: undefined,
    elo: 1654,
    level: 5,
    mutualFriends: 3,
  },
  {
    id: 5,
    name: "David Crypto",
    username: "@david_crypto",
    avatar: undefined,
    elo: 1789,
    level: 6,
    mutualFriends: 1,
  },
];

const SocialHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("friends");
  const router = useRouter();

  const filteredFriends = friends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <QuizNavBar />
      <Stack.Screen
        options={{
          headerShown: false
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.headerWrap}>
          <Text style={styles.headerTitle}>Social</Text>
          <Text style={styles.headerSubtitle}>Connect with fellow traders</Text>
        </View>
        {/* Tabs */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === "friends" && styles.tabBtnActive]}
            onPress={() => setActiveTab("friends")}
          >
            <Feather name="users" size={16} color={activeTab === "friends" ? "#fff" : "#2563eb"} style={{ marginRight: 6 }} />
            <Text style={[styles.tabBtnText, activeTab === "friends" && { color: "#fff" }]}>Friends</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === "requests" && styles.tabBtnActive]}
            onPress={() => setActiveTab("requests")}
          >
            <Feather name="user-plus" size={16} color={activeTab === "requests" ? "#fff" : "#2563eb"} style={{ marginRight: 6 }} />
            <Text style={[styles.tabBtnText, activeTab === "requests" && { color: "#fff" }]}>Requests</Text>
            {friendRequests.length > 0 && (
              <View style={styles.tabBadge}><Text style={styles.tabBadgeText}>{friendRequests.length}</Text></View>
            )}
          </TouchableOpacity>
        </View>
        {/* Friends Tab */}
        {activeTab === "friends" && (
          <View style={{ marginTop: 18 }}>
            {/* Search Bar */}
            <View style={styles.searchRow}>
              <Feather name="search" size={16} color="#64748b" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for mathletes"
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#94a3b8"
              />
            </View>
            {/* Friends List */}
            {filteredFriends.map((friend, index) => (
              <View key={friend.id} style={styles.card}>
                <View style={styles.friendRow}>
                  <View style={styles.avatarWrap}>
                    <Image
                      source={require("../../assets/images/profile.png")}
                      style={styles.avatar}
                      resizeMode="cover"
                    />
                    {friend.isOnline && <View style={styles.onlineDot} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.friendName}>{friend.name}</Text>
                    <Text style={styles.friendUsername}>{friend.username}</Text>
                  </View>
                  {friend.streak > 0 && (
                    <View style={styles.streakBadge}><Text style={styles.streakBadgeText}>🔥 {friend.streak} day streak</Text></View>
                  )}
                </View>
                <View style={styles.statsRow}>
                  <View style={styles.statsCol}>
                    <Text style={styles.statsLabel}>ELO</Text>
                    <Text style={styles.statsValue}>{friend.elo}</Text>
                  </View>
                  <View style={styles.statsCol}>
                    <Text style={styles.statsLabel}>Win Rate</Text>
                    <Text style={styles.statsValue}>{friend.winRate}%</Text>
                  </View>
                  <View style={styles.statsCol}>
                    <Text style={styles.statsLabel}>Level</Text>
                    <Text style={styles.statsValue}>{friend.level}</Text>
                  </View>
                </View>
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push("/quiz-pages/UserProfile")}>
                    <Feather name="eye" size={14} color="#2563eb" style={{ marginRight: 4 }} />
                    <Text style={styles.secondaryBtnText}>View</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push("/quiz-pages/chat-screen")}>
                    <Feather name="message-circle" size={14} color="#2563eb" style={{ marginRight: 4 }} />
                    <Text style={styles.secondaryBtnText}>Chat</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/quiz-pages/duel-lobby')}>
                    <FontAwesome5 name="shield-alt" size={14} color="#fff" style={{ marginRight: 4 }} />
                    <Text style={styles.primaryBtnText}>Duel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
        {/* Requests Tab */}
        {activeTab === "requests" && (
          <View style={{ marginTop: 18 }}>
            {friendRequests.length === 0 ? (
              <View style={styles.cardCenter}>
                <Feather name="user-plus" size={40} color="#64748b" style={{ marginBottom: 12 }} />
                <Text style={styles.noRequestsTitle}>No Friend Requests</Text>
                <Text style={styles.noRequestsDesc}>Share your profile to connect with other traders</Text>
              </View>
            ) : (
              friendRequests.map((request, index) => (
                <View key={request.id} style={styles.card}>
                  <View style={styles.friendRow}>
                    <View style={styles.avatarWrapSmall}>
                      <Image
                        source={require("../../assets/images/profile.png")}
                        style={styles.avatarSmall}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.friendName}>{request.name}</Text>
                      <Text style={styles.friendUsername}>{request.username}</Text>
                      <Text style={styles.mutualFriends}>{request.mutualFriends} mutual friends</Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={styles.statsValue}>ELO {request.elo}</Text>
                      <Text style={styles.statsLabel}>Level {request.level}</Text>
                    </View>
                  </View>
                  <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.primaryBtn} onPress={() => Alert.alert("Accept")}>
                      <Feather name="user-check" size={14} color="#fff" style={{ marginRight: 4 }} />
                      <Text style={styles.primaryBtnText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.secondaryBtn} onPress={() => Alert.alert("Decline")}>
                      <Text style={styles.secondaryBtnText}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        )}
        {/* Share Profile Section */}
        <View style={styles.cardShare}>
          <View style={styles.shareRow}>
            <View>
              <Text style={styles.shareTitle}>Share Your Profile</Text>
              <Text style={styles.shareDesc}>Invite friends to join TradeVed</Text>
            </View>
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => Alert.alert("Share Profile")}>
              <Feather name="link-2" size={16} color="#2563eb" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#242620", padding: 16 },
  headerWrap: { alignItems: "center", marginBottom: 12 },
  headerTitle: { fontSize: 22, fontWeight: "bold" },
  headerSubtitle: { color: "#64748b", fontSize: 14 },
  tabsRow: { flexDirection: "row", marginBottom: 8 },
  tabBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 8, paddingVertical: 10, backgroundColor: "#e5e7eb", marginRight: 8 },
  tabBtnActive: { backgroundColor: "#2563eb" },
  tabBtnText: { color: "#2563eb", fontWeight: "bold", fontSize: 15 },
  tabBadge: { backgroundColor: "#ef4444", borderRadius: 8, paddingHorizontal: 6, marginLeft: 6 },
  tabBadgeText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  searchRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 8, borderWidth: 1, borderColor: "#e5e7eb", marginBottom: 12, paddingHorizontal: 10 },
  searchIcon: { marginRight: 6 },
  searchInput: { flex: 1, height: 40, fontSize: 15, color: "#222" },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#e5e7eb" },
  cardCenter: { backgroundColor: "#fff", borderRadius: 16, padding: 24, alignItems: "center", marginBottom: 16, borderWidth: 1, borderColor: "#e5e7eb" },
  friendRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  avatarWrap: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: "#2563eb", alignItems: "center", justifyContent: "center", marginRight: 10, backgroundColor: "#fff" },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  onlineDot: { position: "absolute", bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6, backgroundColor: "#22c55e", borderWidth: 2, borderColor: "#fff" },
  friendName: { fontWeight: "bold", fontSize: 15 },
  friendUsername: { color: "#64748b", fontSize: 13 },
  streakBadge: { backgroundColor: "#fde047", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 8 },
  streakBadgeText: { color: "#b45309", fontWeight: "bold", fontSize: 12 },
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  statsCol: { alignItems: "center", flex: 1 },
  statsLabel: { color: "#64748b", fontSize: 12 },
  statsValue: { fontWeight: "bold", fontSize: 15 },
  actionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8, gap: 8 },
  primaryBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#22c55e", borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12, justifyContent: "center", marginBottom: 4 },
  primaryBtnText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  secondaryBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: "#2563eb", justifyContent: "center", marginBottom: 4 },
  secondaryBtnText: { color: "#2563eb", fontWeight: "bold", fontSize: 15 },
  avatarWrapSmall: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: "#2563eb", alignItems: "center", justifyContent: "center", marginRight: 10, backgroundColor: "#fff" },
  avatarSmall: { width: 32, height: 32, borderRadius: 16 },
  mutualFriends: { color: "#64748b", fontSize: 12 },
  noRequestsTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  noRequestsDesc: { color: "#64748b", fontSize: 13 },
  cardShare: { backgroundColor: "#f0fdf4", borderRadius: 16, padding: 16, marginTop: 16, borderWidth: 1, borderColor: "#bbf7d0" },
  shareRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  shareTitle: { fontWeight: "bold", fontSize: 15 },
  shareDesc: { color: "#64748b", fontSize: 13 },
});

export default SocialHub; 
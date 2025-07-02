import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
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
  "mango-green": "#9BEC00",
  "mango-green-foreground": "#000000",
  "royal-red": "#CC0066",
  "royal-red-foreground": "#FFFFFF",
  "brilliant-azure": "#2FBEFF",
  "brilliant-azure-foreground": "#000000",
};

const activeRooms = [
  { id: 1, name: "Options Masters Arena", host: "TradingKing", players: 6, maxPlayers: 8, difficulty: "Expert", topic: "Options Trading", isPrivate: false, waitTime: "2m", prize: "500 XP" },
  { id: 2, name: "Beginner's Battle", host: "MarketMentor", players: 4, maxPlayers: 6, difficulty: "Beginner", topic: "Stock Basics", isPrivate: false, waitTime: "Starting Soon", prize: "200 XP" },
  { id: 3, name: "Elite Traders Only", host: "ProTrader99", players: 3, maxPlayers: 4, difficulty: "Expert", topic: "Derivatives", isPrivate: true, waitTime: "5m", prize: "750 XP" },
];

const roomSizes = [
  { players: 4, label: "Small (4)", description: "Quick battles" },
  { players: 6, label: "Medium (6)", description: "Balanced gameplay", isRecommended: true },
  { players: 8, label: "Large (8)", description: "Epic showdowns" },
];

const Progress = ({ value }: { value: number }) => (
  <View style={styles.progressContainer}><View style={[styles.progressBar, { width: `${value}%` }]} /></View>
);

export default function GroupPlayLobbyScreen() {
  const [selectedRoomSize, setSelectedRoomSize] = useState(6);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const router = useRouter();

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
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}><Feather name="arrow-left" size={24} color={colors.foreground} /></TouchableOpacity>
          <View><Text style={styles.headerTitle}>Group Arena</Text><Text style={styles.headerSubtitle}>Battle in teams of 4-8</Text></View>
          <TouchableOpacity style={styles.iconButton} onPress={() => alert("Settings")}><Feather name="settings" size={20} color={colors.foreground} /></TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.glowingButton} onPress={() => router.push('/quiz-pages/games/group-play-join')}><Feather name="play" size={20} color={colors.foreground} style={{ marginRight: 8 }} /><Text style={styles.glowingButtonText}>Quick Join</Text></TouchableOpacity>
          <TouchableOpacity style={styles.outlineButton} onPress={() => setShowCreateRoom(!showCreateRoom)}><Feather name="plus" size={20} color={colors["brilliant-azure"]} style={{ marginRight: 8 }} /><Text style={[styles.outlineButtonText, { color: colors["brilliant-azure"] }]}>Create Room</Text></TouchableOpacity>
        </View>

        {/* Create Room Section */}
        {showCreateRoom && (
          <View style={styles.createRoomCard}>
            <Text style={styles.sectionTitle}>Create New Room</Text>
            <Text style={styles.label}>Room Size</Text>
            <View style={styles.roomSizeSelector}>
              {roomSizes.map((size) => (
                <TouchableOpacity key={size.players} style={[styles.sizeButton, selectedRoomSize === size.players && styles.activeSizeButton]} onPress={() => setSelectedRoomSize(size.players)}>
                  <Text style={[styles.sizeButtonLabel, selectedRoomSize === size.players && { color: colors.background }]}>{size.label}</Text>
                  <Text style={[styles.sizeButtonDescription, selectedRoomSize === size.players && { color: colors.background }]}>{size.description}</Text>
                  {size.isRecommended && <View style={styles.recommendedBadge}><Text style={styles.recommendedBadgeText}>Recommended</Text></View>}
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.createButton}><Feather name="user-plus" size={16} color={colors.background} style={{ marginRight: 8 }} /><Text style={styles.createButtonText}>Create & Invite Friends</Text></TouchableOpacity>
          </View>
        )}

        {/* Active Rooms */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Rooms</Text>
            <View style={styles.liveBadge}><Feather name="globe" size={12} color={colors["brilliant-azure"]} /><Text style={styles.liveBadgeText}>{activeRooms.length} Live</Text></View>
          </View>
          {activeRooms.map((room) => (
            <View key={room.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Text style={styles.cardTitle}>{room.name}</Text>
                    {room.isPrivate && <Feather name="lock" size={14} color={colors["muted-foreground"]} style={{ marginLeft: 8 }} />}
                  </View>
                  <Text style={styles.cardSubtitle}>Host: {room.host} • {room.topic}</Text>
                </View>
                <View style={[styles.difficultyBadge, { backgroundColor: room.difficulty === 'Expert' ? colors["royal-red"] : room.difficulty === 'Beginner' ? colors["mango-green"] : colors["brilliant-azure"] }]}>
                  <Text style={{ color: room.difficulty === 'Expert' ? colors["royal-red-foreground"] : room.difficulty === 'Beginner' ? colors["mango-green-foreground"] : colors["brilliant-azure-foreground"], fontWeight: 'bold', fontSize: 12 }}>{room.difficulty}</Text>
                </View>
              </View>
              <View style={{ marginVertical: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}><Text style={styles.infoText}>Players</Text><Text style={styles.infoTextBold}>{room.players}/{room.maxPlayers}</Text></View>
                <Progress value={(room.players / room.maxPlayers) * 100} />
              </View>
              <View style={styles.cardFooter}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.infoItem}><Feather name="clock" size={14} color={colors["muted-foreground"]} /><Text style={styles.infoText}>{room.waitTime}</Text></View>
                  <View style={styles.infoItem}><MaterialCommunityIcons name="trophy" size={14} color={colors["muted-foreground"]} /><Text style={styles.infoText}>{room.prize}</Text></View>
                </View>
                <TouchableOpacity style={[styles.joinButton, room.players >= room.maxPlayers && styles.disabledButton]} disabled={room.players >= room.maxPlayers}>
                  <Text style={styles.joinButtonText}>{room.players >= room.maxPlayers ? "Full" : "Join"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Your Recent Rooms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Recent Rooms</Text>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>Trading Champions</Text>
                <Text style={styles.cardSubtitle}>6 players • Options Trading</Text>
              </View>
              <View style={styles.winBadge}><MaterialCommunityIcons name="crown" size={12} color={colors["mango-green-foreground"]} style={{ marginRight: 4 }} /><Text style={styles.winBadgeText}>1st Place</Text></View>
            </View>
            <View style={styles.recentRoomFooter}>
              <View style={{ flexDirection: 'row', marginLeft: -8 }}>
                {[1, 2, 3, 4].map(i => <Image key={i} source={{ uri: `https://i.pravatar.cc/150?u=a042581f4e29026704${i}` }} style={styles.miniAvatar} />)}
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: colors["mango-green"], fontWeight: 'bold' }}>+300 XP</Text>
                <Text style={styles.infoText}>2 hours ago</Text>
              </View>
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
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: colors.foreground, textAlign: 'center' },
  headerSubtitle: { fontSize: 14, color: colors["muted-foreground"], textAlign: 'center' },
  iconButton: { padding: 8 },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, gap: 12 },
  glowingButton: { flex: 1, flexDirection: 'row', height: 56, backgroundColor: colors["royal-red"], borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  glowingButtonText: { color: colors["royal-red-foreground"], fontWeight: 'bold', fontSize: 16 },
  outlineButton: { flex: 1, flexDirection: 'row', height: 56, borderWidth: 1, borderColor: colors["brilliant-azure"], borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  outlineButtonText: { fontWeight: 'bold', fontSize: 16 },
  createRoomCard: { backgroundColor: 'rgba(47, 190, 255, 0.05)', borderWidth: 1, borderColor: 'rgba(47, 190, 255, 0.2)', borderRadius: 12, padding: 16, marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '500', color: colors.foreground, marginBottom: 8 },
  roomSizeSelector: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  sizeButton: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 8, alignItems: 'center' },
  activeSizeButton: { backgroundColor: colors.primary },
  sizeButtonLabel: { fontWeight: '600', color: colors.foreground },
  sizeButtonDescription: { fontSize: 12, color: colors["muted-foreground"], opacity: 0.7 },
  recommendedBadge: { backgroundColor: colors["mango-green"], borderRadius: 8, paddingHorizontal: 6, marginTop: 4 },
  recommendedBadgeText: { fontSize: 10, color: colors["mango-green-foreground"], fontWeight: 'bold' },
  createButton: { flexDirection: 'row', backgroundColor: colors["brilliant-azure"], borderRadius: 8, padding: 12, justifyContent: 'center', alignItems: 'center' },
  createButtonText: { color: colors.background, fontWeight: 'bold' },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: colors.foreground },
  liveBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(47, 190, 255, 0.1)', borderColor: 'rgba(47, 190, 255, 0.5)', borderWidth: 1, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 },
  liveBadgeText: { color: colors["brilliant-azure"], fontWeight: 'bold', fontSize: 12, marginLeft: 4 },
  card: { backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: colors.foreground },
  cardSubtitle: { fontSize: 14, color: colors["muted-foreground"], marginTop: 2 },
  difficultyBadge: { borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  infoItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  infoText: { marginLeft: 6, color: colors["muted-foreground"], fontSize: 14 },
  infoTextBold: { color: colors.foreground, fontWeight: '500' },
  joinButton: { backgroundColor: colors.primary, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16 },
  joinButtonText: { color: colors.background, fontWeight: 'bold' },
  disabledButton: { opacity: 0.5 },
  winBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors["mango-green"], borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 },
  winBadgeText: { color: colors["mango-green-foreground"], fontWeight: 'bold', fontSize: 12 },
  recentRoomFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12, marginTop: 12 },
  miniAvatar: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.background, marginLeft: -8 },
  progressContainer: { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: colors.primary },
});

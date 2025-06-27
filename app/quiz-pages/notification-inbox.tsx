import { Feather, FontAwesome5 } from "@expo/vector-icons";

import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QuizNavBar from "../../components/QuizNavBar";

const NOTIF_TYPES = ["all", "achievement", "challenge", "system"];
const TAB_LABELS = {
  all: "All",
  achievement: "Achievements",
  challenge: "Challenges",
  system: "System",
};

const ICONS = {
  Trophy: "award",
  Users: "users",
  Zap: "zap",
  Calendar: "calendar",
  Bell: "bell",
};

const initialNotifications = [
  {
    id: 1,
    type: "achievement",
    title: "Top 5% Performance!",
    message: "You ranked in the top 5% in today's daily challenge",
    time: "2 hours ago",
    read: false,
    icon: "Trophy",
    color: "#eab308",
  },
  {
    id: 2,
    type: "challenge",
    title: "Friend Challenge",
    message: "Sarah Chen challenged you to a duel",
    time: "4 hours ago",
    read: false,
    icon: "Users",
    color: "#38bdf8",
    actionable: true,
  },
  {
    id: 3,
    type: "system",
    title: "Streak Bonus Activated",
    message: "Your 7-day login streak earned you 2x XP for today",
    time: "1 day ago",
    read: true,
    icon: "Zap",
    color: "#22c55e",
  },
  {
    id: 4,
    type: "competition",
    title: "Competition Starting Soon",
    message: "Weekly Championship begins in 30 minutes",
    time: "1 day ago",
    read: true,
    icon: "Calendar",
    color: "#ef4444",
  },
  {
    id: 5,
    type: "system",
    title: "New Learning Content",
    message: "Check out the updated Options Trading quest",
    time: "2 days ago",
    read: true,
    icon: "Bell",
    color: "#64748b",
  },
];

const NotificationInbox: React.FC = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState("all");

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationsByType = (type: string) => {
    if (type === "all") return notifications;
    return notifications.filter((n) => n.type === type);
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
        <View style={styles.headerRow}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.headerTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity style={styles.iconButton} onPress={markAllAsRead}>
              <Feather name="check" size={18} color="#64748b" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => Alert.alert("Settings")}> 
              <Feather name="settings" size={18} color="#64748b" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Tabs */}
        <View style={styles.tabsRow}>
          {NOTIF_TYPES.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabButtonText, activeTab === tab && styles.tabButtonTextActive]}>
                {TAB_LABELS[tab as keyof typeof TAB_LABELS]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Notifications List */}
        <View style={{ marginTop: 16 }}>
          {getNotificationsByType(activeTab).map((notification) => (
            <View
              key={notification.id}
              style={[styles.card, !notification.read ? styles.cardUnread : null]}
            >
              <View style={styles.cardContentRow}>
                <View style={[styles.iconWrap, { backgroundColor: "#f1f5f9" }]}> 
                  <FontAwesome5 name={ICONS[notification.icon as keyof typeof ICONS]} size={18} color={notification.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.cardTitleRow}>
                    <Text style={[styles.cardTitle, !notification.read ? styles.cardTitleUnread : styles.cardTitleRead]}>{notification.title}</Text>
                    {!notification.read && <View style={styles.dotUnread} />}
                  </View>
                  <Text style={styles.cardMsg}>{notification.message}</Text>
                  <View style={styles.cardFooterRow}>
                    <Text style={styles.cardTime}>{notification.time}</Text>
                    <View style={{ flexDirection: "row" }}>
                      {notification.actionable && (
                        <>
                          <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert("Accepted")}> 
                            <Feather name="check" size={14} color="#22c55e" style={{ marginRight: 2 }} />
                            <Text style={styles.actionBtnText}>Accept</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert("Declined")}> 
                            <Feather name="x" size={14} color="#ef4444" style={{ marginRight: 2 }} />
                            <Text style={styles.actionBtnText}>Decline</Text>
                          </TouchableOpacity>
                        </>
                      )}
                      {!notification.read && (
                        <TouchableOpacity style={styles.actionBtn} onPress={() => markAsRead(notification.id)}>
                          <Text style={styles.actionBtnText}>Mark Read</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
        {/* Notification Settings */}
        <View style={styles.cardSettings}>
          <Text style={styles.settingsTitle}>Notification Preferences</Text>
          <View style={styles.settingsRow}>
            <Text style={styles.settingsLabel}>Challenge Invites</Text>
            <TouchableOpacity style={styles.settingsBtn} onPress={() => Alert.alert("Toggled")}> 
              <Text style={styles.settingsBtnText}>On</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.settingsRow}>
            <Text style={styles.settingsLabel}>Achievement Alerts</Text>
            <TouchableOpacity style={styles.settingsBtn} onPress={() => Alert.alert("Toggled")}> 
              <Text style={styles.settingsBtnText}>On</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.settingsRow}>
            <Text style={styles.settingsLabel}>Competition Updates</Text>
            <TouchableOpacity style={styles.settingsBtn} onPress={() => Alert.alert("Toggled")}> 
              <Text style={styles.settingsBtnText}>On</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  headerTitle: { fontSize: 22, fontWeight: "bold", marginRight: 8 },
  unreadBadge: { backgroundColor: "#e5e7eb", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 4 },
  unreadBadgeText: { color: "#22c55e", fontWeight: "bold", fontSize: 13 },
  iconButton: { padding: 8, borderRadius: 8, backgroundColor: "#fff", marginLeft: 4 },
  tabsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8, backgroundColor: "#e5e7eb", borderRadius: 8 },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 8 },
  tabButtonActive: { backgroundColor: "#fff" },
  tabButtonText: { color: "#64748b", fontWeight: "bold" },
  tabButtonTextActive: { color: "#22c55e" },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: "#e5e7eb" },
  cardUnread: { borderColor: "#bbf7d0", backgroundColor: "#f0fdf4" },
  cardContentRow: { flexDirection: "row", alignItems: "flex-start" },
  iconWrap: { padding: 8, borderRadius: 10, marginRight: 10 },
  cardTitleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 2 },
  cardTitle: { fontWeight: "bold", fontSize: 15 },
  cardTitleUnread: { color: "#222" },
  cardTitleRead: { color: "#64748b" },
  dotUnread: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#22c55e" },
  cardMsg: { color: "#64748b", fontSize: 13, marginBottom: 4 },
  cardFooterRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardTime: { color: "#64748b", fontSize: 11 },
  actionBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#f1f5f9", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, marginLeft: 4 },
  actionBtnText: { color: "#22c55e", fontWeight: "bold", fontSize: 13 },
  cardSettings: { backgroundColor: "#f1f5f9", borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#e5e7eb" },
  settingsTitle: { fontWeight: "bold", fontSize: 15, marginBottom: 8 },
  settingsRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  settingsLabel: { color: "#64748b", fontSize: 13 },
  settingsBtn: { backgroundColor: "#fff", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: "#e5e7eb" },
  settingsBtnText: { color: "#22c55e", fontWeight: "bold", fontSize: 13 },
});

export default NotificationInbox; 
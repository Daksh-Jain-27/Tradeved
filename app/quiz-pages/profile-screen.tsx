import { CommunityBulletin } from "@/components/ui/CommunityBulletin";
import { PowerUpProgress } from "@/components/ui/PowerUpProgress";
import { ProfileCustomization } from "@/components/ui/ProfileCustomization";
import { ReferralSystem } from "@/components/ui/ReferralSystem";
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  // fuck u
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { EloRating } from "../../components/ui/EloRating";
import { LevelProgress } from "../../components/ui/LevelProgress";
import QuizNavBar from "../../components/QuizNavBar";
import { Stack } from 'expo-router';
// import { SocialShare } from './SocialShare'; // Assuming SocialShare is in the same folder

// --- Mocks & Placeholders ---

// Mock useAuth hook since the real one is for web
const useAuth = () => ({
  user: {
    name: 'Alex Trader',
    email: 'alex_trader@example.com',
    avatar: 'https://i.pravatar.cc/150?u=alex_trader',
    level: 7,
    xp: 450,
    elo: 1842,
    recentEloChange: 25,
  },
  logout: () => {
    Alert.alert("Logged Out", "You have been successfully logged out.");
    // In a real app, you would navigate to the login screen
  },
});

// Placeholder components for missing UI elements
const PlaceholderComponent = ({ name, height = 100 }: { name: string; height?: number }) => (
  <View style={[styles.placeholder, { height }]}>
    <Text style={styles.placeholderText}>&lt;{name} /&gt;</Text>
  </View>
);

// --- Main Component ---

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const [showCustomization, setShowCustomization] = useState(false);
  const [activeTab, setActiveTab] = useState<"powerups" | "referral" | "community">("powerups");

  if (!user) {
    // This part is for when no user is found, good to keep
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.infoText}>Please log in to view your profile.</Text>
          <TouchableOpacity style={styles.signInButton} onPress={() => navigation.navigate('SignIn' as never)}>
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleLogout = () => {
    logout();
    navigation.navigate("Landing" as never);
  }

  const stats = [
    { label: "Duels Won", value: "127", icon: <Icon name="award" size={16} color="#A3E635" /> },
    { label: "Win Rate", value: "73%", icon: <Icon name="target" size={16} color="#A3E635" /> },
    { label: "Streak", value: "7", icon: <Icon name="calendar" size={16} color="#A3E635" /> },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false
        }}
      />
      <QuizNavBar />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
          {/* Profile Header */}
          <LinearGradient
            colors={['rgba(163, 230, 53, 0.1)', 'rgba(56, 189, 248, 0.1)']}
            style={styles.card}
          >
            <View style={styles.profileHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
                <View>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userHandle}>@{user.email.split("@")[0]}</Text>
                  <View style={styles.levelBadge}><Text style={styles.levelBadgeText}>Level {user.level}</Text></View>
                </View>
              </View>
              <View style={{ flexDirection: 'column', gap: 8 }}>
                <TouchableOpacity style={styles.iconButton} onPress={() => setShowCustomization(!showCustomization)}>
                  <Icon name="edit" size={16} color="#FFF" />
                </TouchableOpacity>
                {/* <SocialShare
                title="Check out my profile!"
                text={`I'm level ${user.level} on TradeVed, come join me!`}
                url={`https://tradeved.com/profile/${user.email.split('@')[0]}`}
              >
                <View style={styles.iconButton}>
                  <Icon name="share-2" size={16} color="#FFF" />
                </View>
              </SocialShare> */}
              </View>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              {stats.map((stat) => (
                <View key={stat.label} style={styles.statBox}>
                  {stat.icon}
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>

            {/* Progress Bars */}
            <View style={{ gap: 12 }}>
              <LevelProgress currentXP={user.xp || 0} />
              <EloRating rating={user.elo || 1000} recentChange={user.recentEloChange || 0} />
            </View>
          </LinearGradient>

          {/* Profile Customization */}
          {showCustomization && <ProfileCustomization />}

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <View style={styles.tabsList}>
              <TouchableOpacity style={[styles.tabTrigger, activeTab === 'powerups' && styles.activeTab]} onPress={() => setActiveTab('powerups')}>
                <Text style={[styles.tabText, activeTab === 'powerups' && styles.activeTabText]}>Power-ups</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tabTrigger, activeTab === 'referral' && styles.activeTab]} onPress={() => setActiveTab('referral')}>
                <Text style={[styles.tabText, activeTab === 'referral' && styles.activeTabText]}>Referral</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tabTrigger, activeTab === 'community' && styles.activeTab]} onPress={() => setActiveTab('community')}>
                <Text style={[styles.tabText, activeTab === 'community' && styles.activeTabText]}>Community</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tabContent}>
              {activeTab === 'powerups' && <PowerUpProgress />}
              {activeTab === 'referral' && <ReferralSystem />}
              {activeTab === 'community' && <CommunityBulletin />}
            </View>
          </View>

          {/* Settings & Logout */}
          {/* <View style={[styles.card, { padding: 16, backgroundColor: '#1F2937' }]}>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Settings' as never)}>
            <Icon name="settings" size={16} color="#D1D5DB" style={{ marginRight: 8 }} />
            <Text style={styles.menuButtonText}>Settings & Preferences</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuButton, { marginTop: 12 }]} onPress={handleLogout}>
            <Icon name="log-out" size={16} color="#F87171" style={{ marginRight: 8 }} />
            <Text style={[styles.menuButtonText, { color: '#F87171' }]}>Logout</Text>
          </TouchableOpacity>
        </View> */}

        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#111827' },
  container: { flex: 1, paddingHorizontal: 16 },
  infoText: { color: '#D1D5DB', fontSize: 16 },
  signInButton: { backgroundColor: '#A3E635', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, marginTop: 16 },
  signInButtonText: { color: '#000', fontWeight: 'bold' },
  card: { borderRadius: 12, padding: 24, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(163, 230, 53, 0.2)' },
  profileHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: '#A3E635', marginRight: 16 },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
  userHandle: { fontSize: 14, color: '#9CA3AF' },
  levelBadge: { backgroundColor: '#A3E635', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, marginTop: 4 },
  levelBadgeText: { color: '#000', fontSize: 12, fontWeight: 'bold' },
  iconButton: { borderWidth: 1, borderColor: '#4B5563', padding: 8, borderRadius: 8 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  statBox: { flex: 1, alignItems: 'center', backgroundColor: 'rgba(17, 24, 39, 0.5)', borderRadius: 8, padding: 12, marginHorizontal: 4 },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  statLabel: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  placeholder: {
    backgroundColor: '#374151',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4B5563',
    borderStyle: 'dashed',
    marginBottom: 16
  },
  placeholderText: { color: '#9CA3AF' },
  tabsContainer: { width: '100%', marginBottom: 24 },
  tabsList: { flexDirection: 'row', backgroundColor: '#374151', borderRadius: 8, padding: 4 },
  tabTrigger: { flex: 1, paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  activeTab: { backgroundColor: '#4B5563' },
  tabText: { color: '#D1D5DB' },
  activeTabText: { color: '#FFF' },
  tabContent: { marginTop: 16 },
  menuButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  menuButtonText: { color: '#D1D5DB', fontSize: 16 },
}); 
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import QuizNavBar from "../../components/QuizNavBar";
import { Stack } from 'expo-router';

// Mock data, as in the original file
const user = {
  id: '123',
  name: "Alex Trader",
  username: "alex_trader",
  avatar: "https://i.pravatar.cc/150?u=alex_trader", // Using a placeholder that works
  level: 7,
  elo: 1842,
  online: true,
  streak: 5,
  joinDate: "March 2024",
  stats: {
    totalDuels: 156,
    wins: 122,
    winRate: 78,
    avgAccuracy: 85,
    bestStreak: 12,
    totalXP: 8500,
  },
  recentMatches: [
    { opponent: "Sarah Investor", result: "win", score: "8-6", date: "2 hours ago" },
    { opponent: "Mike Options", result: "loss", score: "5-7", date: "1 day ago" },
    { opponent: "Lisa Charts", result: "win", score: "9-4", date: "2 days ago" },
  ],
  achievements: [
    { name: "Speed Demon", icon: "⚡️", description: "Answer 10 questions under 5s" },
    { name: "Streak Master", icon: "🔥", description: "7-day login streak" },
    { name: "Options Expert", icon: "📊", description: "90% accuracy in Options" },
  ],
};

// Type definitions
interface BadgeProps {
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

interface TabsProps {
  children: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
}

interface TabsListProps {
  children: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  isActive?: boolean;
  onPress?: () => void;
}

interface TabsContentProps {
  children: React.ReactNode;
  value: string;
}

interface UserProfileProps {
  userId: string;
}

// Simplified Badge component
const Badge: React.FC<BadgeProps> = ({ children, style, textStyle }) => (
  <View style={[styles.badge, style]}>
    <Text style={[styles.badgeText, textStyle]}>{children}</Text>
  </View>
);

// Simplified Tabs component
const Tabs: React.FC<TabsProps> = ({ children, value, onValueChange }) => {
  return (
    <View>
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type && (child.type as any).displayName === 'TabsList') {
          return React.cloneElement(child as React.ReactElement<TabsListProps>, { value, onValueChange });
        }
        if (React.isValidElement(child) && child.type && (child.type as any).displayName === 'TabsContent' && (child.props as TabsContentProps).value === value) {
          return child;
        }
        return null;
      })}
    </View>
  );
};

const TabsList: React.FC<TabsListProps> = ({ children, value, onValueChange }) => (
  <View style={styles.tabsList}>
    {React.Children.map(children, child =>
      React.isValidElement(child) ? React.cloneElement(child as React.ReactElement<TabsTriggerProps>, {
        isActive: (child.props as TabsTriggerProps).value === value,
        onPress: () => onValueChange((child.props as TabsTriggerProps).value),
      }) : child
    )}
  </View>
);
TabsList.displayName = 'TabsList';

const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, isActive, onPress }) => (
  <TouchableOpacity onPress={onPress} style={[styles.tabTrigger, isActive && styles.activeTabTrigger]}>
    <Text style={[styles.tabTriggerText, isActive && styles.activeTabTriggerText]}>{children}</Text>
  </TouchableOpacity>
);

const TabsContent: React.FC<TabsContentProps> = ({ children }) => <View style={styles.tabContent}>{children}</View>;
TabsContent.displayName = 'TabsContent';


export default function UserProfile({ userId }: UserProfileProps) {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState("stats");

  const handleStartChat = () => {
    navigation.navigate('Chat', { userId });
  };

  const handleSendDuelInvite = () => {
    navigation.navigate('DuelLobby', { invite: userId });
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false
        }}
      />
      <QuizNavBar />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
              <Icon name="arrow-left" size={20} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile</Text>
            <View style={styles.spacer} />
          </View>

          {/* Profile Header */}
          <View style={styles.card}>
            <View style={styles.profileHeaderContent}>
              <View style={styles.avatarContainer}>
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
                <View style={[styles.onlineIndicator, { backgroundColor: user.online ? '#22c55e' : '#71717a' }]} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user.name}</Text>
                <Text style={styles.profileUsername}>@{user.username}</Text>
                <View style={styles.badgesContainer}>
                  <Badge style={{ backgroundColor: '#A3E635' }} textStyle={{ color: '#000' }}>
                    Level {user.level}
                  </Badge>
                  {user.streak > 0 && (
                    <Badge style={{ backgroundColor: '#FACC15', marginLeft: 8 }} textStyle={{ color: '#000' }}>
                      <Icon name="zap" size={12} color="#000" /> {user.streak} streak
                    </Badge>
                  )}
                </View>
              </View>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={[styles.button, styles.challengeButton]} onPress={handleSendDuelInvite}>
                <Icon name="users" size={16} color="#000" style={{ marginRight: 8 }} />
                <Text style={styles.challengeButtonText}>Challenge</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.chatButton]} onPress={handleStartChat}>
                <Icon name="message-square" size={16} color="#000" style={{ marginRight: 8 }} />
                <Text style={styles.chatButtonText}>Chat</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats Overview */}
          <View style={styles.statsOverview}>
            <View style={styles.statCard}>
              <Icon name="trophy" size={20} color="#A3E635" style={{ marginBottom: 4 }} />
              <Text style={styles.statValue}>{user.stats.wins}</Text>
              <Text style={styles.statLabel}>Wins</Text>
            </View>
            <View style={styles.statCard}>
              <Icon name="target" size={20} color="#38BDF8" style={{ marginBottom: 4 }} />
              <Text style={styles.statValue}>{user.stats.winRate}%</Text>
              <Text style={styles.statLabel}>Win Rate</Text>
            </View>
            <View style={styles.statCard}>
              <Icon name="bar-chart-2" size={20} color="#FACC15" style={{ marginBottom: 4 }} />
              <Text style={styles.statValue}>{user.elo}</Text>
              <Text style={styles.statLabel}>ELO</Text>
            </View>
          </View>

          {/* Detailed Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList value={activeTab} onValueChange={setActiveTab}>
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="matches">Matches</TabsTrigger>
              <TabsTrigger value="achievements">Badges</TabsTrigger>
            </TabsList>

            <TabsContent value="stats">
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Detailed Statistics</Text>
                <View style={styles.detailedStatsContainer}>
                  <View style={styles.detailedStatBox}>
                    <Text style={styles.detailedStatValue}>{user.stats.totalDuels}</Text>
                    <Text style={styles.detailedStatLabel}>Total Duels</Text>
                  </View>
                  <View style={styles.detailedStatBox}>
                    <Text style={styles.detailedStatValue}>{user.stats.avgAccuracy}%</Text>
                    <Text style={styles.detailedStatLabel}>Avg Accuracy</Text>
                  </View>
                  <View style={styles.detailedStatBox}>
                    <Text style={styles.detailedStatValue}>{user.stats.bestStreak}</Text>
                    <Text style={styles.detailedStatLabel}>Best Streak</Text>
                  </View>
                  <View style={styles.detailedStatBox}>
                    <Text style={styles.detailedStatValue}>{user.stats.totalXP.toLocaleString()}</Text>
                    <Text style={styles.detailedStatLabel}>Total XP</Text>
                  </View>
                </View>
                <Text style={styles.joinDate}>Member since {user.joinDate}</Text>
              </View>
            </TabsContent>

            <TabsContent value="matches">
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Recent Matches</Text>
                {user.recentMatches.map((match, index) => (
                  <View key={index} style={styles.matchItem}>
                    <View>
                      <Text style={styles.matchOpponent}>vs {match.opponent}</Text>
                      <Text style={styles.matchDate}>{match.date}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Badge style={match.result === "win" ? { backgroundColor: '#A3E635' } : { backgroundColor: '#F87171' }} textStyle={{ color: match.result === 'win' ? '#000' : '#FFF' }}>
                        {match.result.toUpperCase()}
                      </Badge>
                      <Text style={styles.matchScore}>{match.score}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </TabsContent>

            <TabsContent value="achievements">
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Achievements</Text>
                {user.achievements.map((achievement, index) => (
                  <View key={index} style={styles.achievementItem}>
                    <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                    <View>
                      <Text style={styles.achievementName}>{achievement.name}</Text>
                      <Text style={styles.achievementDesc}>{achievement.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </TabsContent>
          </Tabs>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#111827' },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 24, },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, },
  iconButton: { padding: 8, },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  spacer: { width: 40 },
  card: { backgroundColor: '#1F2937', borderRadius: 12, padding: 16, marginBottom: 16, },
  profileHeaderContent: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, },
  avatarContainer: { marginRight: 16, },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: '#A3E635', },
  onlineIndicator: { position: 'absolute', bottom: 2, right: 2, width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: '#1F2937', },
  profileInfo: { flex: 1, },
  profileName: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
  profileUsername: { color: '#9CA3AF' },
  badgesContainer: { flexDirection: 'row', marginTop: 8, },
  badge: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  badgeText: { fontSize: 12, fontWeight: '500' },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-between', },
  button: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 8, },
  challengeButton: { backgroundColor: '#A3E635', marginRight: 8, },
  challengeButtonText: { color: '#000', fontWeight: 'bold' },
  chatButton: { borderWidth: 1, borderColor: '#4B5563', marginLeft: 8, },
  chatButtonText: { color: '#FFF', fontWeight: 'bold' },
  statsOverview: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 24, },
  statCard: { flex: 1, backgroundColor: '#1F2937', borderRadius: 12, padding: 12, alignItems: 'center', marginHorizontal: 4, },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  statLabel: { fontSize: 12, color: '#9CA3AF' },
  tabsList: { flexDirection: 'row', backgroundColor: '#374151', borderRadius: 8, padding: 4, marginBottom: 16, },
  tabTrigger: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 6, },
  activeTabTrigger: { backgroundColor: '#4B5563' },
  tabTriggerText: { color: '#D1D5DB', fontWeight: '600' },
  activeTabTriggerText: { color: '#FFF' },
  tabContent: { /* marginTop: 16, no longer needed here */ },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 16 },
  detailedStatsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', },
  detailedStatBox: { backgroundColor: '#374151', borderRadius: 8, width: '48%', padding: 12, alignItems: 'center', marginBottom: 12, },
  detailedStatValue: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  detailedStatLabel: { fontSize: 14, color: '#9CA3AF' },
  joinDate: { textAlign: 'center', color: '#9CA3AF', marginTop: 8 },
  matchItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#374151', borderRadius: 8, padding: 12, marginBottom: 8, },
  matchOpponent: { color: '#FFF', fontWeight: '500' },
  matchDate: { color: '#9CA3AF', fontSize: 12 },
  matchScore: { color: '#9CA3AF', fontSize: 12, marginTop: 4, },
  achievementItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#374151', borderRadius: 8, padding: 12, marginBottom: 8, },
  achievementIcon: { fontSize: 24, marginRight: 12 },
  achievementName: { color: '#FFF', fontWeight: 'bold' },
  achievementDesc: { color: '#9CA3AF', fontSize: 12 },
}); 
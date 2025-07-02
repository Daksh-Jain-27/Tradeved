import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import QuizNavBar from "../../components/QuizNavBar";
import { Stack, useRouter } from 'expo-router';


const weakTopics = [
  {
    id: "fundamental",
    name: "Fundamental Analysis",
    description: "Company financials, P/E ratios, and valuation metrics",
    accuracy: 50,
    improvement: "+15%",
    resources: [
      { title: "P/E Ratio Deep Dive", type: "video", icon: "play" },
      { title: "Financial Statements Guide", type: "article", icon: "file-text" },
    ],
  },
  {
    id: "risk",
    name: "Risk Management",
    description: "Position sizing, stop-losses, and portfolio risk",
    accuracy: 60,
    improvement: "+12%",
    resources: [
      { title: "Position Sizing Calculator", type: "tool", icon: "target" },
      { title: "Risk-Reward Mastery", type: "quiz", icon: "book-open" },
    ],
  },
];

const funFacts = [
  {
    fact: "The 'Iron Condor' strategy gets its name because the profit/loss diagram resembles a bird with outstretched wings.",
    category: "Options",
  },
  {
    fact: "Warren Buffett's Berkshire Hathaway has outperformed the S&P 500 by an average of 10% annually over 50+ years.",
    category: "Investing",
  },
  {
    fact: "The term 'bull market' comes from how bulls attack by thrusting upward with their horns.",
    category: "Market",
  },
  {
    fact: "Black-Scholes options pricing model won the Nobel Prize in Economics in 1997.",
    category: "Options",
  },
];

const smartLinks = [
  {
    title: "Master Stop-Loss Orders",
    description: "Complete guide to protecting your trades",
    category: "Risk Management",
    difficulty: "Beginner",
  },
  {
    title: "Options Greeks Simplified",
    description: "Delta, Gamma, Theta, Vega explained with examples",
    category: "Options",
    difficulty: "Intermediate",
  },
  {
    title: "Technical Analysis Patterns",
    description: "Chart patterns every trader should know",
    category: "Technical",
    difficulty: "Beginner",
  },
];

const LearningHub: React.FC = () => {
  const router = useRouter();
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false
        }}
      />
      <QuizNavBar />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.headerTitle}>Learning Hub</Text>
          <Text style={styles.headerSubtitle}>Strengthen your weak areas</Text>
        </View>
        {/* Weak Topics */}
        <View style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
            <Feather name="alert-triangle" size={18} color="#eab308" style={{ marginRight: 6 }} />
            <Text style={styles.sectionTitle}>Focus Areas</Text>
          </View>
          {weakTopics.map((topic) => (
            <View key={topic.id} style={styles.topicCard}>
              <View style={styles.topicHeaderRow}>
                <Text style={styles.topicTitle}>{topic.name}</Text>
                <View style={{ alignItems: "flex-end" }}>
                  <View style={[styles.badge, styles.badgeYellow]}>
                    <Text style={styles.badgeText}>{topic.accuracy}% Accuracy</Text>
                  </View>
                  <View style={[styles.badge, styles.badgeGreen]}>
                    <Text style={styles.badgeTextSmall}>{topic.improvement} potential</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.topicDesc}>{topic.description}</Text>
              <Text style={styles.resourcesTitle}>Recommended Resources:</Text>
              {topic.resources.map((resource, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.resourceRow}
                  onPress={() => Alert.alert("Open Resource", resource.title)}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Feather name={resource.icon as any} size={16} color="#22c55e" style={{ marginRight: 8 }} />
                    <Text style={styles.resourceText}>{resource.title}</Text>
                  </View>
                  <View style={styles.badgeOutline}>
                    <Text style={styles.badgeTextSmall}>{resource.type}</Text>
                  </View>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.masterButton}
                onPress={() => router.push('/(tabs)/Quest')}
              >
                <Feather name="target" size={16} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.masterButtonText}>Master This Topic</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        {/* Fun Facts */}
        <View style={styles.cardWhite}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardHeaderTitle}>💡 Trading Facts You've Learned</Text>
          </View>
          {funFacts.map((item, idx) => (
            <View key={idx} style={styles.funFactRow}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
                <View style={styles.badgeOutline}>
                  <Text style={styles.badgeTextSmall}>{item.category}</Text>
                </View>
              </View>
              <Text style={styles.funFactText}>{item.fact}</Text>
            </View>
          ))}
        </View>
        {/* Smart Learning Links */}
        <View style={styles.cardWhite}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardHeaderTitle}>Recommended Learning</Text>
          </View>
          {smartLinks.map((link, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.smartLinkRow}
              onPress={() => Alert.alert("Open Link", link.title)}
            >
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
                  <Text style={styles.smartLinkTitle}>{link.title}</Text>
                  <View style={styles.badgeOutline}>
                    <Text style={styles.badgeTextSmall}>{link.difficulty}</Text>
                  </View>
                </View>
                <Text style={styles.smartLinkDesc}>{link.description}</Text>
                <Text style={styles.smartLinkCat}>{link.category}</Text>
              </View>
              <Feather name="arrow-right" size={18} color="#64748b" />
            </TouchableOpacity>
          ))}
        </View>
        {/* Quick Actions */}
        <View style={styles.quickActionsRow}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => router.push('/(tabs)/Quest')}
          >
            <Feather name="book-open" size={18} color="#22c55e" style={{ marginRight: 6 }} />
            <Text style={styles.quickActionText}>Browse Quests</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => router.push('/quiz-pages/duel-lobby')}
          >
            <Feather name="target" size={18} color="#22c55e" style={{ marginRight: 6 }} />
            <Text style={styles.quickActionText}>Practice Duel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#242620", padding: 16 },
  headerTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  headerSubtitle: { color: "#64748b", fontSize: 14, marginBottom: 8 },
  sectionTitle: { fontWeight: "bold", fontSize: 16 },
  topicCard: { backgroundColor: "#fefce8", borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#fde68a" },
  topicHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 },
  topicTitle: { fontWeight: "bold", fontSize: 15 },
  topicDesc: { color: "#64748b", fontSize: 13, marginBottom: 8 },
  resourcesTitle: { fontWeight: "bold", fontSize: 13, marginTop: 8, marginBottom: 4 },
  resourceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#fef9c3", padding: 10, borderRadius: 8, marginBottom: 6 },
  resourceText: { fontSize: 13, fontWeight: "500" },
  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, marginBottom: 2, alignSelf: "flex-end" },
  badgeYellow: { backgroundColor: "#fef08a" },
  badgeGreen: { backgroundColor: "#bbf7d0" },
  badgeText: { color: "#eab308", fontWeight: "bold", fontSize: 12 },
  badgeTextSmall: { color: "#64748b", fontSize: 11 },
  badgeOutline: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 4 },
  masterButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#22c55e", borderRadius: 8, paddingVertical: 12, paddingHorizontal: 16, marginTop: 8, justifyContent: "center" },
  masterButtonText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  cardWhite: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#e5e7eb" },
  cardHeaderRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  cardHeaderTitle: { fontWeight: "bold", fontSize: 15 },
  funFactRow: { backgroundColor: "#f1f5f9", borderRadius: 8, padding: 10, marginBottom: 8 },
  funFactText: { color: "#64748b", fontSize: 13 },
  smartLinkRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#f1f5f9", borderRadius: 8, padding: 12, marginBottom: 8 },
  smartLinkTitle: { fontWeight: "bold", fontSize: 14, marginRight: 6 },
  smartLinkDesc: { color: "#64748b", fontSize: 12 },
  smartLinkCat: { color: "#22c55e", fontSize: 11, marginTop: 2 },
  quickActionsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  quickActionButton: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 10, paddingVertical: 12, paddingHorizontal: 10, borderWidth: 1, borderColor: "#e5e7eb", marginRight: 8 },
  quickActionText: { color: "#22c55e", fontWeight: "bold", fontSize: 15 },
});

export default LearningHub; 
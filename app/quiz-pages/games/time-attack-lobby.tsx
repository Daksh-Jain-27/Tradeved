import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
} from "react-native";
import {
    Feather,
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import QuizNavBar from "../../../components/QuizNavBar";
import { Stack, useRouter } from 'expo-router';

// APPROXIMATED COLORS - These were likely defined in the web project's tailwind.config.ts
const colors = {
    background: "#0d1117", // Dark background
    foreground: "#c9d1d9", // Light text
    "muted-foreground": "#8b949e", // Grayish text
    card: "rgba(34, 41, 54, 0.7)", // Semi-transparent card background
    border: "#30363d",
    primary: "#58a6ff",
    "middle-yellow": "#FFC700",
    "brilliant-azure": "#33A1F2",
    "royal-red": "#D42D2D",
    "mango-green": "#76B947",
    "middle-yellow-foreground": "#1A1A1A",
    "mango-green-foreground": "#FFFFFF",
};

// MOCK DATA - Same as the web version
const gameModes = [
    { id: "sprint", title: "Sprint Mode", subtitle: "3 minutes of intensity", description: "Answer as many questions as possible in 3 minutes", duration: "3 min", questions: "Unlimited", difficulty: "Mixed", xpRange: "25-100 XP", color: "middle-yellow", isPopular: true },
    { id: "marathon", title: "Marathon Mode", subtitle: "5 minutes endurance test", description: "Longer session with increasing difficulty", duration: "5 min", questions: "Unlimited", difficulty: "Progressive", xpRange: "50-150 XP", color: "brilliant-azure" },
    { id: "blitz", title: "Blitz Mode", subtitle: "90 seconds lightning round", description: "Quick-fire questions for maximum speed", duration: "90 sec", questions: "Unlimited", difficulty: "Easy-Medium", xpRange: "15-75 XP", color: "royal-red" },
];

const leaderboard = [
    { rank: 1, name: "SpeedTrader", score: 2847, streak: 15 },
    { rank: 2, name: "QuickMind", score: 2756, streak: 12 },
    { rank: 3, name: "TimeKeeper", score: 2634, streak: 8 },
    { rank: 4, name: "You", score: 2489, streak: 7, isUser: true },
    { rank: 5, name: "FastFingers", score: 2401, streak: 5 },
];


// MOCK AnimatedCounter since the original component is also broken without dependencies.
const AnimatedCounter = ({ value, style }: { value: number, style?: any }) => (
    <Text style={style}>{value}</Text>
);

export default function TimeAttackLobbyScreen() {
    const [selectedMode, setSelectedMode] = useState("sprint");
    const [personalBest] = useState(2489);
    const [todayStreak] = useState(7);
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
                    <View style={styles.headerTitle}>
                        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
                            <Feather name="arrow-left" size={20} color={colors.foreground} />
                        </TouchableOpacity>
                        <View>
                            <Text style={styles.h1}>Time Attack</Text>
                            <Text style={styles.pMuted}>Race against the clock</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.iconButton} onPress={() => Alert.alert("Settings")}>
                        <Feather name="settings" size={16} color={colors.foreground} />
                    </TouchableOpacity>
                </View>

                {/* Personal Stats */}
                <View style={[styles.card, { backgroundColor: 'rgba(255, 199, 0, 0.05)', borderColor: 'rgba(255, 199, 0, 0.2)' }]}>
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <View style={styles.statIconContainer}>
                                <Feather name="award" size={16} color={colors["middle-yellow"]} style={{ marginRight: 4 }} />
                                <AnimatedCounter value={personalBest} style={[styles.statValue, { color: colors['middle-yellow'] }]} />
                            </View>
                            <Text style={styles.statLabel}>Personal Best</Text>
                        </View>
                        <View style={styles.statItem}>
                            <View style={styles.statIconContainer}>
                                <Feather name="zap" size={16} color={colors["brilliant-azure"]} style={{ marginRight: 4 }} />
                                <AnimatedCounter value={todayStreak} style={[styles.statValue, { color: colors['brilliant-azure'] }]} />
                            </View>
                            <Text style={styles.statLabel}>Today's Streak</Text>
                        </View>
                        <View style={styles.statItem}>
                            <View style={styles.statIconContainer}>
                                <Feather name="target" size={16} color={colors["mango-green"]} style={{ marginRight: 4 }} />
                                <Text style={[styles.statValue, { color: colors['mango-green'] }]}>89%</Text>
                            </View>
                            <Text style={styles.statLabel}>Accuracy</Text>
                        </View>
                    </View>
                </View>

                {/* Game Modes */}
                <View style={styles.section}>
                    <Text style={styles.h2}>Choose Mode</Text>
                    {gameModes.map((mode) => (
                        <TouchableOpacity key={mode.id} style={[styles.card, { borderColor: selectedMode === mode.id ? colors.primary : colors.border, borderWidth: selectedMode === mode.id ? 2 : 1 }]} onPress={() => setSelectedMode(mode.id)}>
                            <View style={styles.modeHeader}>
                                <View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                        <Text style={styles.h3}>{mode.title}</Text>
                                        {mode.isPopular && (
                                            <View style={styles.popularBadge}>
                                                <Feather name="star" size={12} color={colors["middle-yellow-foreground"]} style={{ marginRight: 4 }} />
                                                <Text style={styles.popularBadgeText}>Popular</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={styles.pMuted}>{mode.subtitle}</Text>
                                </View>
                                <Text style={{ fontWeight: '600' }}>{mode.xpRange}</Text>
                            </View>
                            <Text style={{ ...styles.pMuted, marginVertical: 12 }}>{mode.description}</Text>
                            <View style={styles.modeDetails}>
                                <View><Text style={styles.pMuted}>Duration</Text><Text style={{ color: colors.foreground }}>{mode.duration}</Text></View>
                                <View><Text style={styles.pMuted}>Questions</Text><Text style={{ color: colors.foreground }}>{mode.questions}</Text></View>
                                <View><Text style={styles.pMuted}>Difficulty</Text><Text style={{ color: colors.foreground }}>{mode.difficulty}</Text></View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Start Game */}
                <TouchableOpacity style={styles.glowingButton} onPress={() => router.push(`/quiz-pages/games/time-attack-game?mode=${selectedMode}`)}>
                    <Feather name="play" size={24} color={colors.background} style={{ marginRight: 12 }} />
                    <Text style={styles.glowingButtonText}>Start Time Attack</Text>
                </TouchableOpacity>

                {/* Leaderboard */}
                <View style={styles.section}>
                    <View style={styles.leaderboardHeader}>
                        <Text style={styles.h2}>Today's Leaderboard</Text>
                        <View style={styles.timerBadge}>
                            <Feather name="clock" size={12} color={colors['middle-yellow']} style={{ marginRight: 4 }} />
                            <Text style={{ color: colors['middle-yellow'], fontSize: 12 }}>Resets in 14h</Text>
                        </View>
                    </View>
                    <View style={styles.card}>
                        {leaderboard.map(player => (
                            <View key={player.rank} style={[styles.playerRow, { backgroundColor: player.isUser ? 'rgba(118, 185, 71, 0.1)' : 'transparent', borderColor: player.isUser ? 'rgba(118, 185, 71, 0.2)' : 'transparent', borderWidth: 1 }]}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                    <View style={[styles.rankCircle, { backgroundColor: player.rank === 1 ? colors['middle-yellow'] : colors.border }]}>
                                        <Text style={{ color: player.rank === 1 ? colors['middle-yellow-foreground'] : colors.foreground, fontWeight: 'bold', fontSize: 12 }}>{player.rank}</Text>
                                    </View>
                                    <View>
                                        <Text style={{ color: player.isUser ? colors['mango-green'] : colors.foreground, fontWeight: '600' }}>{player.name}</Text>
                                        <Text style={styles.pMuted}>Streak: {player.streak}</Text>
                                    </View>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text style={{ color: colors.foreground, fontWeight: 'bold' }}>{player.score.toLocaleString()}</Text>
                                    <Text style={styles.pMuted}>points</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, padding: 16 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    headerTitle: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    iconButton: { padding: 8 },
    h1: { fontSize: 24, fontWeight: 'bold', color: colors.foreground },
    h2: { fontSize: 18, fontWeight: '600', color: colors.foreground, marginBottom: 16 },
    h3: { fontSize: 16, fontWeight: 'bold', color: colors.foreground },
    pMuted: { fontSize: 14, color: colors['muted-foreground'] },
    card: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 16, marginBottom: 12 },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-around' },
    statItem: { alignItems: 'center' },
    statIconContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    statValue: { fontSize: 18, fontWeight: 'bold' },
    statLabel: { fontSize: 12, color: colors['muted-foreground'] },
    section: { marginTop: 24, marginBottom: 12 },
    modeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    popularBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors['middle-yellow'], paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginLeft: 8 },
    popularBadgeText: { fontSize: 12, color: colors['middle-yellow-foreground'], fontWeight: '600' },
    modeDetails: { flexDirection: 'row', justifyContent: 'space-between' },
    glowingButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', height: 64, backgroundColor: colors['middle-yellow'], borderRadius: 12, marginVertical: 16 },
    glowingButtonText: { fontSize: 20, fontWeight: 'bold', color: colors.background },
    leaderboardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    timerBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: colors['middle-yellow'] },
    playerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 8, borderRadius: 8, marginVertical: 4 },
    rankCircle: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
}); 
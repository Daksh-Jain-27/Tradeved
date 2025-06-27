import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { ScrollView, Share, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

// --- MOCK DATA ---
const useUserReferrals = () => ({
  count: 3,
  xp: 300,
});

const rewards = [
    { level: 1, reward: "1 Hint Power-up", unlocked: true },
    { level: 3, reward: "100 XP Bonus", unlocked: true },
    { level: 5, reward: "1 Skip Power-up", unlocked: false },
    { level: 10, reward: "Premium Avatar Frame", unlocked: false },
    { level: 25, reward: "₹500 Cash Reward", unlocked: false },
];

const leaderboard = [
    { name: "Sarah Investor", avatar: "https://i.pravatar.cc/150?u=sarah", referrals: 28 },
    { name: "Mike Options", avatar: "https://i.pravatar.cc/150?u=mike", referrals: 23 },
    { name: "Alex Trader", avatar: "https://i.pravatar.cc/150?u=alex", referrals: 17 },
    { name: "You", avatar: "https://i.pravatar.cc/150?u=you", referrals: 3, isYou: true },
    { name: "Lisa Charts", avatar: "https://i.pravatar.cc/150?u=lisa", referrals: 2 },
];


const ProgressBar = ({ value, max }: { value: number; max: number }) => {
    const percentage = (value / max) * 100;
    return (
        <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${percentage}%` }]} />
        </View>
    );
};

export function ReferralSystem() {
    const [referralCode] = useState("TRADVED24");
    const [activeTab, setActiveTab] = useState('rewards');
    const { count, xp } = useUserReferrals();

    const copyReferralCode = () => {
        Clipboard.setStringAsync(referralCode);
        Toast.show({
            type: 'success',
            text1: 'Referral code copied!',
            text2: 'Share with friends to earn rewards',
        });
    };

    const shareReferral = async () => {
        try {
            await Share.share({
                message: `Use my referral code ${referralCode} to get started with trading quizzes and duels on TradeVed! | https://tradved.com`,
            });
        } catch (error) {
            console.error("Error sharing:", error);
        }
    };
    
    const renderRewards = () => (
        <View style={styles.tabContentContainer}>
            <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Referral Progress</Text>
                    <Text style={styles.progressValue}>{count}/{rewards[rewards.length - 1].level}</Text>
                </View>
                <ProgressBar value={count} max={rewards[rewards.length - 1].level} />
            </View>
            {rewards.map((reward, index) => (
                <View key={index} style={[styles.rewardItem, reward.unlocked ? styles.rewardUnlockedBg : styles.rewardLockedBg]}>
                    <View style={styles.rewardLeft}>
                        <View style={[styles.rewardIconContainer, reward.unlocked ? styles.rewardIconUnlocked : styles.rewardIconLocked]}>
                            <Icon name="users" size={16} color={reward.unlocked ? '#000' : '#9CA3AF'} />
                        </View>
                        <View>
                            <Text style={styles.rewardText}>{reward.reward}</Text>
                            <Text style={styles.rewardSubtext}>{reward.level} Referrals</Text>
                        </View>
                    </View>
                     {reward.unlocked ? (
                        <View style={styles.unlockedBadge}><Text style={styles.unlockedBadgeText}>Unlocked</Text></View>
                    ) : (
                        <View style={styles.lockedBadge}><Text style={styles.lockedBadgeText}>{reward.level - count} more to go</Text></View>
                    )}
                </View>
            ))}
        </View>
    );

    const renderLeaderboard = () => (
        <View style={styles.tabContentContainer}>
            {leaderboard.map((user, index) => (
                <View key={index} style={[styles.leaderboardItem, user.isYou && styles.leaderboardYou]}>
                    <View style={styles.leaderboardLeft}>
                        <Text style={styles.leaderboardRank}>{index + 1}</Text>
                        {/* Placeholder for Avatar */}
                        <View style={styles.leaderboardAvatar} />
                        <Text style={styles.leaderboardName}>{user.name}</Text>
                    </View>
                    <View style={styles.leaderboardRight}>
                        <Icon name="users" size={16} color="#9CA3AF" />
                        <Text style={styles.leaderboardReferrals}>{user.referrals}</Text>
                    </View>
                </View>
            ))}
        </View>
    );


    return (
        <ScrollView style={styles.card}>
            <View style={styles.header}>
                <Icon name="gift" size={20} color="#A3E635" />
                <Text style={styles.cardTitle}>Refer & Earn</Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{count}</Text>
                    <Text style={styles.statLabel}>Friends Referred</Text>
                </View>
                <View style={[styles.statBox, {backgroundColor: 'rgba(250, 204, 21, 0.1)'}]}>
                    <Text style={styles.statValue}>{xp}</Text>
                    <Text style={styles.statLabel}>XP Earned</Text>
                </View>
            </View>
            
            <View style={styles.codeContainer}>
                <Text style={styles.inputLabel}>Your Referral Code</Text>
                <View style={styles.inputRow}>
                    <TextInput value={referralCode} readOnly style={styles.input} />
                    <TouchableOpacity style={styles.iconButton} onPress={copyReferralCode}>
                        <Icon name="copy" size={18} color="#D1D5DB" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.shareContainer}>
                <TouchableOpacity style={styles.mainShareButton} onPress={shareReferral}>
                    <Icon name="share-2" size={18} color="#000" />
                    <Text style={styles.mainShareButtonText}>Share Referral Link</Text>
                </TouchableOpacity>
                <View style={styles.socialButtonsContainer}>
                    <TouchableOpacity style={styles.socialButton}>
                        <FontAwesomeIcon name="facebook" size={16} color="#FFF" />
                    </TouchableOpacity>
                     <TouchableOpacity style={styles.socialButton}>
                        <FontAwesomeIcon name="twitter" size={16} color="#FFF" />
                    </TouchableOpacity>
                     <TouchableOpacity style={styles.socialButton}>
                        <FontAwesomeIcon name="linkedin" size={16} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.tabsContainer}>
                <View style={styles.tabsList}>
                    <TouchableOpacity style={[styles.tabTrigger, activeTab === 'rewards' && styles.activeTab]} onPress={() => setActiveTab('rewards')}>
                        <Icon name="gift" size={16} color={activeTab === 'rewards' ? '#FFF' : '#D1D5DB'} />
                        <Text style={[styles.tabText, activeTab === 'rewards' && styles.activeTabText]}>Rewards</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tabTrigger, activeTab === 'leaderboard' && styles.activeTab]} onPress={() => setActiveTab('leaderboard')}>
                        <Icon name="trophy" size={16} color={activeTab === 'leaderboard' ? '#FFF' : '#D1D5DB'} />
                        <Text style={[styles.tabText, activeTab === 'leaderboard' && styles.activeTabText]}>Leaderboard</Text>
                    </TouchableOpacity>
                </View>
                 {activeTab === 'rewards' ? renderRewards() : renderLeaderboard()}
            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    card: { flex: 1, backgroundColor: '#1F2937', padding: 16 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
    cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF', marginLeft: 8 },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    statBox: { flex: 1, backgroundColor: 'rgba(163, 230, 53, 0.1)', borderRadius: 8, padding: 12, alignItems: 'center', marginHorizontal: 4 },
    statValue: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
    statLabel: { fontSize: 12, color: '#9CA3AF' },
    codeContainer: { marginBottom: 24 },
    inputLabel: { color: '#D1D5DB', fontSize: 14, marginBottom: 8 },
    inputRow: { flexDirection: 'row', alignItems: 'center' },
    input: { flex: 1, backgroundColor: '#374151', color: '#FFF', borderRadius: 6, padding: 12, textAlign: 'center', fontFamily: 'monospace' },
    iconButton: { padding: 12, marginLeft: 8, borderWidth: 1, borderColor: '#4B5563', borderRadius: 6 },
    shareContainer: { marginBottom: 24 },
    mainShareButton: { flexDirection: 'row', backgroundColor: '#A3E635', justifyContent: 'center', alignItems: 'center', padding: 14, borderRadius: 8, marginBottom: 12 },
    mainShareButtonText: { color: '#000', fontWeight: 'bold', marginLeft: 8 },
    socialButtonsContainer: { flexDirection: 'row', justifyContent: 'space-around' },
    socialButton: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 10, marginHorizontal: 4, borderWidth: 1, borderColor: '#4B5563', borderRadius: 6 },
    tabsContainer: { width: '100%', marginBottom: 24 },
    tabsList: { flexDirection: 'row', backgroundColor: '#374151', borderRadius: 8, padding: 4 },
    tabTrigger: { flex: 1, flexDirection: 'row', paddingVertical: 10, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
    activeTab: { backgroundColor: '#4B5563' },
    tabText: { color: '#D1D5DB', marginLeft: 8 },
    activeTabText: { color: '#FFF' },
    tabContentContainer: { marginTop: 16, gap: 12 },
    progressSection: { marginBottom: 16 },
    progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    progressLabel: { color: '#D1D5DB', fontSize: 14 },
    progressValue: { color: '#FFF', fontWeight: '500' },
    progressContainer: { height: 8, backgroundColor: '#4B5563', borderRadius: 4 },
    progressBar: { height: '100%', backgroundColor: '#A3E635', borderRadius: 4 },
    rewardItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 8, borderWidth: 1 },
    rewardUnlockedBg: { backgroundColor: 'rgba(163, 230, 53, 0.05)', borderColor: 'rgba(163, 230, 53, 0.3)' },
    rewardLockedBg: { borderColor: '#4B5563' },
    rewardLeft: { flexDirection: 'row', alignItems: 'center' },
    rewardIconContainer: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    rewardIconUnlocked: { backgroundColor: '#A3E635' },
    rewardIconLocked: { backgroundColor: '#4B5563' },
    rewardText: { color: '#FFF', fontWeight: '500' },
    rewardSubtext: { color: '#9CA3AF', fontSize: 12 },
    unlockedBadge: { backgroundColor: '#A3E635', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    unlockedBadgeText: { color: '#000', fontSize: 12, fontWeight: 'bold' },
    lockedBadge: { borderWidth: 1, borderColor: '#4B5563', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    lockedBadgeText: { color: '#9CA3AF', fontSize: 12 },
    leaderboardItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 8 },
    leaderboardYou: { backgroundColor: 'rgba(163, 230, 53, 0.1)', borderColor: 'rgba(163, 230, 53, 0.3)', borderWidth: 1 },
    leaderboardLeft: { flexDirection: 'row', alignItems: 'center' },
    leaderboardRank: { color: '#9CA3AF', width: 24, textAlign: 'center' },
    leaderboardAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#4B5563', marginHorizontal: 12 },
    leaderboardName: { color: '#FFF', fontWeight: '500' },
    leaderboardRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    leaderboardReferrals: { color: '#9CA3AF' }
}); 
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Header } from '../../components/Header';

// Type for the API response
type QuestDetails = {
    id: string;
    title: string;
    description: string;
    content: string;
    content_type: string;
    logo_url: string;
    max_reward_point: number;
    participant_limit: number;
    participants: any[];
    quest_time: number;
    template: string;
    status: string;
    created_at: string;
    updated_at: string;
    is_lock: boolean;
    end_date: string;
};

export default function Achievement() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [questDetails, setQuestDetails] = React.useState<QuestDetails | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [allQuests, setAllQuests] = useState<{id: string, title: string}[]>([]);
    const [search, setSearch] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    const fetchQuestDetails = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                setError('Authentication required');
                return;
            }

            const response = await fetch(`https://api.dev.tradeved.com/quest/get/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch quest details');
            }

            const data = await response.json();
            setQuestDetails(data.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error fetching quest details:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchAllQuests = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                if (!token) return;
                const response = await fetch('https://api.dev.tradeved.com/quest/all', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) return;
                const data = await response.json();
                setAllQuests(data.data.map((q: any) => ({ id: q.id, title: q.title })));
            } catch {}
        };
        fetchAllQuests();
    }, []);

    const recommendations = useMemo(() => {
        if (!search) return [];
        return allQuests.filter(q => q.title.toLowerCase().includes(search.toLowerCase())).map(q => q.title).slice(0, 5);
    }, [search, allQuests]);

    const handleRecommendationPress = (rec: string) => {
        setSearch(rec);
        setShowDropdown(false);
        const quest = allQuests.find(q => q.title === rec);
        if (quest) {
            router.push({ pathname: '/quests/quest-details/[id]', params: { id: quest.id } });
        }
    };

    React.useEffect(() => {
        fetchQuestDetails();
    }, [id]);

    useFocusEffect(
      useCallback(() => {
        setSearch('');
        setShowDropdown(false);
      }, [])
    );

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#9BEC00" />
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={[styles.container, styles.centerContent]}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchQuestDetails}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <SafeAreaView style={styles.container}>
                {/* Fixed Main Header */}
                <Header
                    onProfilePress={() => {/* Handle profile press */ }}
                    onSearchPress={() => setShowDropdown(true)}
                    value={search}
                    onChangeText={(text: string) => {
                        setSearch(text);
                        setShowDropdown(true);
                    }}
                    recommendations={showDropdown ? recommendations : []}
                    onRecommendationPress={handleRecommendationPress}
                />

                {/* Content */}
                <View style={styles.content}>
                    {/* Sub Header */}
                    <View style={styles.subHeader}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.backButton}
                        >
                            <Ionicons name="arrow-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Quest Header Info */}
                    <View style={styles.questHeaderWrapper}>
                        <View style={styles.questHeaderContent}>
                            <View style={styles.questTitleRow}>
                                <Text style={styles.questTitle}>{questDetails?.title}</Text>
                                <View style={styles.questTimeContainer}>
                                    <Text style={styles.questTime}>{questDetails?.quest_time}min</Text>
                                    <Text style={styles.questType}>{questDetails?.template}</Text>
                                </View>
                            </View>
                            <View style={styles.contentSection}>
                                <View style={styles.questPoints}>
                                    <View style={styles.pointsAvatars}>
                                        <Image source={require('../../assets/images/profile.png')} style={[styles.pointAvatar, { zIndex: 1 }]} />
                                        <Image source={require('../../assets/images/profile.png')} style={[styles.pointAvatar, { marginLeft: -8, zIndex: 2 }]} />
                                        <Image source={require('../../assets/images/profile.png')} style={[styles.pointAvatar, { marginLeft: -8, zIndex: 3 }]} />
                                        <Image source={require('../../assets/images/profile.png')} style={[styles.pointAvatar, { marginLeft: -8, zIndex: 4 }]} />
                                    </View>
                                    <Text style={styles.pointsText}>{questDetails?.participants.length}</Text>
                                    <Text style={styles.totalPointsText}>/{questDetails?.participant_limit}</Text>
                                </View>
                                <View style={styles.metricsRow}>
                                    <View style={styles.questRewards}>
                                        <View style={styles.rewardItem}>
                                            <Image
                                                source={require('../../assets/images/hexagon.png')}
                                                style={styles.statIcon}
                                                resizeMode="contain"
                                            />
                                            <Text style={styles.rewardText}>Reward</Text>
                                        </View>
                                        <Text style={styles.rewardPoints}>{questDetails?.max_reward_point} pts</Text>
                                    </View>
                                    <View style={styles.verticalDivider} />
                                    <View style={styles.questTimeInfo}>
                                        <View style={styles.timeItem}>
                                            <Image
                                                source={require('../../assets/images/champion.png')}
                                                style={styles.statIcon}
                                                resizeMode="contain"
                                            />
                                            <Text style={styles.timeText}>Record time</Text>
                                        </View>
                                        <Text style={styles.timeDate}>{new Date(questDetails?.created_at || '').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: '2-digit' })}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <Image
                            source={{ uri: questDetails?.logo_url || require('../../assets/images/quest-header.jpg') }}
                            style={styles.questHeaderBg}
                            resizeMode="cover"
                        />
                        <View style={styles.progressBar}>
                            <View style={styles.progressFill} />
                        </View>
                    </View>

                    {/* Achievement Section */}
                    <View style={styles.achievementContainer}>
                        <View style={[styles.confettiRow, { justifyContent: 'space-between' }]}>
                            <Image
                                source={require('../../assets/images/confetti.png')}
                                style={styles.confettiImage}
                                resizeMode="contain"
                            />
                            <Image
                                source={require('../../assets/images/confetti.png')}
                                style={styles.confettiImage}
                                resizeMode="contain"
                            />
                        </View>

                        <Text style={styles.congratsTitle}>Congratulations</Text>

                        <View style={styles.recordContainer}>
                            <Text style={styles.recordText}>New Record : <Text style={styles.recordTime}>{questDetails?.quest_time}min</Text></Text>
                            <Text style={styles.personalBestText}>Personal Best : <Text style={styles.recordTime}>{questDetails?.quest_time}min</Text></Text>
                        </View>

                        <View style={styles.stopwatchContainer}>
                            <Image
                                source={require('../../assets/images/stopwatch.png')}
                                style={styles.stopwatchImage}
                                resizeMode="contain"
                            />
                        </View>

                        <Text style={styles.achievementText}>
                            You unlocked an achievement : <Text style={styles.achievementName}>Flash</Text>
                        </Text>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.shareButton}>
                                <Text style={styles.shareButtonText}>Share Achievement</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.continueButton}
                                onPress={() => router.replace(`/quests/explorequest/${id}`)}
                            >
                                <Text style={styles.continueButtonText}>Continue</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#242620',
    },
    fixedHeader: {
        backgroundColor: '#242620',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 40,
        paddingBottom: 12,
    },
    logo: {
        width: 37,
        height: 37,
        marginRight: 10,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        paddingHorizontal: 12,
        marginRight: 12,
    },
    searchIcon: {
        position: 'absolute',
        left: 12,
    },
    searchInput: {
        flex: 1,
        height: 40,
        color: '#FFF',
        fontSize: 16,
        paddingHorizontal: 25,
    },
    profileButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1A1A1A',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 32,
    },
    content: {
        flex: 1,
    },
    subHeader: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginTop: 82,
    },
    backButton: {
        padding: 8,
    },
    questHeaderWrapper: {
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 0,
        backgroundColor: '#666666',
    },
    questHeaderContent: {
        width: '75%',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    questHeaderBg: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '25%',
        height: '100%',
    },
    questTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 12,
    },
    questTitle: {
        maxWidth: '75%',
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    questTimeContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFbdbd',
        borderRadius: 4,
        padding: 4,
        alignItems: 'center',
    },
    questTime: {
        color: '#000',
        fontSize: 10,
        marginRight: 4,
    },
    questType: {
        color: '#000',
        fontSize: 12,
        fontWeight: '600',
    },
    contentSection: {
        gap: 2,
    },
    questPoints: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: -8,
    },
    pointsAvatars: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
    },
    pointAvatar: {
        width: 14,
        height: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff',
    },
    pointsText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },
    totalPointsText: {
        color: '#a2aba9',
        fontSize: 12,
        marginLeft: 2,
        fontWeight: '600',
    },
    questRewards: {
        alignItems: 'flex-start',
    },
    rewardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    statIcon: {
        width: 10,
        height: 10,
        marginRight: 4,
    },
    rewardText: {
        color: '#a2aba9',
        fontSize: 11,
    },
    rewardPoints: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '700',
    },
    questTimeInfo: {
        alignItems: 'flex-start',
    },
    timeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    timeText: {
        color: '#a2aba9',
        fontSize: 11,
        marginLeft: 4,
    },
    timeDate: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '700',
    },
    progressBar: {
        height: 6,
        marginTop: 16,
    },
    progressFill: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '100%',
        backgroundColor: '#9BEC00',
        borderRadius: 6,
    },
    metricsRow: {
        flexDirection: 'row',
        gap: 6,
        justifyContent: 'flex-end',
        marginBottom: -22,
        alignItems: 'center',
    },
    verticalDivider: {
        width: 0.5,
        height: 28,
        backgroundColor: '#a2aba9',
        marginHorizontal: 4,
    },
    achievementContainer: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 26,
    },
    confettiRow: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 20,
    },
    confettiImage: {
        width: 110,
        height: 110,
    },
    congratsTitle: {
        color: '#FFF',
        fontSize: 26,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 20,
    },
    recordContainer: {
        alignItems: 'center',
        gap: 4,
        marginBottom: 18,
    },
    recordText: {
        color: '#FFF',
        fontSize: 22,
        // fontWeight: '400',
    },
    personalBestText: {
        color: '#fff',
        fontSize: 18,
    },
    recordTime: {
        fontWeight: '600',
    },
    stopwatchContainer: {
        alignItems: 'center',
        marginBottom: 12,
    },
    stopwatchImage: {
        width: 110,
        height: 110,
    },
    achievementText: {
        color: '#a2aba9',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 32,
    },
    achievementName: {
        color: '#a2aba9',
        fontWeight: '700',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    shareButton: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#FFFbfb',
    },
    shareButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },
    continueButton: {
        paddingHorizontal: 30,
        paddingVertical: 8,
        borderRadius: 4,
        backgroundColor: '#9BEC00',
    },
    continueButtonText: {
        color: '#0f1209',
        fontSize: 14,
        fontWeight: '700',
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#ff4d4d',
        fontSize: 16,
        marginBottom: 16,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#9BEC00',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#242620',
        fontSize: 16,
        fontWeight: '600',
    },
}); 
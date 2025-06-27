import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import CustomTabBar from '../../../components/CustomTabBar';
import { Header } from '../../../components/Header';
import { QuestCardItem } from '../../../components/QuestCardItem';

type SpaceSection = {
    id: string;
    name: string;
    logo_url: string | null;
    description: string | null;
    quests: QuestItem[];
    participants: any[];
    created_at: string;
    updated_at: string;
};

type QuestItem = {
    id: string;
    title: string;
    description: string;
    max_reward_point: number;
    participant_limit: number;
    participants: any[];
    logo_url: string;
    is_lock: boolean;
    status: string;
    end_date: string;
    quest_time: number;
    reattempt: number;
    template: string;
    content_type: string;
    content: string;
    category: string;
    approval_status: string;
    view_status: string;
    created_at: string;
    updated_at: string;
    questQNA?: {
        id: string;
        total_question: number;
        questions: any[];
    };
};

export default function ExploreQuest() {
    const router = useRouter();
    const [spaceSections, setSpaceSections] = useState<SpaceSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { id } = useLocalSearchParams();
    const [allQuests, setAllQuests] = useState<{ id: string, title: string }[]>([]);
    const [search, setSearch] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    const fetchSpaceSections = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                setError('Authentication required');
                return;
            }

            const response = await fetch(`https://api.dev.tradeved.com/space/all`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch spaces');
            }

            const data = await response.json();
            setSpaceSections(data.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error fetching spaces:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSpaceSections();
    }, []);

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
            } catch { }
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
                <TouchableOpacity style={styles.retryButton} onPress={fetchSpaceSections}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false
                }}
            />
            <SafeAreaView style={styles.container}>
                <Header
                    onProfilePress={() => {/* Handle profile press */ }}
                    onSearchPress={() => setShowDropdown(true)}
                    value={search}
                    onChangeText={text => {
                        setSearch(text);
                        setShowDropdown(true);
                    }}
                    recommendations={showDropdown ? recommendations : []}
                    onRecommendationPress={handleRecommendationPress}
                />

                <ScrollView
                    style={styles.content}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.contentContainer}
                >
                    <View style={styles.pageHeader}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => router.back()}
                        >
                            <Ionicons name="arrow-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Explore Quest</Text>
                    </View>

                    {spaceSections.map((section) => {
                        // console.log('Participants:', section.participants);
                        const MAX_TITLE_LENGTH = 15;
                        const displayTitle = (section.name || 'Space Name').length > MAX_TITLE_LENGTH
                            ? (section.name || 'Space Name').slice(0, MAX_TITLE_LENGTH) + '...'
                            : (section.name || 'Space Name');

                        return (
                            <View key={section.id} style={styles.spaceSection}>
                                <TouchableOpacity
                                    style={styles.spaceTitleContainer}
                                    onPress={() => router.push(`/quests/space-details/${section.id}`)}
                                >
                                    <View style={styles.spaceInfoContainer}>
                                        <Image
                                            source={section.logo_url ? { uri: section.logo_url } : require('../../../assets/images/lazada.png')}
                                            style={styles.spaceIcon}
                                            resizeMode="contain"
                                        />
                                        <View style={styles.spaceTitleContent}>
                                            <View style={styles.titleRow}>
                                                <Text style={styles.spaceTitle}>{displayTitle}</Text>
                                                <Text style={styles.questCount}>{section.quests.length} Quests</Text>
                                                <TouchableOpacity onPress={() => router.push(`/quests/space-details/${section.id}`)}>
                                                    <Text style={styles.viewAllText}>View all</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.spaceMetrics}>
                                                <View style={styles.leftMetrics}>
                                                    <View style={styles.avatarStack}>
                                                        {[...Array(4)].map((_, idx) => (
                                                            <Image
                                                                key={idx}
                                                                source={{ uri: 'https://i.pravatar.cc/40' }}
                                                                style={[styles.avatar, { left: idx * 12 }]}
                                                            />
                                                        ))}
                                                    </View>
                                                    <View style={styles.questCountContainer}>
                                                        <Text style={styles.questCountText}>{section.quests?.length || 0}</Text>
                                                        <Text style={styles.questCountLabel}>/50k</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.pointsContainer}>
                                                    <View style={styles.pointsWrapper}>
                                                        <Image
                                                            source={require('../../../assets/images/hexagon.png')}
                                                            style={styles.pointsIcon}
                                                            resizeMode="contain"
                                                        />
                                                        <Text style={styles.pointsText}>
                                                            {section.quests?.reduce((sum, quest) => sum + (quest.max_reward_point || 0), 0) || 0} pts
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>

                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={styles.questsScrollContainer}
                                    contentContainerStyle={styles.questsContentContainer}
                                >
                                    {section.quests?.map((quest) => (
                                        <View key={quest.id} style={styles.questCardWrapper}>
                                            <QuestCardItem
                                                id={quest.id}
                                                questName={quest.title}
                                                currentPoints={quest.participants?.length?.toString() || '0'}
                                                totalPoints={quest.participant_limit?.toString() || '0'}
                                                reward={quest.max_reward_point?.toString() || '0'}
                                                endDate={quest.end_date || 'No end date'}
                                                multiplier="2X"
                                                image={quest.logo_url ? { uri: quest.logo_url } : require('../../../assets/images/quest1.jpg')}
                                                brandName={section.name || 'Space Name'}
                                            />
                                        </View>
                                    ))}
                                </ScrollView>

                                <View style={styles.sectionSeparatorWrapper}>
                                    <View style={styles.sectionSeparator} />
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>
                <CustomTabBar />
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#242620',
    },
    headerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 100,
        backgroundColor: '#242620',
        zIndex: 99,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#242620',
        zIndex: 100,
        height: 100,
        paddingTop: 40,
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
        borderRadius: 20,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        paddingTop: 90,
        paddingBottom: 40,

    },
    pageHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 17,
        paddingVertical: 16,
        marginBottom: 37,

    },
    backButton: {
        marginRight: 12,
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    spaceSection: {
        marginBottom: 24,
    },
    spaceTitleContainer: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    spaceInfoContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    spaceIcon: {
        width: 54,
        height: 54,
        marginRight: 12,
        borderRadius: 8,
    },
    spaceTitleContent: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 8,
    },
    spaceTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
    },
    questCount: {
        color: '#fff',
        fontSize: 14,
        marginRight: 42,
    },
    viewAllText: {
        color: '#9BEC00',
        fontSize: 14,
        fontWeight: 'bold',
        top: 15,
    },
    spaceMetrics: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftMetrics: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 62,
    },
    avatarStack: {
        flexDirection: 'row',
        position: 'relative',
        marginRight: -10,
        height: 20,
        width: 20,
      },
    avatarsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 20,
        height: 20,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#242620',
        position: 'absolute',
      },
    questCountContainer: {
        marginLeft: -8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    questCountText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    questCountLabel: {
        color: '#a2ab9a',
        fontSize: 12,
        marginLeft: 1,
    },
    pointsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: -30,
    },
    pointsWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 30,
    },
    pointsIcon: {
        width: 12,
        height: 12,
    },
    pointsText: {
        color: '#fff',
        fontSize: 14,
        marginRight: 76,
    },
    sectionSeparatorWrapper: {
        paddingHorizontal: 19,
        marginTop: 24,
        marginBottom: 24,
    },
    sectionSeparator: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    questsScrollContainer: {
        marginLeft: 0,
        marginBottom: 24,
        gap: 16,
    },
    questsContentContainer: {
        paddingLeft: 16,
        paddingRight: 26,
    },
    questCardWrapper: {
        width: 290,
        marginRight: 16,
        position: 'relative',
        paddingTop: 16,
    },
    multiplierBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: '#9BEC00',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        zIndex: 1,
    },
    multiplierText: {
        color: '#242620',
        fontSize: 14,
        fontWeight: 'bold',
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
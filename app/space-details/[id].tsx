import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  ImageStyle,
  PanResponder,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { Header } from '../../components/Header';

type Styles = {
  container: ViewStyle;
  header: ViewStyle;
  logo: ImageStyle;
  searchContainer: ViewStyle;
  searchIcon: ImageStyle;
  searchInput: TextStyle;
  profileButton: ViewStyle;
  profileImage: ImageStyle;
  profileImage1: ImageStyle;
  scrollView: ViewStyle;
  subHeader: ViewStyle;
  backButton: ViewStyle;
  titleGroup: ViewStyle;
  tabButton: ViewStyle;
  headerText: TextStyle;
  leaderboardText: TextStyle;
  activeTabText: TextStyle;
  activeTab: ViewStyle;
  sortButton: ViewStyle;
  sortText: TextStyle;
  spaceInfoContainer: ViewStyle;
  spaceInfo: ViewStyle;
  spaceIcon: ImageStyle;
  spaceContent: ViewStyle;
  titleRow: ViewStyle;
  spaceName: TextStyle;
  spaceDescription: TextStyle;
  spaceMetrics: ViewStyle;
  avatarsContainer: ViewStyle;
  avatar: ImageStyle;
  questMetric: TextStyle;
  questCount: TextStyle;
  imageContainer: ViewStyle;
  backgroundImage: ImageStyle;
  imageOverlay: ViewStyle;
  questList: ViewStyle;
  questCard: ViewStyle;
  questCardLocked: ViewStyle;
  cardOverlay: ViewStyle;
  questContent: ViewStyle;
  questHeader: ViewStyle;
  questName: TextStyle;
  progressRow: ViewStyle;
  progressText: TextStyle;
  totalText: TextStyle;
  questDescription: TextStyle;
  questFooter: ViewStyle;
  footerColumn: ViewStyle;
  labelRow: ViewStyle;
  footerLabel: TextStyle;
  footerValue: TextStyle;
  verticalDivider: ViewStyle;
  clockIcon: ImageStyle;
  questImageContainer: ViewStyle;
  questImage: ImageStyle;
  pointsContainer: ViewStyle;
  pointsPill: ViewStyle;
  pointsText: TextStyle;
  multiplierText: TextStyle;
  progressBadgeText: TextStyle;
  shadowWrapper: ViewStyle;
  liveContainer: ViewStyle;
  liveDot: ViewStyle;
  liveText: TextStyle;
  followButton: ViewStyle;
  followText: TextStyle;
  lockOverlay: ViewStyle;
  lockIcon: ImageStyle;
  leaderboardList: ViewStyle;
  leaderboardItem: ViewStyle;
  userItem: ViewStyle;
  rankContainer: ViewStyle;
  topRankContainer: ViewStyle;
  rankBadge: ImageStyle;
  topRankText: TextStyle;
  rankText: TextStyle;
  userInfo: ViewStyle;
  nameContainer: ViewStyle;
  username: TextStyle;
  level: TextStyle;
  statsContainer: ViewStyle;
  achievementsContainer: ViewStyle;
  leaderPointsContainer: ViewStyle;
  achievementIcon: ImageStyle;
  pointsIcon: ImageStyle;
  achievementCount: TextStyle;
  points: TextStyle;
  fixedBottomCard: ViewStyle;
  fixedRankContainer: ViewStyle;
  fixedRankText: TextStyle;
  fixedProfileImage: ImageStyle;
  fixedUserInfo: ViewStyle;
  fixedNameContainer: ViewStyle;
  fixedUsername: TextStyle;
  fixedLevel: TextStyle;
  fixedStatsContainer: ViewStyle;
  fixedAchievementContainer: ViewStyle;
  fixedAchievementIcon: ImageStyle;
  fixedAchievementCount: TextStyle;
  fixedPointsContainer: ViewStyle;
  fixedPointsIcon: ImageStyle;
  fixedPoints: TextStyle;
  sortOverlay: ViewStyle;
  sortContent: ViewStyle;
  dragHandleContainer: ViewStyle;
  dragHandle: ViewStyle;
  sortTitle: TextStyle;
  divider: ViewStyle;
  sortOption: ViewStyle;
  sortOptionText: TextStyle;
  sortRadio: ViewStyle;
  sortRadioSelected: ViewStyle;
  sortRadioInner: ViewStyle;
  continueButton: ViewStyle;
  continueText: TextStyle;
  leaderboardContainer: ViewStyle;
  loadingContainer: ViewStyle;
  loadingText: TextStyle;
  noQuestsContainer: ViewStyle;
  noQuestsText: TextStyle;
  fullHeightImage: ViewStyle;
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

type SpaceDetails = {
  id: string;
  name: string | null;
  description: string | null;
  logo_url: string | null;
  banner: string | null;
  company_name: string | null;
  email: string;
  category: string[];
  quests: QuestItem[];
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  links: any[];
  documents: any[];
};

export default function SpaceDetails() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<'quest' | 'leaderboard'>('quest');
  const [showSort, setShowSort] = React.useState(false);
  const [sortBy, setSortBy] = React.useState('Daily');
  const [spaceDetails, setSpaceDetails] = React.useState<SpaceDetails | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const pan = React.useRef(new Animated.ValueXY()).current;
  const { id } = useLocalSearchParams();
  

  // Create interpolated values for smooth animation
  const animatedTranslateY = pan.y.interpolate({
    inputRange: [0, 1000],
    outputRange: [0, 1000],
    extrapolate: 'clamp'
  });

  const animatedOpacity = pan.y.interpolate({
    inputRange: [0, 100, 200],
    outputRange: [1, 0.8, 0],
    extrapolate: 'clamp'
  });

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) => {
        return Math.abs(gesture.dy) > 10;
      },
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          // Allow full dragging with minimal resistance
          pan.y.setValue(gesture.dy);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        const dragDistance = gesture.dy;

        if (dragDistance > 200) {
          // First set showSort to false immediately to prevent flash
          setShowSort(false);
          // Then reset the position without animation
          pan.setValue({ x: 0, y: 0 });
        } else {
          // Snap back with spring
          Animated.spring(pan.y, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 12,
            restDisplacementThreshold: 10,
            restSpeedThreshold: 10,
          }).start();
        }
      },
    })
  ).current;

  const fetchSpaceDetails = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch(`https://api.dev.tradeved.com/space/get/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('response', response);
      if (!response.ok) {
        throw new Error('Failed to fetch quest details');
      }

      const data = await response.json();
      console.log('Quest details:', data);
      setSpaceDetails(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching quest details:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSpaceDetails();
  }, [id]);

  

  const leaderboardData = [
    {
      id: 1,
      rank: 1,
      username: '@abc',
      level: 24,
      points: '1200pts',
      achievements: 7,
      image: require('../../assets/images/profile.png'),
    },
    {
      id: 2,
      rank: 2,
      username: '@abc',
      level: 24,
      points: '1000pts',
      achievements: 7,
      image: require('../../assets/images/profile.png'),
    },
    {
      id: 3,
      rank: 3,
      username: '@abc',
      level: 24,
      points: '900pts',
      achievements: 7,
      image: require('../../assets/images/profile.png'),
    },
    {
      id: 4,
      rank: 4,
      username: '@abc',
      level: 24,
      points: '850pts',
      achievements: 7,
      image: require('../../assets/images/profile.png'),
    },
    {
      id: 5,
      rank: 5,
      username: '@abc',
      level: 24,
      points: '750pts',
      achievements: 7,
      image: require('../../assets/images/profile.png'),
    },
    {
      id: 6,
      rank: 6,
      username: '@abc',
      level: 24,
      points: '650pts',
      achievements: 7,
      image: require('../../assets/images/profile.png'),
    },
    {
      id: 7,
      rank: 18,
      username: 'YOU',
      level: 18,
      points: '300pts',
      achievements: 2,
      image: require('../../assets/images/profile.png'),
      isUser: true,
    },
  ];
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
        <TouchableOpacity style={styles.retryButton} onPress={fetchSpaceDetails}>
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
          onSearchPress={() => {/* Handle search press */ }}
        />

        <View style={styles.subHeader}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.titleGroup}>
            <TouchableOpacity
              onPress={() => setActiveTab('quest')}
              style={[styles.tabButton, activeTab === 'quest' && styles.activeTab]}
            >
              <Text style={[styles.headerText, activeTab === 'quest' && styles.activeTabText]}>Quest</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('leaderboard')}
              style={[styles.tabButton, activeTab === 'leaderboard' && styles.activeTab]}
            >
              <Text style={[styles.leaderboardText, activeTab === 'leaderboard' && styles.activeTabText]}>Leaderboard</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setShowSort(true)}
          >
            <Text style={styles.sortText}>Sort by</Text>
            <Ionicons name="chevron-down" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>

        <ScrollView style={[styles.scrollView, activeTab === 'leaderboard' && { marginBottom: '30%' }]}>
          {activeTab === 'quest' ? (
            <>
              <View style={styles.spaceInfoContainer}>
                <View style={styles.spaceInfo}>
                  <Image
                    source={spaceDetails?.logo_url ? { uri: spaceDetails.logo_url } : require('../../assets/images/lazada.png')}
                    style={styles.spaceIcon}
                    resizeMode="contain"
                  />
                  <View style={styles.spaceContent}>
                    <View style={styles.titleRow}>
                      <Text style={styles.spaceName}>{spaceDetails?.name || 'Space Name'}</Text>
                    </View>
                    <Text style={styles.spaceDescription}>{spaceDetails?.description || 'No description available'}</Text>
                    <View style={styles.spaceMetrics}>
                      <View style={styles.avatarsContainer}>
                        {spaceDetails?.quests?.slice(0, 3).map((quest, index) => (
                          <Image 
                            key={quest.id}
                            source={quest.logo_url ? { uri: quest.logo_url } : require('../../assets/images/profile.png')} 
                            style={[styles.avatar, index > 0 && { marginLeft: -8 }]} 
                          />
                        ))}
                      </View>
                      <Text style={styles.questMetric}>{spaceDetails?.quests?.length || 0}</Text>
                    </View>
                    <Text style={styles.questCount}>{spaceDetails?.quests?.length || 0} Quests</Text>
                  </View>
                </View>
                <View style={styles.imageContainer}>
                  <Image
                    source={spaceDetails?.banner ? { uri: spaceDetails.banner } : require('../../assets/images/lazadaquest.png')}
                    style={styles.backgroundImage}
                    resizeMode="cover"
                  />
                  <View style={styles.imageOverlay} />
                  <TouchableOpacity style={styles.followButton}>
                    <Text style={styles.followText}>Follow</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.questList}>
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading quests...</Text>
                  </View>
                ) : spaceDetails?.quests?.length ? (
                  spaceDetails.quests.map((quest) => (
                    <TouchableOpacity 
                      key={quest.id} 
                      style={[styles.questCard, quest.is_lock && styles.questCardLocked]}
                      onPress={() => router.push(`/quest-details/${quest.id}`)}
                    >
                      <View style={styles.questContent}>
                        {quest.is_lock && <View style={styles.cardOverlay} />}
                        <View style={styles.questHeader}>
                          <Text style={styles.questName}>{quest.title}</Text>
                          {/* <Ionicons name="time-outline" size={12} color="#9BEC00" style={{ marginTop: -4, marginRight: -16 }} />
                          <Text style={styles.progressBadgeText}>{quest.participants.length}/{quest.participant_limit}</Text> */}
                        </View>
                        <View style={styles.progressRow}>
                          <View style={styles.avatarsContainer}>
                            {quest.participants.slice(0, 4).map((participant, index) => (
                              <Image 
                                key={index}
                                source={require('../../assets/images/profile.png')} 
                                style={[styles.avatar, index > 0 && { marginLeft: -8 }]} 
                              />
                            ))}
                          </View>
                          <Text style={styles.progressText}>{quest.participants.length}</Text>
                          <Text style={styles.totalText}>/{quest.participant_limit}</Text>
                        </View>
                        <Text style={styles.questDescription} numberOfLines={3}>{quest.description}</Text>
                        <View style={styles.questFooter}>
                          <View style={styles.footerColumn}>
                            <View style={styles.labelRow}>
                              <Image
                                source={require('../../assets/images/hexagon.png')}
                                style={styles.clockIcon}
                                resizeMode="contain"
                              />
                              <Text style={styles.footerLabel}>Reward</Text>
                            </View>
                            <Text style={styles.footerValue}>{quest.max_reward_point} pts</Text>
                          </View>
                          {/* <View style={styles.verticalDivider} />
                          <View style={styles.footerColumn}>
                            <View style={styles.labelRow}>
                              <Image
                                source={require('../../assets/images/uis_calender.png')}
                                style={styles.clockIcon}
                                resizeMode="contain"
                              />
                              <Text style={styles.footerLabel}>End Date</Text>
                            </View>
                            <Text style={styles.footerValue}>{quest.end_date || 'No end date'}</Text>
                          </View> */}
                        </View>
                      </View>
                      <View style={[styles.questImageContainer, !quest.is_lock && styles.fullHeightImage]}>
                        <Image
                          source={quest.logo_url ? { uri: quest.logo_url } : require('../../assets/images/lazadaquest1.png')}
                          style={[styles.questImage, !quest.is_lock && styles.fullHeightImage]}
                          resizeMode="cover"
                        />
                        {quest.is_lock && (
                          <View style={styles.lockOverlay}>
                            <Image
                              source={require('../../assets/images/lock.png')}
                              style={styles.lockIcon}
                              resizeMode="contain"
                            />
                          </View>
                        )}
                        <View style={styles.shadowWrapper}>
                          <Shadow
                            distance={16}
                            startColor={'#9BEC0040'}
                            endColor={'#9BEC0000'}
                            offset={[0, 0]}
                          >
                            <View style={styles.liveContainer}>
                              <View style={styles.liveDot} />
                              <Text style={styles.liveText}>{new Date(quest.created_at).toLocaleDateString()}</Text>
                            </View>
                          </Shadow>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.noQuestsContainer}>
                    <Text style={styles.noQuestsText}>No quests available</Text>
                  </View>
                )}
              </View>
            </>
          ) : (
            <View style={styles.leaderboardList}>
              {leaderboardData.map((item) => !item.isUser && (
                <View
                  key={item.id}
                  style={styles.leaderboardItem}
                >
                  <View style={styles.rankContainer}>
                    {item.rank <= 3 ? (
                      <View style={styles.topRankContainer}>
                        <Image
                          source={
                            item.rank === 1
                              ? require('../../assets/images/rank1.png')
                              : item.rank === 2
                                ? require('../../assets/images/rank2.png')
                                : require('../../assets/images/rank3.png')
                          }
                          style={styles.rankBadge}
                        />
                        <Text style={styles.topRankText}>{item.rank}</Text>
                      </View>
                    ) : (
                      <Text style={styles.rankText}>
                        {item.rank}
                      </Text>
                    )}
                  </View>
                  <Image source={item.image} style={styles.profileImage1} resizeMode='cover' />
                  <View style={styles.userInfo}>
                    <View style={styles.nameContainer}>
                      <Text style={styles.username}>{item.username} •</Text>
                      <Text style={styles.level}>Level {item.level}</Text>
                    </View>
                    <View style={styles.statsContainer}>
                      <View style={styles.achievementsContainer}>
                        <Image
                          source={require('../../assets/images/fire.png')}
                          style={styles.achievementIcon}
                        />
                        <Text style={styles.achievementCount}>{item.achievements}</Text>
                      </View>
                      <View style={styles.leaderPointsContainer}>
                        <Image
                          source={require('../../assets/images/hexagon.png')}
                          style={styles.pointsIcon}
                        />
                        <Text style={styles.points}>{item.points}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {activeTab === 'leaderboard' && leaderboardData.find(item => item.isUser) && (
          <View style={styles.fixedBottomCard}>
            <View style={styles.fixedRankContainer}>
              <Text style={styles.fixedRankText}>
                {leaderboardData.find(item => item.isUser)?.rank}
              </Text>
            </View>
            <Image
              source={leaderboardData.find(item => item.isUser)?.image}
              style={styles.fixedProfileImage}
              resizeMode='cover'
            />
            <View style={styles.fixedUserInfo}>
              <View style={styles.fixedNameContainer}>
                <Text style={styles.fixedUsername}>YOU</Text>
                <Text style={styles.fixedLevel}>• Level {leaderboardData.find(item => item.isUser)?.level}</Text>
              </View>
              <View style={styles.fixedStatsContainer}>
                <View style={styles.fixedAchievementContainer}>
                  <Image
                    source={require('../../assets/images/fire.png')}
                    style={styles.fixedAchievementIcon}
                  />
                  <Text style={styles.fixedAchievementCount}>
                    {leaderboardData.find(item => item.isUser)?.achievements}
                  </Text>
                </View>
                <View style={styles.fixedPointsContainer}>
                  <Image
                    source={require('../../assets/images/hexagon.png')}
                    style={styles.fixedPointsIcon}
                  />
                  <Text style={styles.fixedPoints}>
                    {leaderboardData.find(item => item.isUser)?.points}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {showSort && (
          <View style={[StyleSheet.absoluteFill, { zIndex: 2000 }]}>
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                { opacity: animatedOpacity }
              ]}
            >
              <BlurView
                intensity={40}
                style={StyleSheet.absoluteFill}
                tint="light"
              />
            </Animated.View>
            <Pressable
              style={[StyleSheet.absoluteFill, styles.sortOverlay]}
              onPress={() => {
                setShowSort(false);
                pan.setValue({ x: 0, y: 0 });
              }}
            >
              <Animated.View
                style={[
                  styles.sortContent,
                  {
                    transform: [{ translateY: animatedTranslateY }],
                    opacity: animatedOpacity
                  }
                ]}
                {...panResponder.panHandlers}
              >
                <View style={styles.dragHandleContainer}>
                  <View style={styles.dragHandle} />
                </View>
                <Text style={styles.sortTitle}>Sort By</Text>
                <View style={styles.divider} />
                {['Daily', 'Weekly', 'Monthly', 'All Time'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.sortOption}
                    onPress={() => {
                      setSortBy(option);
                      // setShowSort(true);
                    }}
                  >
                    <Text style={styles.sortOptionText}>{option}</Text>
                    <View style={[
                      styles.sortRadio,
                      sortBy === option && styles.sortRadioSelected
                    ]}>
                      {sortBy === option && <View style={styles.sortRadioInner} />}
                    </View>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.continueButton}
                  onPress={() => setShowSort(false)}
                >
                  <Text style={styles.continueText}>Continue</Text>
                </TouchableOpacity>
              </Animated.View>
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242620',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 12,
    backgroundColor: '#242620',
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
    // marginRight: 12,
  },
  profileImage1: {
    width: 70,
    height: 76,
    borderRadius: 10,
    marginRight: 12,
  },
  scrollView: {
    flex: 1,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#242620',
    justifyContent: 'space-between',
    marginTop: 88,
  },
  backButton: {
    padding: 4,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
    marginLeft: 8,
  },
  tabButton: {
    paddingVertical: 2,
    paddingHorizontal: 3,
    borderRadius: 4,
  },
  headerText: {
    color: '#a2aba9',
    fontSize: 16,
    fontWeight: 'bold',
  },
  leaderboardText: {
    color: '#a2aba9',
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFF',
  },
  activeTab: {
    backgroundColor: '#48661c',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    color: '#F6ffe3',
    fontSize: 14,
    fontWeight: '500',
  },
  spaceInfoContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    // marginHorizontal: 16,
    marginBottom: 16,
    height: 250,
  },
  spaceInfo: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  spaceIcon: {
    width: 66,
    height: 66,
    borderRadius: 16,
    marginBottom: 0,
  },
  spaceContent: {
    flex: 1,
    paddingLeft: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  spaceName: {
    color: '#242620',
    fontSize: 16,
    fontWeight: 'bold',
  },
  spaceDescription: {
    color: '#666',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12,
  },
  spaceMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 16,
    height: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  questMetric: {
    color: '#242620',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: -6,
  },
  questCount: {
    color: '#666',
    fontSize: 12,
    marginTop: 8,
    marginLeft: 74,
  },
  imageContainer: {
    width: '55%',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '220%',
    height: '220%',
    position: 'absolute',
    top: '-70%',
    left: '55%',
    transform: [
      { scale: 1.2 },
      { rotate: '60deg' }
    ],
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  questList: {
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 18,
    gap: 16,
  },
  questCard: {
    flexDirection: 'row',
    backgroundColor: '#2c2e27',
    borderRadius: 8,
    overflow: 'visible',
    marginBottom: 16,
    height: 210,
    paddingTop: 16,
    position: 'relative',
  },
  questCardLocked: {
    // no styles needed here anymore
  },
  cardOverlay: {
    position: 'absolute',
    top: -16,
    left: 0,
    right: -114,
    bottom: 0,
    backgroundColor: '#72727280',
    zIndex: 1,
    borderRadius: 8,
  },
  questContent: {
    flex: 1,
    padding: 16,
    zIndex: 2,
  },
  questHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  questName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  totalText: {
    color: '#a2aba9',
    fontSize: 12,
  },
  questDescription: {
    color: '#a2ab9a',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12,
    marginRight: 16,
    flex: 1,
  },
  questFooter: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 24,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2c2e27',
    borderBottomLeftRadius: 8,
  },
  footerColumn: {
    flex: 0,
    minWidth: 80,
    marginRight: -26,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 0,
  },
  footerLabel: {
    color: '#a2aba9',
    fontSize: 12,
  },
  footerValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    paddingLeft: 0,
  },
  verticalDivider: {
    width: 0.5,
    height: 36,
    backgroundColor: '#a2aba9',
    marginRight: -8,
    // marginTop: 0,
  },
  clockIcon: {
    width: 12,
    height: 12,
    marginRight: -2,
    // tintColor: '#666666',
  },
  questImageContainer: {
    width: '30%',
    position: 'relative',
  },
  fullHeightImage: {
    height: '100%',
  },
  questImage: {
    width: '100%',
    height: '100%',
  },
  pointsContainer: {
    position: 'absolute',
    top: -12,
    right: -6,
    backgroundColor: '#2F8EFF',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 10,
    elevation: 6,
  },
  pointsPill: {
    backgroundColor: '#242620',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  pointsText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  multiplierText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  progressBadgeText: {
    color: '#fff',
    fontSize: 12,
    marginTop: -4,
  },
  shadowWrapper: {
    position: 'absolute',
    bottom: 10,
    left: 17,
    zIndex: 10,
  },
  liveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#242620',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#9BEC00',
    shadowColor: '#9BEC00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9BEC00',
    marginRight: 2,
  },
  liveText: {
    color: '#9BEC00',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0,
  },
  followButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#9BEC00',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  followText: {
    color: '#242620',
    fontSize: 14,
    fontWeight: 'bold',
  },
  lockOverlay: {
    position: 'absolute',
    top: -12,
    right: -6,
    width: 54,
    height: 22,
    backgroundColor: '#cd0070',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    elevation: 6,
  },
  lockIcon: {
    width: 16,
    height: 16,
    tintColor: '#FFFFFF',
  },
  leaderboardList: {
    paddingHorizontal: 16,
    paddingTop: 16,
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
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#272e28',
    borderColor: '#d3d3d3',
    borderWidth: 0.5,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    height: 116,
  },
  userItem: {
    backgroundColor: '#272e28',
  },
  rankContainer: {
    width: 32,
    alignItems: 'center',
    marginRight: 12,
  },
  topRankContainer: {
    position: 'relative',
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadge: {
    width: 32,
    height: 32,
    position: 'absolute',
  },
  topRankText: {
    color: '#242620',
    fontSize: 14,
    fontWeight: 'bold',
    zIndex: 1,
  },
  rankText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: -10,
  },
  username: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  level: {
    color: '#a2aba9',
    fontSize: 13,
    marginLeft: -4,
  },
  statsContainer: {
    flexDirection: 'column',
    gap: 4,
    marginTop: 20,
  },
  achievementsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  leaderPointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  achievementIcon: {
    width: 16,
    height: 16,
  },
  pointsIcon: {
    width: 16,
    height: 16,
  },
  achievementCount: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  points: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  fixedBottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: '#0f1209',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 1000,
  },
  fixedRankContainer: {
    width: 32,
    alignItems: 'center',
    marginRight: 12,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fixedRankText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  fixedProfileImage: {
    width: 70,
    height: 76,
    borderRadius: 10,
    marginRight: 12,
  },
  fixedUserInfo: {
    flex: 1,
  },
  fixedNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fixedUsername: {
    color: '#9BEC00',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  fixedLevel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  fixedStatsContainer: {
    flexDirection: 'column',
    position: 'absolute',
    right: 10,
    gap: 22,
    bottom: -20,
  },
  fixedAchievementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fixedAchievementIcon: {
    width: 16,
    height: 16,
  },
  fixedAchievementCount: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  fixedPointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fixedPointsIcon: {
    width: 16,
    height: 16,
  },
  fixedPoints: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  sortOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sortContent: {
    backgroundColor: '#2c2e27',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 24,
    paddingBottom: 32,
  },
  dragHandleContainer: {
    alignItems: 'center',
    marginBottom: 16,
    marginTop: -8,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 2,
    opacity: 0.3,
  },
  sortTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#ffffff20',
    marginBottom: 16,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  sortOptionText: {
    color: '#FFF',
    fontSize: 16,
  },
  sortRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortRadioSelected: {
    borderColor: '#fff',
  },
  sortRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#9BEC00',
  },
  continueButton: {
    backgroundColor: '#9BEC00',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  continueText: {
    color: '#242620',
    fontSize: 16,
    fontWeight: '600',
  },
  leaderboardContainer: {
    flex: 1,
    position: 'relative',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFF',
    fontSize: 16,
  },
  noQuestsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noQuestsText: {
    color: '#FFF',
    fontSize: 16,
  },
}); 
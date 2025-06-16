import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  ImageSourcePropType,
  ImageStyle,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { EventCard } from '../../components/EventCard';
import { FeaturedQuestCard } from '../../components/FeaturedQuestCard';
import { Header } from '../../components/Header';
import { QuestCardItem } from '../../components/QuestCardItem';
import { SpaceCard } from '../../components/SpaceCard';

type EventItem = {
  id: string;
  title: string;
  brandName: string;
  image: ImageSourcePropType;
  points: string;
  multiplier: string;
  isLive: boolean;
};

type QuestItem = {
  id: string;
  title: string;
  brandName: string;
  description: string;
  progress: {
    current: string;
    total: string;
  };
  reward: string;
  endDate: string;
  endTime: string;
};

// Type for the API response data
type QuestApiData = {
  id: string;
  title: string;
  description: string;
  content: string;
  content_type: string;
  logo_url: string;
  max_reward_point: number;
  participant_limit: number;
  participants: any[];
  questQNA: {
    id: string;
    total_question: number;
    questions: any[];
  };
  quest_time: number;
  reattempt: number;
  schedule_time: string;
  space: {
    id: string;
    name: string | null;
    company_name: string | null;
    description: string | null;
  };
  status: string;
  template: string;
  view_status: string;
  approval_status: string;
  category: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  is_lock: boolean;
  end_date: string;
};

// Type for the component props
type QuestCardItem = {
  id: string;
  questName: string;
  currentPoints: string;
  totalPoints: string;
  reward: string;
  endDate: string;
  multiplier: string;
  image: ImageSourcePropType;
  brandName: string;
  categories: string[];
};

type SpaceCardItem = {
  id: string;
  title: string;
  quests: string;
  spaceIcon: ImageSourcePropType;
  categories: string[];
};

type StylesType = {
  container: ViewStyle;
  headerBackground: ViewStyle;
  header: ViewStyle;
  logo: ImageStyle;
  searchContainer: ViewStyle;
  searchIcon: TextStyle;
  searchInput: TextStyle;
  profileButton: ViewStyle;
  profileImage: ImageStyle;
  content: ViewStyle;
  contentContainer: ViewStyle;
  userProfileSection: ViewStyle;
  topSection: ViewStyle;
  nameHeader: TextStyle;
  userInfo: ViewStyle;
  userName: TextStyle;
  userpoint: TextStyle;
  userLevel: TextStyle;
  actionButtons: ViewStyle;
  actionButtonWrapper: ViewStyle;
  actionIconContainer: ViewStyle;
  actionIcon: ImageStyle;
  navButton: ViewStyle;
  navButtonText: TextStyle;
  statsContainer: ViewStyle;
  statItem: ViewStyle;
  statValue: TextStyle;
  statIcon: ImageStyle;
  sectionHeader: ViewStyle;
  sectionTitle: TextStyle;
  featuredContainer: ViewStyle;
  featuredEventCard: ViewStyle;
  cardRow: ViewStyle;
  card: ViewStyle;
  votercardContent: ViewStyle;
  textContainer: ViewStyle;
  cardTitle: TextStyle;
  rewardContainer: ViewStyle;
  topicsButtonContainer: ViewStyle;
  topicsText: TextStyle;
  topicsModalContent: ViewStyle;
  topicsModalHeader: ViewStyle;
  topicsModalTitle: TextStyle;
  topicsModalList: ViewStyle;
  courseSection: ViewStyle;
  courseSectionTitle: TextStyle;
  topicItem: ViewStyle;
  topicName: TextStyle;
  topicCount: TextStyle;
  topicProgressBar: ViewStyle;
  topicProgressFill: ViewStyle;
  topicProgressText: TextStyle;
  modalOverlayGradient: ViewStyle;
  modalOverlay: ViewStyle;
  [key: string]: ViewStyle | TextStyle | ImageStyle; // Add index signature for remaining styles
  loadingContainer: ViewStyle;
  errorContainer: ViewStyle;
  errorText: TextStyle;
  retryButton: ViewStyle;
  retryButtonText: TextStyle;
};

type TopicProgress = {
  understanding: number;
  moneyBanks: number;
  inflation: number;
  fiscal: number;
  global: number;
  financial: number;
  chartPatterns: number;
  support: number;
  position: number;
  stopLoss: number;
};

const TOTAL_BAR_WIDTH = 150;

export default function Events() {
  const router = useRouter();
  const [isDailyEventsVisible, setIsDailyEventsVisible] = useState(false);
  const [isLiveVoterVisible, setIsLiveVoterVisible] = useState(false);
  const [selectedVote, setSelectedVote] = useState<'up' | 'down' | null>(null);
  const [showDiscussion, setShowDiscussion] = useState(false);
  const [isRepliesExpanded, setIsRepliesExpanded] = useState(false);
  const [upVotePercentage, setUpVotePercentage] = useState(70);
  const [downVotePercentage, setDownVotePercentage] = useState(30);
  const [showTopics, setShowTopics] = useState(false);
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;

  const [topicProgress] = useState<TopicProgress>({
    understanding: 10,
    moneyBanks: 10,
    inflation: 10,
    fiscal: 10,
    global: 10,
    financial: 10,
    chartPatterns: 25,
    support: 15,
    position: 40,
    stopLoss: 20,
  });

  // Add state for questCards
  const [questCards, setQuestCards] = useState<QuestCardItem[]>([]);
  const [spaceCards, setSpaceCards] = useState<SpaceCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add fetch function for questCards
  const fetchQuestCards = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const response = await fetch('https://api.dev.tradeved.com/quest/all', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch quests');
      }

      const data = await response.json();

      // Map API data to match the QuestCardItem structure
      const mappedQuests: QuestCardItem[] = data.data.map((quest: any) => ({
        id: quest.id,
        questName: quest.title,
        currentPoints: quest.participants.length.toString(),
        totalPoints: quest.participant_limit.toString(),
        reward: quest.max_reward_point.toString(),
        endDate: quest.end_date || 'No end date',
        image: { uri: quest.logo_url },
      }));

      setQuestCards(mappedQuests);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchSpaceCards = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const response = await fetch('https://api.dev.tradeved.com/space/all', {
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
      console.log(data);

      // Map API data to match the SpaceCardItem structure
      const mappedSpaces: SpaceCardItem[] = data.data.map((space: any) => ({
        id: space.id,
        title: space.name || 'Unnamed Space',
        quests: `${space.quests?.length || 0} Quests`,
        spaceIcon: space.logo_url ? { uri: space.logo_url } : require('../../assets/images/lazada.png'),
        categories: space.category || ['General'],
      }));

      setSpaceCards(mappedSpaces);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Add useEffect to fetch questCards
  useEffect(() => {
    fetchQuestCards();
    fetchSpaceCards();
  }, []);

  const eventItems: EventItem[] = [
    {
      id: '1',
      title: 'Featured Quests',
      image: require('../../assets/images/feature1.jpg'),
      brandName: 'Brand Name',
      points: '100',
      multiplier: '2X',
      isLive: true,
    },
    {
      id: '3',
      title: 'Featured Quests',
      image: require('../../assets/images/feature1.jpg'),
      brandName: 'Brand Name',
      points: '150',
      multiplier: '3X',
      isLive: true,
    },
  ];

  const questItems: QuestItem[] = [
    {
      id: '2',
      title: 'Featured Quests',
      brandName: 'Brand Name',
      description: 'Lorem ipsum dolor sit amet consectetur. In lorem diam ut sit et sed velit tincidunt.',
      progress: {
        current: '25k',
        total: '50k'
      },
      reward: '100',
      endDate: '23 July, 2024',
      endTime: '15:30 IST'
    },
    {
      id: '4',
      title: 'Featured Quests',
      brandName: 'Brand Name',
      description: 'Lorem ipsum dolor sit amet consectetur. In lorem diam ut sit et sed velit tincidunt.',
      progress: {
        current: '30k',
        total: '60k'
      },
      reward: '150',
      endDate: '25 July, 2024',
      endTime: '16:30 IST'
    },
  ];

  // Combine and sort items to ensure alternating pattern
  const featuredItems = eventItems.reduce<(EventItem | QuestItem)[]>((acc, event, index) => {
    acc.push(event);
    if (questItems[index]) {
      acc.push(questItems[index]);
    }
    return acc;
  }, []);

  const toggleTopics = (show: boolean) => {
    const toValue = show ? 0 : Dimensions.get('window').width;
    setShowTopics(show);
    Animated.spring(slideAnim, {
      toValue,
      useNativeDriver: true,
      tension: 65,
      friction: 11
    }).start(() => {
      if (!show) setShowTopics(false);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        onProfilePress={() => {/* Handle profile press */}}
        onSearchPress={() => {/* Handle search press */}}
      />
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.userProfileSection}>
          <View style={styles.topSection}>
            <View>
              <Text style={styles.nameHeader}>Name</Text>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>@Username</Text>
                <Text style={styles.userpoint}>•</Text>
                <Text style={styles.userLevel}>Level 18</Text>
              </View>
            </View>
            <View style={styles.actionButtons}>
              <View style={styles.actionButtonWrapper}>
                <View style={styles.actionIconContainer}>
                  <Image
                    source={require('../../assets/images/duck.png')}
                    style={styles.actionIcon}
                    resizeMode="contain"
                  />
                </View>
                <View style={[styles.navButton, { backgroundColor: '#cd0070' }]}>
                  <Text style={styles.navButtonText}>Discuss</Text>
                </View>
              </View>
              <View style={styles.actionButtonWrapper}>
                <View style={styles.actionIconContainer}>
                  <Image
                    source={require('../../assets/images/shop.png')}
                    style={styles.actionIcon}
                    resizeMode="contain"
                  />
                </View>
                <View style={[styles.navButton, { backgroundColor: '#cd0070' }]}>
                  <Text style={styles.navButtonText}>Shop</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="heart-outline" size={16} color="#FF4081" marginRight={4} />
              <Text style={styles.statValue}>2</Text>
            </View>
            <View style={styles.statItem}>
              <Image
                source={require('../../assets/images/fire.png')}
                style={styles.statIcon}
                resizeMode="contain"
              />
              <Text style={styles.statValue}>2</Text>
            </View>
            <View style={styles.statItem}>
              <Image
                source={require('../../assets/images/hexagon.png')}
                style={styles.statIcon}
                resizeMode="contain"
              />
              <Text style={styles.statValue}>20,000pts</Text>
            </View>
            <View style={styles.statItem}>
              <Image
                source={require('../../assets/images/star.png')}
                style={styles.statIcon}
                resizeMode="contain"
              />
              <Text style={styles.statValue}>50</Text>
            </View>
            <TouchableOpacity
              style={styles.statItem}
              onPress={() => toggleTopics(true)}
            >
              <View style={styles.topicsButtonContainer}>
                <Text style={styles.topicsText}>Topics 15</Text>
                <Ionicons name="chevron-down" size={16} color="#000" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.featuredContainer}
        >
          {featuredItems.map((item) => (
            <View key={item.id} style={styles.featuredEventCard}>
              {'image' in item ? (
                <EventCard {...item} />
              ) : (
                <FeaturedQuestCard {...item} />
              )}
            </View>
          ))}
        </ScrollView>

        <View style={styles.cardRow}>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.votercardContent}
              onPress={() => setIsLiveVoterVisible(true)}
            >
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>Live Voter</Text>
                <View style={styles.rewardContainer}>
                  <Image
                    source={require('../../assets/images/hexagon.png')}
                    style={[styles.statIcon, { width: 10, height: 10, marginRight: 2 }]}
                    resizeMode="contain"
                  />
                  <Text style={styles.rewardLabel}>Reward</Text>
                </View>
                <Text style={styles.voterpointsText}>100 pts</Text>
              </View>
              <View style={styles.illustrationContainer}>
                <View style={styles.greenCircle} />
                <Image
                  source={require('../../assets/images/voter.png')}
                  style={styles.illustration}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <TouchableOpacity
              style={styles.dailycardContent}
              onPress={() => setIsDailyEventsVisible(true)}
            >
              <View style={styles.rowBetween}>
                <Text style={styles.cardTitle}>Daily Events</Text>
                <View style={styles.progressBarWrapper}>
                  <View style={styles.progressBar}>
                    <View style={styles.progressFill} />
                  </View>
                  <Text style={styles.progressLabel}>1/3</Text>
                </View>
              </View>
              <View style={styles.dailyEventsFooter}>
                <View style={styles.dailyRewardSection}>
                  <View style={styles.dailyRewardRow}>
                    <Image
                      source={require('../../assets/images/hexagon.png')}
                      style={[styles.statIcon, { width: 10, height: 10, marginRight: 2 }]}
                      resizeMode="contain"
                    />
                    <Text style={styles.dailyRewardLabel}>Reward</Text>
                  </View>
                  <Text style={styles.dailyPointsText}>500 pts</Text>
                </View>
                <View style={styles.dailyTimeSection}>
                  <View style={styles.dailyRewardRow}>
                    <Image
                      source={require('../../assets/images/clock.png')}
                      style={[styles.statIcon, { width: 10, height: 10, marginRight: 2 }]}
                      resizeMode="contain"
                    />
                    <Text style={styles.dailyRewardLabel}>Next event in</Text>
                  </View>
                  <Text style={styles.dailyCountdown}>18:34:22</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>New</Text>
          <TouchableOpacity
            style={styles.exploreContainer}
            onPress={() => router.push('/explorequest/[id]')}
          >
            <Text style={[styles.sectionTitle, styles.exploreTitle]}>Explore</Text>
            <View style={styles.arrowBox}>
              <Ionicons name="chevron-forward" size={14} color="#9BEC00" />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.questCardsContainer}>
          {/* <Text style={styles.sectionTitle}>Quest Cards</Text> */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#9BEC00" />
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchQuestCards}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {questCards.map((quest) => (
                <QuestCardItem key={quest.id} {...quest} />
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Spaces you might like</Text>
          <TouchableOpacity
            style={styles.viewAllContainer}
            onPress={() => router.push('/spaces')}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <View style={styles.arrowBox}>
              <Ionicons name="chevron-forward" size={14} color="#9BEC00" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.spaceCardsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            style={styles.questContainer}>
            {spaceCards.map((space) => (
              <SpaceCard key={space.id} {...space} />
            ))}
          </ScrollView>
        </View>

      </ScrollView>

      {showTopics && (
        <TouchableWithoutFeedback onPress={() => toggleTopics(false)}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
      )}

      <Animated.View
        style={[
          styles.topicsSidebar,
          {
            transform: [{ translateX: slideAnim }],
            zIndex: 1000
          }
        ]}
      >
        <View style={styles.topicsHeader}>
          <View style={styles.topicsHeaderContent}>
            <TouchableOpacity
              onPress={() => toggleTopics(false)}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.topicsTitle}>Topics</Text>
          </View>
        </View>
        <ScrollView style={styles.topicsList}>
          <View style={styles.courseSection}>
            <Text style={styles.courseSectionTitle}>1. Pre-Trading Economics Crash Course</Text>
            <View style={styles.topicsList}>
              <View style={styles.topicCard}>
                <View style={styles.topicContent}>
                  <Text style={styles.topicName}>Understanding the Economy</Text>
                  <Text style={styles.topicCount}>Total topics: 5</Text>
                </View>
                <ProgressCircle progress={topicProgress.understanding} />
              </View>

              <View style={styles.topicCard}>
                <View style={styles.topicContent}>
                  <Text style={styles.topicName}>Money & Central Banks</Text>
                  <Text style={styles.topicCount}>Total topics: 5</Text>
                </View>
                <ProgressCircle progress={topicProgress.moneyBanks} />
              </View>

              <View style={styles.topicCard}>
                <View style={styles.topicContent}>
                  <Text style={styles.topicName}>Inflation & Deflation</Text>
                  <Text style={styles.topicCount}>Total topics: 5</Text>
                </View>
                <ProgressCircle progress={topicProgress.inflation} />
              </View>

              <View style={styles.topicCard}>
                <View style={styles.topicContent}>
                  <Text style={styles.topicName}>Fiscal & Monetary Policy</Text>
                  <Text style={styles.topicCount}>Total topics: 5</Text>
                </View>
                <ProgressCircle progress={topicProgress.fiscal} />
              </View>

              <View style={styles.topicCard}>
                <View style={styles.topicContent}>
                  <Text style={styles.topicName}>Global Economics & Trade</Text>
                  <Text style={styles.topicCount}>Total topics: 5</Text>
                </View>
                <ProgressCircle progress={topicProgress.global} />
              </View>

              <View style={styles.topicCard}>
                <View style={styles.topicContent}>
                  <Text style={styles.topicName}>Financial Markets Overview</Text>
                  <Text style={styles.topicCount}>Total topics: 5</Text>
                </View>
                <ProgressCircle progress={topicProgress.financial} />
              </View>
            </View>
          </View>

          <View style={styles.courseSection}>
            <Text style={styles.courseSectionTitle}>2. Technical Analysis Fundamentals</Text>
            <View style={styles.topicsList}>
              <View style={styles.topicCard}>
                <View style={styles.topicContent}>
                  <Text style={styles.topicName}>Chart Patterns & Indicators</Text>
                  <Text style={styles.topicCount}>Total topics: 8</Text>
                </View>
                <ProgressCircle progress={topicProgress.chartPatterns} />
              </View>

              <View style={styles.topicCard}>
                <View style={styles.topicContent}>
                  <Text style={styles.topicName}>Support & Resistance</Text>
                  <Text style={styles.topicCount}>Total topics: 6</Text>
                </View>
                <ProgressCircle progress={topicProgress.support} />
              </View>
            </View>
          </View>

          <View style={styles.courseSection}>
            <Text style={styles.courseSectionTitle}>3. Risk Management Essentials</Text>
            <View style={styles.topicsList}>
              <View style={styles.topicCard}>
                <View style={styles.topicContent}>
                  <Text style={styles.topicName}>Position Sizing</Text>
                  <Text style={styles.topicCount}>Total topics: 4</Text>
                </View>
                <ProgressCircle progress={topicProgress.position} />
              </View>

              <View style={styles.topicCard}>
                <View style={styles.topicContent}>
                  <Text style={styles.topicName}>Stop Loss Strategies</Text>
                  <Text style={styles.topicCount}>Total topics: 5</Text>
                </View>
                <ProgressCircle progress={topicProgress.stopLoss} />
              </View>
            </View>
          </View>
        </ScrollView>
      </Animated.View>

      <Modal
        visible={isDailyEventsVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDailyEventsVisible(false)}
      >
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.9)', 'rgba(0, 0, 0, 0.9)']}
          style={styles.modalOverlayGradient}
        >
          <BlurView intensity={40} style={styles.modalOverlaydaily} tint="default">
            <View style={styles.modalContentdaily}>
              <View style={styles.modalHeaderdaily}>
                <View style={styles.modalTitleContainerdaily}>
                  <Ionicons name="flash" size={20} color="#9BEC00" />
                  <Text style={styles.modalTitle}>Daily Events</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setIsDailyEventsVisible(false)}
                  style={styles.modalCloseButtondaily}
                >
                  <View style={styles.whiteCircledaily}>
                    <Ionicons name="close" size={16} color="#242620" />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.taskContainerdaily}>
                <View style={styles.titleContainerdaily}>
                  <Text style={styles.taskTitle}>Login</Text>
                  <View style={styles.taskPointsdaily}>
                    <Image
                      source={require('../../assets/images/hexagon.png')}
                      style={[styles.statIcon, { width: 12, height: 12 }]}
                      resizeMode="contain"
                    />
                    <Text style={styles.pointsText}>500 pts</Text>
                  </View>
                </View>
                <View style={styles.taskRowdaily}>
                  <View style={styles.progressContainerdaily}>
                    <View style={styles.taskProgressBardaily}>
                      <View style={[styles.taskProgressFill, { width: '100%' }]} />
                      <View style={styles.progressTextContainer}>
                        <Text style={styles.taskProgressText}>1/1</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.claimButtondaily}>
                    <Text style={styles.claimButtonText}>Claim</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.taskContainerdaily}>
                <View style={styles.titleContainerdaily}>
                  <Text style={styles.taskTitledaily}>Complete 3 levels today</Text>
                  <View style={styles.taskPointsdaily}>
                    <Image
                      source={require('../../assets/images/hexagon.png')}
                      style={[styles.statIcon, { width: 12, height: 12 }]}
                      resizeMode="contain"
                    />
                    <Text style={styles.pointsText}>500 pts</Text>
                  </View>
                </View>
                <View style={styles.taskRowdaily}>
                  <View style={styles.progressContainerdaily}>
                    <View style={styles.taskProgressBardaily}>
                      <View style={[styles.taskProgressFill, { width: '66%' }]} />
                      <View style={styles.progressTextContainer}>
                        <Text style={styles.taskProgressText}>2/3</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.goNowButtondaily}>
                    <Text style={styles.goNowButtonText}>Go Now</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.taskContainerdaily}>
                <View style={styles.titleContainerdaily}>
                  <Text style={styles.taskTitledaily}>Vote in Live Voter</Text>
                  <View style={styles.taskPointsdaily}>
                    <Image
                      source={require('../../assets/images/hexagon.png')}
                      style={[styles.statIcon, { width: 12, height: 12 }]}
                      resizeMode="contain"
                    />
                    <Text style={styles.pointsText}>500 pts</Text>
                  </View>
                </View>
                <View style={styles.taskRowdaily}>
                  <View style={styles.progressContainerdaily}>
                    <View style={styles.taskProgressBardaily}>
                      <View style={[styles.taskProgressFill, { width: '0%' }]} />
                      <View style={styles.progressTextContainer}>
                        <Text style={styles.taskProgressText}>0/1</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.goNowButtondaily}>
                    <Text style={styles.goNowButtonText}>Go Now</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.updateContainerdaily}>
                <Image
                  source={require('../../assets/images/clock.png')}
                  style={[styles.statIcon, { width: 12, height: 12 }]}
                  resizeMode="contain"
                />
                <Text style={styles.updateTextdaily}>Daily Events will update after 18:34:22</Text>
              </View>
            </View>
          </BlurView>
        </LinearGradient>
      </Modal>

      <Modal
        visible={isLiveVoterVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setIsLiveVoterVisible(false);
        }}
      >
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.9)', 'rgba(0, 0, 0, 0.9)']}
          style={styles.modalOverlayGradient}
        >
          <BlurView intensity={40} style={styles.modalOverlay} tint="default">
            <View style={[styles.modalContent, { backgroundColor: '#FFFFFF' }]}>
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleContainer}>
                  <Text style={[styles.modalTitle, { color: '#242620' }]}>Live Voter</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setIsLiveVoterVisible(false);
                  }}
                  style={styles.modalCloseButton}
                >
                  <View style={[styles.whiteCircle, { backgroundColor: '#242620' }]}>
                    <Ionicons name="close" size={16} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.voterScrollView}
                contentContainerStyle={styles.voterScrollContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.newsContainer}>
                  <View style={styles.newsItem}>
                    <View style={styles.newsSourceRow}>
                      <Text style={styles.sourceText}>Source : The Economist</Text>
                      <Text style={styles.newsDate}>24/7/2024</Text>
                      <View style={styles.todayPill}>
                        <Text style={styles.todayText}>Today</Text>
                      </View>
                    </View>

                    <View style={styles.newsContentRow}>
                      <Image
                        source={require('../../assets/images/news.png')}
                        style={styles.newsImage}
                        resizeMode="contain"
                      />
                      <View style={styles.newsTextContent}>
                        <Text style={styles.newsTitle}>News 1</Text>
                        <Text style={styles.newsDescription}>
                          Lorem ipsum dolor sit amet consectetur. Fermentum ac ultrices scelerisque commodo. Ut sem non amet ut urna. Justo at mauris neque aenean id. Tristique viverra egestas volutpat consectetur mollis.
                        </Text>
                        <TouchableOpacity>
                          <Text style={styles.readMoreText}>READ MORE...</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  <View style={styles.newsItem}>
                    <View style={styles.newsSourceRow}>
                      <Text style={styles.sourceText}>Source : The Economist</Text>
                      <Text style={styles.newsDate}>24/7/2024</Text>
                      <View style={styles.todayPill}>
                        <Text style={styles.todayText}>Today</Text>
                      </View>
                    </View>

                    <View style={styles.newsContentRow}>
                      <Image
                        source={require('../../assets/images/news.png')}
                        style={styles.newsImage}
                        resizeMode="contain"
                      />
                      <View style={styles.newsTextContent}>
                        <Text style={styles.newsTitle}>News 1</Text>
                        <Text style={styles.newsDescription}>
                          Lorem ipsum dolor sit amet consectetur. Fermentum ac ultrices scelerisque commodo. Ut sem non amet ut urna. Justo at mauris neque aenean id. Tristique viverra egestas volutpat consectetur mollis.
                        </Text>
                        <TouchableOpacity>
                          <Text style={styles.readMoreText}>READ MORE...</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.voteSection}>
                  <Text style={styles.voteQuestion}>
                    According to the news, what do you predict will market go up or down ?
                  </Text>
                  {!selectedVote ? (
                    <View style={styles.voteOptionsContainer}>
                      <View style={styles.voteOption}>
                        <TouchableOpacity
                          style={styles.voteBox}
                          onPress={() => {
                            setSelectedVote('up');
                            setShowDiscussion(true);
                          }}
                        />
                        <Text style={styles.voteText}>UP</Text>
                      </View>
                      <View style={styles.voteOption}>
                        <TouchableOpacity
                          style={styles.voteBox}
                          onPress={() => {
                            setSelectedVote('down');
                            setShowDiscussion(true);
                          }}
                        />
                        <Text style={styles.voteText}>DOWN</Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.resultsContainer}>
                      <View style={styles.votingResults}>
                        <View style={styles.voteRow}>
                          <View style={[styles.percentageBar, {
                            width: (upVotePercentage / 100) * TOTAL_BAR_WIDTH,
                            backgroundColor: '#9BEC00',
                            marginRight: 4
                          }]} />
                          <Text style={styles.percentageText}>{upVotePercentage}%</Text>
                          <Text style={[styles.resultText, { marginRight: 24 }]}>UP</Text>
                          <View style={[styles.percentageBar, {
                            width: (downVotePercentage / 100) * TOTAL_BAR_WIDTH,
                            backgroundColor: '#cd0070',
                            marginRight: 4
                          }]} />
                          <Text style={styles.percentageText}>{downVotePercentage}%</Text>
                          <Text style={styles.resultText}>Down</Text>
                        </View>
                      </View>
                      <Text style={styles.resultDescription}>
                        {upVotePercentage}% people also chose UP and agree with your assessment. You can see discussion why people agree or disagree with your assessment.
                      </Text>
                    </View>
                  )}

                  {selectedVote && showDiscussion && (
                    <View style={styles.discussionSection}>
                      <View style={styles.discussionHeader}>
                        <Text style={styles.discussionTitle}>Discussion</Text>
                        <TouchableOpacity>
                          <Text style={styles.seeFullText}>See full discussion</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.commentsList}>
                        <View style={styles.commentItem}>
                          <Image
                            source={require('../../assets/images/profile.png')}
                            style={styles.commentAvatar}
                          />
                          <View style={styles.commentContent}>
                            <View style={styles.commentHeader}>
                              <Text style={styles.commentUsername}>@username •</Text>
                              <Text style={styles.commentTime}>10 mins ago</Text>
                            </View>
                            <Text style={styles.commentText}>
                              Lorem ipsum dolor sit amet consectetur. Fermentum ac ultrices scelerisque commodo. Ut sem non amet ut urna. Justo at mauris neque aenean id.
                            </Text>
                            <View style={styles.commentActions}>
                              <Text style={styles.helpfulText}>Was this comment helpful or not?</Text>
                              <TouchableOpacity style={styles.feedbackButton}>
                                <Text style={styles.feedbackButtonText}>Yes</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.feedbackButton}>
                                <Text style={styles.feedbackButtonText}>No</Text>
                              </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                              style={styles.expandButton}
                              onPress={() => setIsRepliesExpanded(!isRepliesExpanded)}
                            >
                              <View style={styles.expandButtonContent}>
                                <Ionicons
                                  name={isRepliesExpanded ? "chevron-up" : "chevron-down"}
                                  size={16}
                                  color="#2f8eff"
                                />
                                <Text style={styles.expandButtonText}>
                                  {isRepliesExpanded ? "Hide replies" : "Show replies"}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>

                        {isRepliesExpanded && (
                          <View style={styles.replySection}>
                            <View style={styles.replyConnector} />
                            <View style={[styles.commentItem, styles.replyComment]}>
                              <Image
                                source={require('../../assets/images/profile.png')}
                                style={styles.commentAvatar}
                              />
                              <View style={styles.commentContent}>
                                <View style={styles.commentHeader}>
                                  <Text style={styles.commentUsername}>@username •</Text>
                                  <Text style={styles.commentTime}>8 mins ago</Text>
                                </View>
                                <Text style={styles.commentText}>
                                  Lorem ipsum dolor sit amet consectetur. Fermentum ac ultrices scelerisque commodo.
                                </Text>
                                <View style={styles.commentActions}>
                                  <Text style={styles.helpfulText}>Was this comment helpful or not?</Text>
                                  <TouchableOpacity style={styles.feedbackButton}>
                                    <Text style={styles.feedbackButtonText}>Yes</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity style={styles.feedbackButton}>
                                    <Text style={styles.feedbackButtonText}>No</Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                          </View>
                        )}
                      </View>
                      <View style={styles.addCommentSection}>
                        <View style={styles.commentInputContainer}>
                          <TextInput
                            style={styles.commentInput}
                            placeholder="Add a comment..."
                            placeholderTextColor="#242621"
                            multiline
                          />
                          <View style={styles.commentButtons}>
                            <TouchableOpacity style={styles.cancelButton}>
                              <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.commentButton}>
                              <Text style={styles.commentButtonText}>Comment</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              </ScrollView>
            </View>
          </BlurView>
        </LinearGradient>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242620',
  },
  // headerBackground: {
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   height: 100,
  //   backgroundColor: '#242620',
  //   zIndex: 99,
  // },
  // header: {
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   paddingHorizontal: 16,
  //   paddingVertical: 12,
  //   backgroundColor: '#242620',
  //   zIndex: 100,
  //   height: 100,
  //   paddingTop: 40,
  // },
  // logo: {
  //   width: 37,
  //   height: 37,
  //   marginRight: 10,
  // },
  // searchContainer: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   backgroundColor: '#1A1A1A',
  //   borderRadius: 12,
  //   paddingHorizontal: 12,
  //   marginRight: 12,
  // },
  // searchIcon: {
  //   position: 'absolute',
  //   left: 12,
  // },
  // searchInput: {
  //   flex: 1,
  //   height: 40,
  //   color: '#FFF',
  //   fontSize: 16,
  //   paddingHorizontal: 25,
  // },
  // profileButton: {
  //   width: 40,
  //   height: 40,
  //   borderRadius: 20,
  //   backgroundColor: '#1A1A1A',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   overflow: 'hidden',
  // },
  // profileImage: {
  //   width: '100%',
  //   height: '100%',
  //   borderRadius: 20,
  // },
  content: {
    flex: 1,
    paddingHorizontal: 6,
  },
  contentContainer: {
    paddingTop: 90,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  exploreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  exploreTitle: {
    color: '#9BEC00',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 'auto',
  },
  featuredContainer: {
    marginLeft: 0,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 12,
    overflow: 'visible',
  },
  featuredEventCard: {
    width: 250,
    marginRight: 16,
    overflow: 'visible',
  },
  upcomingSection: {
    marginTop: 24,
  },
  userProfileSection: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#242620',
    marginTop: 0,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  nameHeader: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '400',
  },
  userpoint: {
    color: '#fff',
    fontSize: 10,
    marginLeft: 4,
  },
  userLevel: {
    color: '#a2ab9a',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 32,
    height: 32,
    backgroundColor: '#FFF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -23,
    zIndex: 1,
  },
  actionIcon: {
    width: 20,
    height: 20,
  },
  navButton: {
    paddingVertical: 6,
    paddingLeft: 28,
    paddingRight: 16,
    borderRadius: 20,
  },
  navButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    color: '#FFF',
    fontSize: 14,
  },
  statIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  heartIconContainer: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIcon: {
    shadowColor: '#FF4081',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  heartOutline: {
    opacity: 0.3,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginTop: 20,
  },
  card: {
    backgroundColor: '#2c2e27',
    borderRadius: 12,
    padding: 12,
    width: '48%',
    height: 110,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  dailycardContent: {
    flex: 1,
    height: '100%',
  },
  votercardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textContainer: {
    justifyContent: 'flex-start',
    gap: 19,
    left: 5,
    top: 7,
  },
  cardTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    left: 0,
  },
  rewardLabel: {
    color: '#ccc',
    fontSize: 12,
  },
  pointsText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: -4,
  },
  voterpointsText: {
    color: '#fff',
    fontSize: 12,
    // marginLeft: -4,
    fontWeight: '600',
    marginTop: -20,
  },
  illustrationContainer: {
    width: 90,
    height: 90,
    position: 'relative',
  },
  greenCircle: {
    backgroundColor: '#9BEC00',
    width: 66,
    height: 66,
    borderRadius: 35,
    position: 'absolute',
    zIndex: 0,
    left: 12,
    bottom: 20,
  },
  illustration: {
    width: 72,
    height: 72,
    resizeMode: 'contain',
    zIndex: 1,
    position: 'absolute',
    left: 25,
    top: 13,
  },
  dailyEventsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 4,
  },
  dailyRewardSection: {
    gap: 2,
  },
  dailyTimeSection: {
    alignItems: 'flex-end',
    gap: 2,
    flex: 1,
    marginLeft: -30,
  },
  dailyRewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dailyRewardLabel: {
    color: '#ccc',
    fontSize: 11,
  },
  dailyPointsText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    marginTop: 2,
  },
  dailyCountdown: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    marginTop: 2,
  },
  progressBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    width: 40,
    height: 6,
    backgroundColor: '#444',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 4,
  },
  progressFill: {
    width: '33%',
    height: '100%',
    backgroundColor: '#9BEC00',
  },
  progressLabel: {
    color: '#fff',
    fontSize: 10,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questCardsContainer: {
    paddingTop: 12,
    paddingBottom: 8,
    marginTop: -12,
    overflow: 'visible',
  },
  questContainer: {
    overflow: 'visible',
  },
  questContentContainer: {
    paddingLeft: 16,
    paddingRight: 16,
    overflow: 'visible',
    paddingTop: 10,
  },
  arrowBox: {
    width: 18,
    height: 18,
    // backgroundColor: '#2C2E27',
    borderRadius: 6,
    borderColor: '#9BEC00',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  viewAllText: {
    color: '#9BEC00',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 'auto',
  },
  spaceCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  modalOverlayGradient: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  modalOverlaydaily: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContentdaily: {
    backgroundColor: '#242620',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalHeaderdaily: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  modalTitleContainerdaily: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitledaily: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalCloseButtondaily: {
    padding: 4,
  },
  whiteCircledaily: {
    backgroundColor: '#fff',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskContainerdaily: {
    marginBottom: 20,
  },
  titleContainerdaily: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 85,
    marginBottom: 2,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskTitledaily: {
    color: '#a2ab9a',
    fontSize: 12,
    marginBottom: -4,
  },
  taskPointsdaily: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: -4,
    marginRight: 18,
  },
  taskRowdaily: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressContainerdaily: {
    flex: 1,
  },
  taskProgressBardaily: {
    height: 20,
    backgroundColor: '#f7faf5',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    borderColor: '#f7faf5',
    borderWidth: 2,
  },
  taskProgressFilldaily: {
    height: '100%',
    backgroundColor: '#9BEC00',
    position: 'absolute',
    left: 0,
    right: 0,
  },
  progressTextContainerdaily: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskProgressTextdaily: {
    color: '#242620',
    fontSize: 12,
    textAlign: 'center',
  },
  claimButtondaily: {
    width: 71,
    height: 33,
    backgroundColor: '#9BEC00',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 14,
  },
  claimButtonTextdaily: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
  },
  goNowButtondaily: {
    // backgroundColor: '#2C2E27',
    width: 71,
    height: 33,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center',
    borderColor: '#d3dec8',
    borderWidth: 1,
    justifyContent: 'center',
    marginLeft: 14,
  },
  goNowButtonTextdaily: {
    color: '#d3dec8',
    fontSize: 12,
    fontWeight: '700',
  },
  updateContainerdaily: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 5,
    marginBottom: 16,
    justifyContent: 'center',
  },
  updateTextdaily: {
    marginLeft: -6,
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    height: '90%',
    maxWidth: 600,
    paddingVertical: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalCloseButton: {
    padding: 4,
  },
  whiteCircle: {
    backgroundColor: '#fff',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskContainer: {
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 85,
    marginBottom: 2,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskTitle: {
    color: '#a2ab9a',
    fontSize: 12,
    marginBottom: -4,
  },
  taskPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: -4,
    marginRight: 18,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressContainer: {
    flex: 1,
  },
  taskProgressBar: {
    height: 20,
    backgroundColor: '#f7faf5',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    borderColor: '#f7faf5',
    borderWidth: 2,
  },
  taskProgressFill: {
    height: '100%',
    backgroundColor: '#9BEC00',
    position: 'absolute',
    left: 0,
    right: 0,
  },
  progressTextContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskProgressText: {
    color: '#242620',
    fontSize: 12,
    textAlign: 'center',
  },
  claimButton: {
    width: 71,
    height: 33,
    backgroundColor: '#9BEC00',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 14,
  },
  claimButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
  },
  goNowButton: {
    // backgroundColor: '#2C2E27',
    width: 71,
    height: 33,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center',
    borderColor: '#d3dec8',
    borderWidth: 1,
    justifyContent: 'center',
    marginLeft: 14,
  },
  goNowButtonText: {
    color: '#d3dec8',
    fontSize: 12,
    fontWeight: '700',
  },
  updateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 5,
    marginBottom: 16,
    justifyContent: 'center',
  },
  updateText: {
    marginLeft: -6,
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  newsContainer: {
    marginBottom: 20,
  },
  newsItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  newsSourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginLeft: 45,
  },
  sourceText: {
    color: '#242620',
    fontSize: 11,
    marginRight: 24,
  },
  newsDate: {
    color: '#242620',
    fontSize: 11,
    marginRight: 8,
  },
  todayPill: {
    backgroundColor: '#242620',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
  },
  todayText: {
    color: '#9BEC00',
    fontSize: 10,
    fontWeight: '600',
  },
  newsContentRow: {
    flexDirection: 'row',
    gap: 12,
  },
  newsImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  newsTextContent: {
    flex: 1,
  },
  newsTitle: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  newsDescription: {
    color: '#000',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 4,
    fontWeight: '400',
  },
  readMoreText: {
    color: '#242620',
    fontSize: 12,
    fontWeight: '600',
  },
  voteSection: {
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  voteQuestion: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
  },
  voteOptionsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  voteOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  voteBox: {
    width: 30,
    height: 21,
    backgroundColor: '#d9d9d9',
    marginRight: 8,
  },
  selectedVoteBox: {
    backgroundColor: '#242620',
  },
  voteText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  discussionSection: {
    marginTop: 0,
  },
  discussionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  discussionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  seeFullText: {
    fontSize: 14,
    color: '#2f8eff',
    fontWeight: '700',
  },
  commentsList: {
    marginBottom: 16,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  replyComment: {
    marginLeft: 50,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    marginTop: -4,
  },
  commentUsername: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },
  commentTime: {
    fontSize: 11,
    color: '#000',
    marginLeft: 4,
    fontWeight: '400',
  },
  commentText: {
    fontSize: 12,
    color: '#000',
    lineHeight: 14,
    marginBottom: 2,
    marginRight: -30,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpfulText: {
    fontSize: 10.5,
    color: '#2f8eff',
    marginRight: 8,
  },
  feedbackButton: {
    marginHorizontal: 4,
  },
  feedbackButtonText: {
    fontSize: 12,
    color: '#2f8eff',
    fontWeight: '500',
  },
  addCommentSection: {
    marginTop: -20,
    paddingTop: 10,
    marginHorizontal: -16,
  },
  commentInputContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    padding: 12,
    // width: 318,
  },
  commentInput: {
    fontSize: 12,
    color: '#000',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  commentButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  cancelButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  commentButton: {
    backgroundColor: '#2f8eff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  commentButtonText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '500',
  },
  resultsContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  votingResults: {
    marginBottom: 16,
  },
  voteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  percentageBar: {
    height: 24,
  },
  percentageText: {
    fontSize: 12,
    color: '#000',
    marginRight: 4,
  },
  resultText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  resultDescription: {
    fontSize: 11,
    color: '#000',
    marginTop: -2,
    lineHeight: 16,
    fontWeight: '400',
  },
  voterScrollView: {
    flex: 1,
  },
  voterScrollContent: {
    paddingHorizontal: 20,
  },
  replySection: {
    position: 'relative',
  },
  replyConnector: {
    position: 'absolute',
    left: 20,
    top: -12,
    width: 2,
    height: 62,
    backgroundColor: '#E5E5E5',
  },
  expandButton: {
    marginTop: 4,
    marginBottom: 8,
  },
  expandButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandButtonText: {
    fontSize: 12,
    color: '#2f8eff',
    fontWeight: '500',
    marginLeft: 4,
  },
  topicsButtonContainer: {
    backgroundColor: '#9BEC00',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  topicsText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
  },
  topicsSidebar: {
    position: 'absolute',
    top: 200,
    right: 0,
    width: 300,
    height: '75%',
    maxHeight: 600,
    borderRadius: 8,
    backgroundColor: '#242620',
    shadowColor: '#000',
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 999,
  },
  topicsHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  topicsHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  topicsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  courseSection: {
    padding: 16,
  },
  courseSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    paddingHorizontal: 0,
  },
  topicsList: {
    paddingHorizontal: 4,
  },
  topicCard: {
    backgroundColor: '#E8FFC2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topicContent: {
    flex: 1,
    marginRight: 12,
  },
  topicName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#242620',
    marginBottom: 4,
  },
  topicCount: {
    fontSize: 12,
    color: '#666666',
  },
  progressCircleContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressCircleOuter: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8FFC2',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressCircleInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8FFC2',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#242620',
    textAlign: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 998,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#9BEC00',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#242620',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const ProgressCircle = ({ progress }: { progress: number }) => {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (progress / 100) * circumference;

  return (
    <View style={styles.progressCircleContainer}>
      <View style={styles.progressCircleOuter}>
        <Svg width={48} height={48}>
          <Circle
            cx={24}
            cy={24}
            r={radius}
            stroke="#83c602"
            strokeWidth={4}
            fill="#fff"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={progressOffset}
            transform="rotate(-90 24 24)"
          />
        </Svg>
      </View>
      <View style={styles.progressCircleInner}>
        <Text style={styles.progressText}>{progress}%</Text>
      </View>
    </View>
  );
}; 
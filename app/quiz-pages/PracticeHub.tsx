import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import QuizNavBar from "../../components/QuizNavBar";

// Type definitions
interface PracticeTopic {
  id: number;
  title: string;
  description: string;
  questions: number;
  difficulty: string;
  estimatedTime: string;
  tags: string[];
  icon: string;
  color: { bg: string; border: string };
  completed: boolean;
  bestScore: number;
  attempts: number;
}

interface PracticeMode {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface Filters {
  difficulty: string[];
  topics: string[];
  duration: number[];
}

interface PracticeTopicCardProps {
  topic: PracticeTopic;
  onStart: (topicId: number, mode: string) => void;
}

// Mock Data from original component
const practiceTopicsData: PracticeTopic[] = [
  {
    id: 1,
    title: "Options Basics",
    description: "Learn fundamental options concepts",
    questions: 25,
    difficulty: "Beginner",
    estimatedTime: "15-20 min",
    tags: ["Options", "Beginner"],
    icon: "📊",
    color: { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.2)' },
    completed: false, bestScore: 0, attempts: 0,
  },
  {
    id: 2,
    title: "Technical Analysis",
    description: "Chart patterns and indicators",
    questions: 30,
    difficulty: "Intermediate",
    estimatedTime: "20-25 min",
    tags: ["Charts", "Technical"],
    icon: "📈",
    color: { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.2)' },
    completed: true, bestScore: 87, attempts: 3,
  },
  {
    id: 3,
    title: "Risk Management",
    description: "Portfolio protection strategies",
    questions: 20,
    difficulty: "Advanced",
    estimatedTime: "15-18 min",
    tags: ["Risk", "Strategy"],
    icon: "🛡️",
    color: { bg: 'rgba(168, 85, 247, 0.1)', border: 'rgba(168, 85, 247, 0.2)' },
    completed: false, bestScore: 0, attempts: 0,
  },
  {
    id: 4,
    title: "Market Orders",
    description: "Order types and execution",
    questions: 15,
    difficulty: "Beginner",
    estimatedTime: "10-12 min",
    tags: ["Orders", "Basics"],
    icon: "⚡️",
    color: { bg: 'rgba(234, 179, 8, 0.1)', border: 'rgba(234, 179, 8, 0.2)' },
    completed: true, bestScore: 92, attempts: 2,
  },
];

const practiceModesData: PracticeMode[] = [
  { id: "untimed", title: "Untimed Practice", description: "Learn at your own pace", icon: 'brain', color: '#A3E635' },
  { id: "timed", title: "Timed Challenge", description: "Practice with time pressure", icon: 'zap', color: '#38BDF8' },
  { id: "adaptive", title: "Adaptive Learning", description: "AI adjusts difficulty", icon: 'target', color: '#FACC15' },
];

const difficultyLevels = ["Beginner", "Intermediate", "Advanced"];
const topicFilters = ["Options", "Technical", "Risk", "Orders"];


const PracticeTopicCard: React.FC<PracticeTopicCardProps> = ({ topic, onStart }) => {
  const [expanded, setExpanded] = useState(false);
  const difficultyColor = topic.difficulty === "Beginner" ? '#22c55e' : topic.difficulty === 'Intermediate' ? '#3b82f6' : '#a855f7';

  return (
    <View style={[styles.topicCard, { backgroundColor: topic.color.bg, borderColor: topic.color.border }]}>
      <View style={styles.topicCardContent}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
          <Text style={{ fontSize: 24, marginRight: 12 }}>{topic.icon}</Text>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <Text style={styles.topicTitle}>{topic.title}</Text>
              {topic.completed && <View style={styles.completedBadge}><Text style={styles.completedBadgeText}>Completed</Text></View>}
            </View>
            <Text style={styles.topicDescription}>{topic.description}</Text>

            <View style={styles.topicMetaContainer}>
              <View style={styles.topicMetaItem}>
                <Icon name="book-open" size={12} />
                <Text style={styles.topicMetaText}> {topic.questions} questions</Text>
              </View>
              <View style={styles.topicMetaItem}>
                <Icon name="clock" size={12} />
                <Text style={styles.topicMetaText}> {topic.estimatedTime}</Text>
              </View>
            </View>

            <View style={styles.topicTagsContainer}>
              <View style={[styles.tagBadge, { borderColor: difficultyColor }]}><Text style={{ color: difficultyColor, fontSize: 12 }}>{topic.difficulty}</Text></View>
              {topic.tags.map((tag: string, index: number) => <View key={index} style={styles.tagBadge}><Text style={styles.tagBadgeText}>{tag}</Text></View>)}
            </View>
          </View>
        </View>

        <View style={styles.topicActions}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={[styles.button, styles.startPracticeButton]} onPress={() => onStart(topic.id, 'untimed')}>
              <Icon name="play" size={12} color="#000" style={{ marginRight: 8 }} />
              <Text style={styles.startPracticeButtonText}>Start Practice</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.timedButton]} onPress={() => onStart(topic.id, 'timed')}>
              <Icon name="zap" size={12} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.timedButtonText}>Timed</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.chevronButton}>
            <Icon name="chevron-down" size={20} color="#9CA3AF" style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }} />
          </TouchableOpacity>
        </View>
      </View>

      {expanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.expandedTitle}>What you'll learn:</Text>
          <Text style={styles.expandedText}>• Core concepts and terminology</Text>
          <Text style={styles.expandedText}>• Practical applications</Text>
          <Text style={styles.expandedText}>• Common mistakes to avoid</Text>

          <Text style={[styles.expandedTitle, { marginTop: 12 }]}>Your Progress</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={styles.progressBox}>
              <Text style={styles.progressLabel}>Best Score</Text>
              <Text style={styles.progressValue}>{topic.bestScore}%</Text>
            </View>
            <View style={styles.progressBox}>
              <Text style={styles.progressLabel}>Attempts</Text>
              <Text style={styles.progressValue}>{topic.attempts}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};


export default function PracticeHub() {
  const navigation = useNavigation<any>();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [topicsY, setTopicsY] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Add new state for setup modal
  const [setupModalVisible, setSetupModalVisible] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [setupConfig, setSetupConfig] = useState({
    numQuestions: 10,
    difficulty: "EASY",
    selectedTopics: [] as string[],
  });

  const [filters, setFilters] = useState<Filters>({
    difficulty: ["Beginner", "Intermediate", "Advanced"],
    topics: ["Options", "Technical", "Risk", "Orders", "Basics", "Strategy", "Charts"], // Added all tags to show all by default
    duration: [5, 60],
  });

  const toggleFilter = (category: keyof Filters, value: string | number) => {
    setFilters(prev => {
      const currentValues = prev[category];
      const newValues = currentValues.includes(value as never)
        ? currentValues.filter((item: any) => item !== value)
        : [...currentValues, value];
      return { ...prev, [category]: newValues };
    });
  };

  const filteredTopics = practiceTopicsData.filter(topic => {
    const query = searchQuery.toLowerCase();
    const duration = parseInt(topic.estimatedTime.split('-')[0], 10);

    const matchesSearch = !searchQuery || topic.title.toLowerCase().includes(query) || topic.tags.some(tag => tag.toLowerCase().includes(query));
    const matchesDifficulty = filters.difficulty.includes(topic.difficulty);
    const matchesTopics = topic.tags.some(tag => filters.topics.includes(tag));
    const matchesDuration = duration >= filters.duration[0] && duration <= filters.duration[1];

    return matchesSearch && matchesDifficulty && matchesTopics && matchesDuration;
  });

  const startPracticeMode = (mode: string) => {
    // Only scroll to the topics section, do not navigate
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: topicsY, animated: true });
      }
    }, 100);
  };

  const startPractice = (topicId: number, mode: string) => {
    const selectedTopic = practiceTopicsData.find(t => t.id === topicId);
    if (!selectedTopic) {
      Alert.alert('Error', 'Topic not found');
      return;
    }
    
    setSelectedTopicId(topicId);
    setSetupConfig({
      numQuestions: selectedTopic.questions,
      difficulty: selectedTopic.difficulty.toUpperCase(),
      selectedTopics: selectedTopic.tags,
    });
    setSetupModalVisible(true);
  };

  const handleStartPractice = () => {
    setSetupModalVisible(false);
    router.push({
      pathname: '/quiz-pages/practice-session',
      params: {
        difficulty: setupConfig.difficulty,
        categories: JSON.stringify(setupConfig.selectedTopics),
        numQuestions: setupConfig.numQuestions,
      }
    });
  };

  const resetFilters = () => {
    setFilters({
      difficulty: ["Beginner", "Intermediate", "Advanced"],
      topics: ["Options", "Technical", "Risk", "Orders", "Basics", "Strategy", "Charts"],
      duration: [5, 60],
    });
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false
        }}
      />
      <QuizNavBar />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView ref={scrollViewRef} style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Practice Arena</Text>
              <Text style={styles.headerSubtitle}>Master trading at your own pace</Text>
            </View>
            <TouchableOpacity style={styles.filterButton} onPress={() => setFilterOpen(true)}>
              <Icon name="filter" size={14} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.filterButtonText}>Filter</Text>
            </TouchableOpacity>
          </View>

          {/* Practice Modes */}
          <View style={styles.modesContainer}>
            {practiceModesData.map(mode => (
              <TouchableOpacity key={mode.id} style={[styles.modeCard, { borderColor: mode.color, backgroundColor: `${mode.color}20` }]} onPress={() => startPracticeMode(mode.id)}>
                {mode.icon === 'brain' ? (
                  <FontAwesome5 name={mode.icon} size={24} color={mode.color} />
                ) : (
                  <Icon name={mode.icon} size={24} color={mode.color} />
                )}
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.modeTitle, { color: mode.color }]}>{mode.title}</Text>
                  <Text style={styles.modeDescription}>{mode.description}</Text>
                </View>
                <Icon name="play" size={20} color={mode.color} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Icon name="search" size={16} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              placeholder="Search practice topics..."
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Practice Topics Section */}
          <View onLayout={event => setTopicsY(event.nativeEvent.layout.y)} style={styles.topicsSection}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={styles.sectionTitle}>Practice Topics</Text>
              <View style={styles.topicCountBadge}><Text style={styles.topicCountText}>{filteredTopics.length} topics</Text></View>
            </View>

            {filteredTopics.length > 0 ? (
              filteredTopics.map(topic => <PracticeTopicCard key={topic.id} topic={topic} onStart={startPractice} />)
            ) : (
              <View style={styles.noTopicsContainer}>
                <Icon name="sliders" size={48} color="#4B5563" />
                <Text style={styles.noTopicsText}>No topics match your filters</Text>
                <TouchableOpacity onPress={resetFilters}>
                  <Text style={styles.resetFilterText}>Reset Filters</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Quick Stats */}
          <View style={[styles.card, { padding: 16 }]}>
            <Text style={styles.sectionTitle}>Your Practice Progress</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: '#A3E635' }]}>47</Text>
                <Text style={styles.statLabel}>Sessions</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: '#38BDF8' }]}>89%</Text>
                <Text style={styles.statLabel}>Accuracy</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: '#FACC15' }]}>12h</Text>
                <Text style={styles.statLabel}>Time Spent</Text>
              </View>
            </View>
          </View>

        </ScrollView>

        {/* Filter Modal */}
        <Modal visible={filterOpen} animationType="slide" transparent={true} onRequestClose={() => setFilterOpen(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Filter Practice Topics</Text>
              <Text style={styles.modalDescription}>Customize your practice experience</Text>

              <ScrollView>
                {/* Difficulty Filter */}
                <View style={styles.filterGroup}>
                  <Text style={styles.filterLabel}>Difficulty Level</Text>
                  {difficultyLevels.map(level => (
                    <View key={level} style={styles.checkboxContainer}>
                      <Switch value={filters.difficulty.includes(level)} onValueChange={() => toggleFilter('difficulty', level)} />
                      <Text style={styles.checkboxLabel}>{level}</Text>
                    </View>
                  ))}
                </View>

                {/* Topic Filter */}
                <View style={styles.filterGroup}>
                  <Text style={styles.filterLabel}>Topics</Text>
                  {topicFilters.map(topic => (
                    <View key={topic} style={styles.checkboxContainer}>
                      <Switch value={filters.topics.includes(topic)} onValueChange={() => toggleFilter('topics', topic)} />
                      <Text style={styles.checkboxLabel}>{topic}</Text>
                    </View>
                  ))}
                </View>

                {/* Duration Filter */}
                <View style={styles.filterGroup}>
                  <Text style={styles.filterLabel}>Duration (minutes)</Text>
                  <Slider
                    style={{ width: '100%', height: 40 }}
                    minimumValue={5}
                    maximumValue={60}
                    step={5}
                    value={filters.duration[0]} // Simplified to single value slider for now
                    onValueChange={(value: number) => setFilters(prev => ({ ...prev, duration: [value, prev.duration[1]] }))} // Needs adjustment for range
                    minimumTrackTintColor="#A3E635"
                    maximumTrackTintColor="#4B5563"
                  />
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.sliderValueText}>{filters.duration[0]} min</Text>
                    <Text style={styles.sliderValueText}>{filters.duration[1]} min</Text>
                  </View>
                </View>
              </ScrollView>

              <TouchableOpacity style={[styles.button, styles.applyFilterButton]} onPress={() => setFilterOpen(false)}>
                <Text style={styles.applyFilterButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Setup Modal */}
        <Modal
          visible={setupModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setSetupModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Practice Setup</Text>
              <Text style={styles.modalDescription}>Customize your practice session</Text>

              <ScrollView>
                {/* Number of Questions */}
                <View style={styles.setupGroup}>
                  <Text style={styles.setupLabel}>Number of Questions</Text>
                  <View style={styles.setupInputContainer}>
                    <TouchableOpacity
                      style={styles.setupButton}
                      onPress={() => setSetupConfig(prev => ({
                        ...prev,
                        numQuestions: Math.max(1, prev.numQuestions - 5)
                      }))}
                    >
                      <Text style={styles.setupButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.setupValue}>{setupConfig.numQuestions}</Text>
                    <TouchableOpacity
                      style={styles.setupButton}
                      onPress={() => setSetupConfig(prev => ({
                        ...prev,
                        numQuestions: Math.min(50, prev.numQuestions + 5)
                      }))}
                    >
                      <Text style={styles.setupButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Difficulty */}
                <View style={styles.setupGroup}>
                  <Text style={styles.setupLabel}>Difficulty</Text>
                  <View style={styles.difficultyButtons}>
                    {["EASY", "MEDIUM", "HARD"].map((diff) => (
                      <TouchableOpacity
                        key={diff}
                        style={[
                          styles.difficultyButton,
                          setupConfig.difficulty === diff && styles.difficultyButtonActive
                        ]}
                        onPress={() => setSetupConfig(prev => ({ ...prev, difficulty: diff }))}
                      >
                        <Text style={[
                          styles.difficultyButtonText,
                          setupConfig.difficulty === diff && styles.difficultyButtonTextActive
                        ]}>
                          {diff}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Topics */}
                <View style={styles.setupGroup}>
                  <Text style={styles.setupLabel}>Topics</Text>
                  <View style={styles.topicsGrid}>
                    {setupConfig.selectedTopics.map((topic, index) => (
                      <View key={index} style={styles.topicChip}>
                        <Text style={styles.topicChipText}>{topic}</Text>
                        <TouchableOpacity
                          onPress={() => setSetupConfig(prev => ({
                            ...prev,
                            selectedTopics: prev.selectedTopics.filter(t => t !== topic)
                          }))}
                        >
                          <Icon name="x" size={16} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              </ScrollView>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setSetupModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.startButton]}
                  onPress={handleStartPractice}
                >
                  <Text style={styles.startButtonText}>Start Practice</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#242620' },
  container: { flex: 1, paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  headerSubtitle: { fontSize: 14, color: '#9CA3AF' },
  filterButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#4B5563', borderRadius: 8 },
  filterButtonText: { color: '#FFF' },
  modesContainer: { marginTop: 16, marginBottom: 24 },
  modeCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, padding: 16, marginBottom: 12 },
  modeTitle: { fontWeight: '600' },
  modeDescription: { fontSize: 12, color: '#9CA3AF' },
  searchContainer: { position: 'relative', marginBottom: 24 },
  searchIcon: { position: 'absolute', left: 12, top: 14, zIndex: 1 },
  searchInput: { backgroundColor: '#1F2937', color: '#FFF', borderRadius: 8, paddingLeft: 40, height: 44, fontSize: 16 },
  topicsSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#FFF', marginBottom: 12 },
  topicCountBadge: { paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: '#4B5563', borderRadius: 16 },
  topicCountText: { fontSize: 12, color: '#D1D5DB' },
  noTopicsContainer: { alignItems: 'center', paddingVertical: 32 },
  noTopicsText: { marginTop: 8, color: '#9CA3AF' },
  resetFilterText: { color: '#A3E635', marginTop: 16 },
  card: { backgroundColor: '#1F2937', borderRadius: 12 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  statBox: { flex: 1, alignItems: 'center', backgroundColor: '#11182750', borderRadius: 8, padding: 12, marginHorizontal: 4 },
  statValue: { fontSize: 24, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalContent: { backgroundColor: '#1F2937', height: '80%', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
  modalDescription: { color: '#9CA3AF', marginBottom: 24 },
  filterGroup: { marginBottom: 24 },
  filterLabel: { fontSize: 16, fontWeight: '500', color: '#FFF', marginBottom: 12 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  checkboxLabel: { color: '#D1D5DB', marginLeft: 12 },
  sliderValueText: { color: '#9CA3AF', fontSize: 12 },
  button: { borderRadius: 8, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  applyFilterButton: { backgroundColor: '#A3E635' },
  applyFilterButtonText: { color: '#000', fontWeight: 'bold' },

  // PracticeTopicCard styles
  topicCard: { borderWidth: 1, borderRadius: 12, marginBottom: 16, overflow: 'hidden' },
  topicCardContent: { padding: 16 },
  topicTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  completedBadge: { backgroundColor: 'rgba(163, 230, 53, 0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  completedBadgeText: { color: '#A3E635', fontSize: 10, fontWeight: 'bold' },
  topicDescription: { fontSize: 14, color: '#9CA3AF', marginVertical: 8 },
  topicMetaContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  topicMetaItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginRight: 16 
  },
  topicMetaText: { color: '#9CA3AF', fontSize: 12 },
  topicTagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  tagBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, borderWidth: 1, borderColor: '#4B5563' },
  tagBadgeText: { color: '#D1D5DB', fontSize: 12 },
  topicActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  startPracticeButton: { backgroundColor: '#A3E635', flexShrink: 1 },
  startPracticeButtonText: { color: '#000', fontWeight: 'bold' },
  timedButton: { borderWidth: 1, borderColor: '#4B5563', marginLeft: 8 },
  timedButtonText: { color: '#FFF' },
  chevronButton: { padding: 4 },
  expandedContent: { borderTopWidth: 1, borderColor: '#374151', padding: 16 },
  expandedTitle: { fontSize: 14, fontWeight: '500', color: '#FFF', marginBottom: 8 },
  expandedText: { color: '#9CA3AF', fontSize: 14, lineHeight: 20 },
  progressBox: { flex: 1, backgroundColor: '#11182750', borderRadius: 8, padding: 8, alignItems: 'center', marginHorizontal: 4 },
  progressLabel: { color: '#9CA3AF', fontSize: 12 },
  progressValue: { color: '#FFF', fontWeight: '600', fontSize: 16 },

  // Setup Modal Styles
  setupGroup: {
    marginBottom: 24,
  },
  setupLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFF',
    marginBottom: 12,
  },
  setupInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 8,
  },
  setupButton: {
    width: 40,
    height: 40,
    backgroundColor: '#A3E635',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setupButtonText: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
  },
  setupValue: {
    fontSize: 18,
    color: '#FFF',
    marginHorizontal: 20,
    minWidth: 40,
    textAlign: 'center',
  },
  difficultyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  difficultyButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  difficultyButtonActive: {
    backgroundColor: '#A3E635',
    borderColor: '#A3E635',
  },
  difficultyButtonText: {
    color: '#FFF',
    fontWeight: '500',
  },
  difficultyButtonTextActive: {
    color: '#000',
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  topicChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(163, 230, 53, 0.2)',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    gap: 8,
  },
  topicChipText: {
    color: '#FFF',
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  cancelButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  startButton: {
    flex: 1,
    backgroundColor: '#A3E635',
  },
  startButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
}); 
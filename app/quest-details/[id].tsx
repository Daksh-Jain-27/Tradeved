import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
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
  questQNA: {
    id: string;
    total_question: number;
    questions: Array<{
      id: string;
      questionText: string;
      options: Array<{
        id: string;
        content: string;
        description: string;
        isCorrect: boolean;
      }>;
    }>;
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

// Questions data
const questions = [
  {
    id: 1,
    title: "Lorem ipsum dolor sit?",
    subtitle: "1/3 Consectetur adipiscing elit sed do eiusmod.",
    options: [
      "Tempor incididunt",
      "Labore et dolore",
      "Magna aliqua ut",
      "Enim ad minim"
    ],
    correctAnswer: "Tempor incididunt",
    explanation: "Lorem ipsum dolor sit amet consectetur.",
  },
  {
    id: 2,
    title: "Ut enim ad minim veniam?",
    subtitle: "2/3 Quis nostrud exercitation ullamco.",
    options: [
      "Laboris nisi ut",
      "Aliquip ex ea",
      "Commodo consequat",
      "Duis aute irure"
    ],
    correctAnswer: "Laboris nisi ut",
    explanation: "Lorem ipsum dolor sit amet consectetur.",
  },
  {
    id: 3,
    title: "Duis aute irure dolor?",
    subtitle: "3/3 Reprehenderit in voluptate velit.",
    options: [
      "Esse cillum dolore",
      "Fugiat nulla",
      "Pariatur excepteur",
      "Sint occaecat"
    ],
    correctAnswer: "Esse cillum dolore",
    explanation: "Lorem ipsum dolor sit amet consectetur.",
  },
];

const ContentRenderer = ({ contentType, content, logoUrl }: { contentType: string; content: string; logoUrl: string }) => {
  const renderTextContent = (htmlContent: string) => {
    // Remove HTML tags and convert to plain text
    const plainText = htmlContent
      .replace(/<h3>(.*?)<\/h3>/g, '\n$1\n') // Convert h3 to new lines
      .replace(/<p>(.*?)<\/p>/g, '$1\n') // Convert p to new lines
      .replace(/<ul>(.*?)<\/ul>/g, '$1\n') // Convert ul to new lines
      .replace(/<li>(.*?)<\/li>/g, '• $1\n') // Convert li to bullet points
      .replace(/<br\s*\/?>/g, '\n') // Convert br to new lines
      .replace(/&nbsp;/g, ' ') // Convert &nbsp; to space
      // .replace(/✅/g, '✓ ') // Convert emoji to text
      .replace(/<[^>]*>/g, '') // Remove any remaining HTML tags
      .trim();

    return (
      <View style={styles.textContentContainer}>
        <ScrollView style={styles.textContentScroll}>
          <Text style={styles.textContent}>{plainText}</Text>
        </ScrollView>
      </View>
    );
  };

  const renderContent = () => {
    switch (contentType.toLowerCase()) {
      case 'video':
        return (
          <View style={styles.videoContainer}>
            <Image 
              source={{ uri: logoUrl }} 
              style={styles.videoThumbnail}
              resizeMode="cover"
            />
            <TouchableOpacity style={styles.playButton}>
              <Ionicons name="play" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        );
      
      case 'text':
        return renderTextContent(content);
      
      case 'pdf':
        return (
          <View style={styles.pdfContainer}>
            <Image 
              source={{ uri: logoUrl }} 
              style={styles.pdfThumbnail}
              resizeMode="contain"
            />
            <TouchableOpacity style={styles.pdfButton}>
              <Ionicons name="document-text-outline" size={24} color="#FFF" />
              <Text style={styles.pdfButtonText}>View PDF</Text>
            </TouchableOpacity>
          </View>
        );
      
      default:
        return renderTextContent(content);
    }
  };

  return (
    <View style={styles.contentSection}>
      {renderContent()}
    </View>
  );
};

export default function QuestDetails() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
  const [showFeedback, setShowFeedback] = React.useState(false);
  const [hasClickedContinue, setHasClickedContinue] = React.useState(false);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);
  const [feedbackMessage, setFeedbackMessage] = React.useState<string>('');
  const { id } = useLocalSearchParams();
  const [questDetails, setQuestDetails] = React.useState<QuestDetails | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

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
      console.log('response', response);
      if (!response.ok) {
        throw new Error('Failed to fetch quest details');
      }

      const data = await response.json();
      console.log('Quest details:', data);
      setQuestDetails(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching quest details:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchQuestDetails();
  }, [id]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedOption(null);
      setShowFeedback(false);
      setHasClickedContinue(false);
    }
  };

  const handleSkip = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
      setHasClickedContinue(false);
    }
  };

  const removeHtmlTags = (htmlContent: string) => {
    return htmlContent
      .replace(/<h3>(.*?)<\/h3>/g, '\n$1\n') // Convert h3 to new lines
      .replace(/<p>(.*?)<\/p>/g, '$1\n') // Convert p to new lines
      .replace(/<ul>(.*?)<\/ul>/g, '$1\n') // Convert ul to new lines
      .replace(/<li>(.*?)<\/li>/g, '• $1\n') // Convert li to bullet points
      .replace(/<br\s*\/?>/g, '\n') // Convert br to new lines
      .replace(/&nbsp;/g, ' ') // Convert &nbsp; to space
      .replace(/<[^>]*>/g, '') // Remove any remaining HTML tags
      .trim();
  };

  const handleSaveAndContinue = () => {
    if (selectedOption) {
      if (showFeedback) {
        // After showing feedback, move to next question or complete
        if (isLastQuestion) {
          router.push('/level-complete');
        } else {
          setCurrentQuestionIndex(prev => prev + 1);
          setSelectedOption(null);
          setShowFeedback(false);
          setHasClickedContinue(false);
          setIsCorrect(null);
          setFeedbackMessage('');
        }
      } else {
        // First click - check answer and show feedback
        const currentQuestion = questDetails?.questQNA.questions[currentQuestionIndex];
        const selectedOptionData = currentQuestion?.options.find(opt => opt.id === selectedOption);
        
        if (selectedOptionData && currentQuestion) {
          const hasDescription = Boolean(selectedOptionData.description && selectedOptionData.description.trim() !== '');
          setIsCorrect(hasDescription);
          
          if (hasDescription) {
            // If answer is correct, show its explanation
            setFeedbackMessage(removeHtmlTags(selectedOptionData.description));
          } else {
            // If answer is incorrect, find and show the correct answer's explanation
            const correctOption = currentQuestion.options.find(opt => opt.description && opt.description.trim() !== '');
            setFeedbackMessage(correctOption?.description ? removeHtmlTags(correctOption.description) : 'Incorrect answer. Please try again.');
          }
        }
        
        setShowFeedback(true);
        setHasClickedContinue(true);
      }
    }
  };

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
        <Header 
          onProfilePress={() => {/* Handle profile press */}}
          onSearchPress={() => {/* Handle search press */}}
        />
        <ScrollView 
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollContentContainer}
        >
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
                  <Text style={styles.questTime}>{questDetails?.quest_time} min</Text>
                  <Text style={styles.questType}>{questDetails?.template}</Text>
                </View>
              </View>
              <View style={styles.contentSection1}>
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
                    <Text style={styles.timeDate}>21 Oct, 24</Text>
                  </View>
                </View>
              </View>
            </View>
            <Image 
              source={require('../../assets/images/quest-header.jpg')} 
              style={styles.questHeaderBg}
              resizeMode="cover"
            />
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${((currentQuestionIndex + (showFeedback ? 1 : 0)) / (questDetails?.questQNA?.total_question || 1)) * 100}%` }]} />
            </View>
          </View>

          {/* Quiz Prompt Section */}
          <View style={styles.quizPromptSection}>
            <Text style={styles.quizText}>Take the quiz and claim your reward!</Text>
            <View style={styles.timeRemaining}>
              <Ionicons name="time-outline" size={16} color="#FFF" />
              <Text style={styles.timeRemainingText}>9:58</Text>
            </View>
          </View>

          <ScrollView style={styles.content}>
            {/* Content Section */}
            <ContentRenderer 
              contentType={questDetails?.content_type || 'text'} 
              content={questDetails?.content || ''} 
              logoUrl={questDetails?.logo_url || ''}
            />

            {/* Glossary Section */}
            {/* <View style={styles.glossaryContainer}>
              <View style={styles.glossaryHeader}>
                <Text style={styles.glossaryTitle}>Glossary</Text>
                <TouchableOpacity style={styles.viewAllContainer}>
                  <Text style={styles.viewAllText}>View All</Text>
                  <View style={styles.arrowBox}>
                    <Ionicons name="chevron-forward" size={12} color="#a2aba9" />
                  </View>
                </TouchableOpacity>
              </View>
              <Text style={styles.glossaryText}>
                Learn about options trading concepts, including calls, puts, premiums, and basic strategies.
              </Text>
            </View> */}

            {/* Options Section */}
            <View style={styles.optionsContainer}>
              <View style={styles.optionsHeader}>
                <View>
                  <Text style={styles.optionsTitle}>Select the right answer</Text>
                  <Text style={styles.optionsSubtitle}>{currentQuestionIndex + 1}/{questDetails?.questQNA.total_question} {questDetails?.questQNA.questions[currentQuestionIndex].questionText}</Text>
                </View>
                {/* <View style={styles.searchBadge}>
                  <Image
                    source={require('../../assets/images/search.png')}
                    style={[styles.badgeIcon, { transform: [{ scaleX: -1 }] }]}
                    resizeMode="contain"
                  />
                  <View style={styles.badgeCount}>
                    <Text style={styles.badgeNumber}>{currentQuestionIndex + 1}</Text>
                  </View>
                </View> */}
              </View>
              
              <View style={styles.optionsWithImageContainer}>
                <View style={styles.optionsGrid}>
                  <View style={styles.optionsColumn}>
                    {questDetails?.questQNA.questions[currentQuestionIndex].options
                      .filter((_, index) => index % 2 === 0)
                      .map((option: { id: string; content: string; description: string; isCorrect: boolean }) => (
                        <TouchableOpacity
                          key={option.id}
                          style={[
                            styles.optionButton,
                            selectedOption === option.id && styles.selectedOption
                          ]}
                          onPress={() => setSelectedOption(option.id)}
                        >
                          <Text style={[
                            styles.optionText,
                            selectedOption === option.id && styles.selectedOptionText
                          ]}>{option.content}</Text>
                        </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.optionsColumn}>
                    {questDetails?.questQNA.questions[currentQuestionIndex].options
                      .filter((_, index) => index % 2 === 1)
                      .map((option: { id: string; content: string; description: string; isCorrect: boolean }) => (
                        <TouchableOpacity
                          key={option.id}
                          style={[
                            styles.optionButton,
                            selectedOption === option.id && styles.selectedOption
                          ]}
                          onPress={() => setSelectedOption(option.id)}
                        >
                          <Text style={[
                            styles.optionText,
                            selectedOption === option.id && styles.selectedOptionText
                          ]}>{option.content}</Text>
                        </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </ScrollView>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          {/* Feedback Container */}
          {showFeedback && (
            <View style={styles.feedbackContainer}>
              <View style={styles.feedbackContent}>
                <View style={styles.feedbackRow}>
                  <Ionicons 
                    name={isCorrect ? "checkmark-circle" : "close-circle"} 
                    size={20} 
                    color={isCorrect ? "#9BEC00" : "#ff4d4d"} 
                  />
                  <Text style={[styles.feedbackTitle, { color: isCorrect ? "#9BEC00" : "#ff4d4d" }]}>
                    {isCorrect ? "Awesome" : "Incorrect"}
                  </Text>
                  <Text style={styles.feedbackText}>{feedbackMessage}</Text>
                </View>
                <TouchableOpacity>
                  <Text style={styles.readMoreText}>Read Full Explanation {'>'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Bottom Navigation */}
          <View style={styles.bottomNav}>
            <TouchableOpacity 
              style={[styles.prevButton, isFirstQuestion && styles.buttonDisabled]}
              onPress={handlePrevious}
              disabled={isFirstQuestion}
            >
              <Text style={[styles.prevButtonText, isFirstQuestion && styles.buttonTextDisabled]}>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.nextButton, selectedOption ? styles.nextButtonActive : {}]}
              disabled={!selectedOption}
              onPress={handleSaveAndContinue}
            >
              <Text style={[styles.nextButtonText, selectedOption ? styles.nextButtonTextActive : {}]}>
                {isLastQuestion && showFeedback ? 'Complete Quest' : 'Save and Continue'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.skipButton, isLastQuestion && styles.buttonDisabled]}
              onPress={handleSkip}
              disabled={isLastQuestion}
            >
              <Text style={[styles.skipButtonText, isLastQuestion && styles.buttonTextDisabled]}>
                Skip {'>'}
              </Text>
            </TouchableOpacity>
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
  scrollContent: {
    flex: 1,
    marginTop: 92, // Height of fixed header
  },
  scrollContentContainer: {
    paddingBottom: 24,
  },
  // logo: {
  //   width: 37,
  //   height: 37,
  //   marginRight: 10,
  // },
  // searchWrapper: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   marginRight: 22,
  //   position: 'relative',
  //   marginLeft: 12,
  // },
  // searchIcon: {
  //   marginRight: 8,
  // },
  // searchInput: {
  //   flex: 1,
  //   height: 40,
  //   color: '#a2aba9',
  //   fontSize: 14,
  //   paddingVertical: 8,
  //   paddingRight: 8,
  // },
  // searchUnderline: {
  //   position: 'absolute',
  //   left: 0,
  //   right: 0,
  //   bottom: 6,
  //   height: 0.5,
  //   backgroundColor: '#a2aba9',
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
  //   borderRadius: 32,
  // },
  subHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingBottom: 24,
  },
  videoSection: {
    marginBottom: 24,
  },
  videoContainer: {
    width: '100%',
    height: 240,
    position: 'relative',
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  videoTitleContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
  },
  videoTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -20 },
      { translateY: -20 }
    ],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#9BEC00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glossaryContainer: {
    marginHorizontal: 16,
    padding: 16,
    paddingLeft: 28,
    // backgroundColor: '#2c2e27',
    borderRadius: 6,
    marginBottom: 24,
    borderWidth: 0.5,
    borderColor: '#d3dec8',
  },
  glossaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  glossaryTitle: {
    color: '#73786c',
    fontSize: 16,
    fontWeight: '600',
  },
  arrowBox: {
    width: 14,
    height: 14,
    // backgroundColor: '#2C2E27',
    borderRadius: 4,
    borderColor: '#a2aba9',
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
    color: '#a2aba9',
    fontSize: 12,
    fontWeight: '700',
    marginRight: -4,
    // marginLeft: 'auto',
  },
  glossaryText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  optionsContainer: {
    marginHorizontal: 16,
    marginBottom: 38,
  },
  optionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  optionsTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  optionsSubtitle: {
    color: '#a2aba9',
    fontSize: 14,
    marginBottom: 16,
  },
  optionsWithImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: -22,
    // marginBottom: 24,
  },
  optionsGrid: {
    flexDirection: 'row',
    gap: 22,
    flex: 1,
  },
  optionsColumn: {
    // flex: 1,
    gap: 8,
  },
  optionButton: {
    backgroundColor: '#f7faf5',
    paddingHorizontal: 26,
    paddingVertical: 7,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#9BEC00',
    borderColor: '#000',
  },
  optionText: {
    color: '#242621',
    fontSize: 12,
  },
  selectedOptionText: {
    color: '#242621',
  },
  optionWithBadge: {
    position: 'relative',
  },
  laptopBadge: {
    position: 'relative',
    width: 32,
    height: 32,
    marginLeft: 12,
  },
  searchBadge: {
    position: 'relative',
    width: 32,
    height: 32,
    marginTop: -4,
  },
  badgeIcon: {
    width: 32,
    height: 32,
  },
  badgeCount: {
    position: 'absolute',
    top: -6,
    right: 0,
    backgroundColor: '#cd0070',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeNumber: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  bottomSection: {
    backgroundColor: '#1A1A1A',
    borderTopWidth: 1,
    borderTopColor: '#333',
    marginTop: -64,
  },
  feedbackContainer: {
    backgroundColor: '#2e3029',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
    marginBottom: -16,
  },
  feedbackContent: {
    marginTop: -12,
    gap: 4,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  feedbackTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: -48,
  },
  feedbackText: {
    color: '#fff',
    fontSize: 12,
  },
  readMoreText: {
    color: '#2f8eff',
    fontSize: 12,
    marginTop: -4,
    left: 144,
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 34,
    backgroundColor: '#2e3029',
  },
  prevButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#fffbfb',
    borderRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  prevButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  nextButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  nextButtonActive: {
    backgroundColor: '#9BEC00',
  },
  nextButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  nextButtonTextActive: {
    color: '#242620',
  },
  skipButton: {
    padding: 8,
  },
  skipButtonText: {
    color: '#FFF',
    fontSize: 14,
  },
  questHeaderWrapper: {
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 0,
    backgroundColor: '#666666',
    // height: 100,
  },
  questHeaderContent: {
    width: '70%',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  questHeaderBg: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '30%',
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
  questMetrics: {
    marginTop: -20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: -12,
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
    // backgroundColor: '#1A1A1A',
    marginTop: 1,
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '65%',
    backgroundColor: '#9BEC00',    
    borderRadius: 6,
  },
  quizPromptSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#242620',
  },
  quizText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  timeRemaining: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeRemainingText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'flex-end',
    marginBottom: -36,
    alignItems: 'center',
  },
  verticalDivider: {
    width: 0.5,
    height: 28,
    backgroundColor: '#a2aba9',
    marginHorizontal: 4,
  },
  contentSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  contentSection1: {
    marginHorizontal: 0,
    marginBottom: 24,
    marginTop: 6,
    gap: 0,
  },
  textContentContainer: {
    backgroundColor: '#2e3029',
    borderRadius: 8,
    padding: 16,
    height: 240,
  },
  textContentScroll: {
    flex: 1,
  },
  textContent: {
    color: '#FFF',
    fontSize: 14,
    lineHeight: 24,
  },
  pdfContainer: {
    width: '100%',
    height: 240,
    position: 'relative',
    backgroundColor: '#2e3029',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfThumbnail: {
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
  pdfButton: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9BEC00',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  pdfButtonText: {
    color: '#242620',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonTextDisabled: {
    color: '#666',
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
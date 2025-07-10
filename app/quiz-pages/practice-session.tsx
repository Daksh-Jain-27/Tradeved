import { Feather } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QuizNavBar from "../../components/QuizNavBar";
import { socket } from "../../lib/socket";

// Types
interface Question {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correctAnswer?: string;
}

interface AnswerFeedback {
  correct: boolean;
  correctOptionId: string;
  explanation?: string;
  learningTip?: string;
}

const PracticeSession: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const difficulty = (params.difficulty as string) || "EASY";
  const categories = params.categories ? JSON.parse(params.categories as string) : [];
  const numQuestions = parseInt(params.numQuestions as string) || 10;

  // State with safe defaults
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const [participantId, setParticipantId] = useState<string>("");
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(Math.max(1, numQuestions));
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<'setup' | 'playing' | 'feedback' | 'finished'>('setup');
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Safe calculations
  const safeQuestionNumber = Math.max(1, questionNumber || 1);
  const safeTotalQuestions = Math.max(1, totalQuestions);
  const progressPercentage = Math.min(100, Math.max(0, (safeQuestionNumber / safeTotalQuestions) * 100));
  const answeredQuestions = Math.max(0, safeQuestionNumber - (selectedAnswer === null ? 1 : 0));

  // Load auth info
  useEffect(() => {
    const loadAuthInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const id = await AsyncStorage.getItem('userId');
        setAuthToken(token);
        setUserId(id);
        if (token && !socket.connected) {
          socket.connect();
        }
      } catch (error) {
        console.error('Error loading auth info:', error);
      }
    };
    loadAuthInfo();
  }, []);

  // Start practice session - Match web version exactly
  const startPractice = async () => {
    if (!authToken) {
      Alert.alert('Error', 'Please login to continue');
      return;
    }
    if (!socket.connected) {
      Alert.alert('Error', 'Game server is not connected. Please wait or refresh.');
      return;
    }

    setIsStarting(true);
    setError(null);
    
    try {
      console.log('Starting practice with:', { difficulty, categories, numQuestions });
      
      // Use the same API call as web version
      const response = await fetch('http://94.136.190.104:3000/api/practice/play', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          difficulty,
          categories,
          numQuestions,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to start practice session');
      }

      // Wait for socket events - don't set game status here
      // The socket event handlers will manage the state
    } catch (error: any) {
      console.error('Practice start error:', error);
      setError(error.message);
      Alert.alert('Error', `Failed to start practice: ${error.message}`);
      setIsStarting(false);
    }
  };

  // Handle answer submission - Match web version
  const handleAnswer = (optionId: string) => {
    if (!socket || !currentQuestion || feedback || !optionId) return;
    
    setSelectedAnswer(optionId);
    // Use exact same event as web version
    socket.emit('answer:submit', {
      sessionId,
      participantId,
      questionId: currentQuestion.id,
      optionId, // Keep as optionId, not answerId
    });
  };

  // Handle next question - Match web version
  const handleNextQuestion = () => {
    if (!socket) return;
    
    // Use exact same event as web version
    socket.emit('practice:next_question', { 
      sessionId, 
      participantId 
    });
    
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setFeedback(null);
    setGameStatus('playing');
  };

  // Socket event listeners with enhanced validation
  useEffect(() => {
    const onConnect = () => {
      console.log('Socket connected');
      setIsConnected(true);
    };
    
    const onDisconnect = () => {
      console.log('Socket disconnected');
      setIsConnected(false);
      setError('Lost connection to game server');
    };

    const onPracticeStarted = (data: any) => {
      console.log('Practice started data:', data);
      
      if (!data || typeof data !== 'object') {
        setError('Invalid practice data received');
        setIsStarting(false);
        return;
      }

      const { sessionId: newSessionId, participantId: newParticipantId, totalQuestions: newTotal } = data;
      
      if (!newSessionId || !newParticipantId) {
        setError('Missing session information');
        setIsStarting(false);
        return;
      }

      // Use exact same event as web version
      socket.emit('game:register-participant', {
        participantId: newParticipantId,
        sessionId: newSessionId,
      });
      
      setSessionId(newSessionId);
      setParticipantId(newParticipantId);
      setTotalQuestions(Math.max(1, newTotal || numQuestions));
      setGameStatus('playing');
      setIsStarting(false);
      setError(null);
      
      // Request first question using web version event
      socket.emit('practice:next_question', {
        sessionId: newSessionId,
        participantId: newParticipantId,
      });
    };

    const onNewQuestion = (data: any) => {
      console.log('New question data:', data);
      
      if (!data || typeof data !== 'object') {
        console.error('Invalid question data:', data);
        return;
      }

      const { question, questionNumber: newQuestionNumber } = data;
      
      if (!question || typeof question !== 'object' || !question.text || !question.id) {
        console.error('Invalid question object:', question);
        return;
      }

      if (!Array.isArray(question.options) || question.options.length === 0) {
        console.error('Invalid question options:', question.options);
        return;
      }

      // Validate all options
      const validOptions = question.options.filter((option: any) => 
        option && typeof option === 'object' && option.id && option.text
      );

      if (validOptions.length === 0) {
        console.error('No valid options found');
        return;
      }

      if (typeof newQuestionNumber !== 'number' || newQuestionNumber < 1) {
        console.error('Invalid question number:', newQuestionNumber);
        return;
      }

      setCurrentQuestion({
        ...question,
        options: validOptions
      });
      setQuestionNumber(newQuestionNumber);
    };

    const onAnswerFeedback = (data: any) => {
      console.log('Answer feedback data:', data);
      
      if (!data || typeof data !== 'object' || typeof data.correct !== 'boolean') {
        console.error('Invalid feedback data:', data);
        return;
      }

      setFeedback(data);
      setGameStatus('feedback');
      if (data.correct) {
        setScore(prev => prev + 1);
      }
    };

    const onPracticeFinished = (data: any) => {
      console.log('Practice finished data:', data);
      setGameStatus('finished');
      Alert.alert(
        'Practice Complete!',
        `You scored ${score} out of ${safeTotalQuestions}!`,
        [
          {
            text: 'Back to Practice Hub',
            onPress: () => router.push('/quiz-pages/PracticeHub')
          }
        ]
      );
    };

    const onPracticeError = (data: any) => {
      console.error('Practice error:', data);
      Alert.alert('Error', data?.message || 'An error occurred');
      router.back();
    };

    // Setup socket listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('practice:started', onPracticeStarted);
    socket.on('question:new', onNewQuestion);
    socket.on('answer:feedback', onAnswerFeedback);
    socket.on('practice:finished', onPracticeFinished);
    socket.on('practice:error', onPracticeError);

    // Start practice when component mounts and we have auth
    if (authToken && socket.connected && gameStatus === 'setup') {
      console.log('Auto-starting practice session');
      startPractice();
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('practice:started', onPracticeStarted);
      socket.off('question:new', onNewQuestion);
      socket.off('answer:feedback', onAnswerFeedback);
      socket.off('practice:finished', onPracticeFinished);
      socket.off('practice:error', onPracticeError);
    };
  }, [authToken, router, score, safeTotalQuestions, gameStatus, numQuestions]);

  return (
    <View style={{ flex: 1, backgroundColor: "#242620" }}>
      <Stack.Screen options={{ headerShown: false }} />
      <QuizNavBar />
      <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}>
        {/* Debug Info - Remove in production */}
        {__DEV__ && (
          <View style={{ padding: 8, backgroundColor: 'rgba(0,0,0,0.5)', marginBottom: 8 }}>
            <Text style={{ color: '#fff', fontSize: 12 }}>
              Status: {gameStatus}, Connected: {isConnected ? 'Yes' : 'No'}{'\n'}
              Question: {questionNumber}/{totalQuestions}{'\n'}
              Session: {sessionId ? 'Active' : 'Not started'}{'\n'}
              Auth: {authToken ? 'Present' : 'Missing'}
            </Text>
          </View>
        )}

        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}> 
            <Feather name="arrow-left" size={22} color="#94a3b8" />
          </TouchableOpacity>
          <View style={{ alignItems: "center" }}>
            <View style={styles.badgeOutline}>
              <Text style={styles.badgeText}>
                Question {safeQuestionNumber}/{safeTotalQuestions}
              </Text>
            </View>
          </View>
          <View style={styles.iconButton} />
        </View>

        {/* Progress */}
        <View style={styles.progressBarWrap}>
          <View style={[styles.progressBar, { width: `${progressPercentage}%` }]} />
        </View>

        {/* Score */}
        <View style={{ alignItems: "center", marginBottom: 8 }}>
          <View style={[styles.badgeOutline, { backgroundColor: "rgba(163, 230, 53, 0.1)", borderColor: "rgba(163, 230, 53, 0.2)" }]}> 
            <Text style={[styles.badgeText, { color: "#A3E635" }]}>
              Score: {score}/{answeredQuestions}
            </Text>
          </View>
        </View>

        {/* Connection Status */}
        {!isConnected && (
          <View style={styles.connectionWarning}>
            <Text style={styles.warningText}>Connecting to game server...</Text>
          </View>
        )}

        {/* Error Display */}
        {error && (
          <View style={styles.connectionWarning}>
            <Text style={styles.warningText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={startPractice}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Loading States */}
        {isStarting ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#A3E635" />
            <Text style={styles.loadingText}>Starting practice session...</Text>
          </View>
        ) : gameStatus === 'playing' && !currentQuestion ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#A3E635" />
            <Text style={styles.loadingText}>Loading question...</Text>
          </View>
        ) : null}

        {/* Question Display */}
        {currentQuestion && currentQuestion.text && Array.isArray(currentQuestion.options) && (
          <LinearGradient
            colors={['rgba(163, 230, 53, 0.1)', 'rgba(56, 189, 248, 0.1)']}
            style={styles.card}
          >
            <Text style={styles.questionText}>{currentQuestion.text}</Text>
            {currentQuestion.options.map((option) => {
              if (!option || !option.id || !option.text) return null;
              
              const isSelected = selectedAnswer === option.id;
              const isCorrect = feedback && option.id === feedback.correctOptionId;
              
              const btnStyle = [
                styles.answerButton,
                selectedAnswer === null ? styles.answerDefault : null,
                isSelected && isCorrect ? styles.answerCorrect : null,
                isSelected && !isCorrect ? styles.answerWrong : null,
                isCorrect && feedback && !isSelected ? styles.answerCorrect : null,
                selectedAnswer !== null && !isSelected && !(isCorrect && feedback) ? styles.answerDim : null
              ].filter(Boolean);

              return (
                <TouchableOpacity
                  key={option.id}
                  style={btnStyle}
                  onPress={() => handleAnswer(option.id)}
                  disabled={selectedAnswer !== null}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                    <Text style={[styles.answerText, selectedAnswer === null && { color: "#fff" }]}>
                      {option.text}
                    </Text>
                    {feedback && isSelected && (
                      isCorrect ? (
                        <Feather name="check-circle" size={20} color="#A3E635" />
                      ) : (
                        <Feather name="x" size={20} color="#ef4444" />
                      )
                    )}
                    {feedback && isCorrect && selectedAnswer !== option.id && (
                      <Feather name="check-circle" size={20} color="#A3E635" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </LinearGradient>
        )}

        {/* Explanation */}
        {feedback && (
          <LinearGradient
            colors={['rgba(56, 189, 248, 0.1)', 'rgba(163, 230, 53, 0.1)']}
            style={styles.cardExplanation}
          >
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
              <Feather name="info" size={16} color="#38bdf8" style={{ marginRight: 6 }} />
              <Text style={{ color: "#38bdf8", fontWeight: "bold" }}>Explanation</Text>
            </View>
            {feedback.explanation && (
              <Text style={styles.explanationText}>{feedback.explanation}</Text>
            )}
            {feedback.learningTip && (
              <>
                <Text style={[styles.explanationText, { marginTop: 8, fontWeight: 'bold', color: '#A3E635' }]}>
                  Learning Tip:
                </Text>
                <Text style={styles.explanationText}>{feedback.learningTip}</Text>
              </>
            )}
          </LinearGradient>
        )}

        {/* Next Button */}
        {feedback && (
          <TouchableOpacity style={styles.nextBtn} onPress={handleNextQuestion}>
            <Text style={styles.nextBtnText}>Next Question</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    padding: 16,
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  iconButton: { padding: 8, borderRadius: 8, backgroundColor: "rgba(0, 0, 0, 0.2)", borderWidth: 1, borderColor: "rgba(163, 230, 53, 0.2)" },
  badgeOutline: { borderWidth: 1, borderColor: "rgba(163, 230, 53, 0.2)", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, backgroundColor: "rgba(0, 0, 0, 0.2)", marginBottom: 2 },
  badgeText: { color: "#94a3b8", fontWeight: "bold", fontSize: 13 },
  progressBarWrap: { height: 8, backgroundColor: "rgba(0, 0, 0, 0.2)", borderRadius: 8, marginBottom: 12, marginTop: 4, borderWidth: 1, borderColor: "rgba(163, 230, 53, 0.2)" },
  progressBar: { height: 8, backgroundColor: "#A3E635", borderRadius: 8 },
  card: { borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "rgba(163, 230, 53, 0.2)" },
  questionText: { fontWeight: "bold", fontSize: 16, marginBottom: 12, color: "#fff" },
  answerButton: { backgroundColor: "rgba(0, 0, 0, 0.2)", borderRadius: 10, paddingVertical: 14, paddingHorizontal: 12, marginBottom: 8, borderWidth: 1, borderColor: "rgba(163, 230, 53, 0.2)" },
  answerDefault: {},
  answerCorrect: { borderColor: "#A3E635", backgroundColor: "rgba(163, 230, 53, 0.1)" },
  answerWrong: { borderColor: "#ef4444", backgroundColor: "rgba(239, 68, 68, 0.1)" },
  answerDim: { opacity: 0.5 },
  answerText: { fontSize: 15, fontWeight: "500", color: "#fff" },
  cardExplanation: { borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: "rgba(56, 189, 248, 0.2)" },
  explanationText: { color: "#94a3b8", fontSize: 13 },
  nextBtn: { backgroundColor: "#A3E635", borderRadius: 8, paddingVertical: 14, alignItems: "center", marginTop: 8 },
  nextBtnText: { color: "#000", fontWeight: "bold", fontSize: 16 },
  connectionWarning: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  warningText: {
    color: '#ef4444',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#A3E635',
    marginTop: 12,
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: '#A3E635',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PracticeSession;

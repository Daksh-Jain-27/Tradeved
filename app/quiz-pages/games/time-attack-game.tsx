import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import QuizNavBar from "../../../components/QuizNavBar";
import { socket } from "../../../lib/socket";

// Types
interface Question {
  id: string;
  text: string;
  options: { id: string; text: string }[];
}

interface AnswerFeedback {
  correct: boolean;
  correctOptionId: string;
  explanation?: string;
  learningTip?: string;
}

const colors = {
  background: "#242620",
  foreground: "#f8fafc",
  card: "rgba(30, 41, 59, 0.5)",
  "muted-foreground": "#94a3b8",
  border: "#334155",
  primary: "#f8fafc",
  "primary-foreground": "#0b1120",
  destructive: "#CC0066",
  "destructive-foreground": "#FFFFFF",
  "green-500": "#22c55e",
  "red-500": "#ef4444",
  "amber-500": "#f59e0b",
};

const CircularProgress = ({ value, size = 40, strokeWidth = 4 }: { value: number, size?: number, strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: colors.primary, fontSize: 12, fontWeight: 'bold' }}>{Math.round(value / 100 * 60)}</Text>
    </View>
  )
};

const LinearProgress = ({ value }: { value: number }) => (
  <View style={styles.linearProgressContainer}><View style={[styles.linearProgressBar, { width: `${value}%` }]} /></View>
);

export default function TimeAttackGameScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Get difficulty and duration from params
  const difficulty = (params.difficulty as string) || "EASY";
  const durationMinutes = parseInt(params.durationMinutes as string) || 1;
  
  // Auth and connection state - FIXED: Use correct token names
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(socket.connected);
  
  // Game state
  const [sessionId, setSessionId] = useState<string>("");
  const [participantId, setParticipantId] = useState<string>("");
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [gameStatus, setGameStatus] = useState<'setup' | 'playing' | 'feedback' | 'finished'>('setup');
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // FIXED: Load auth info with correct token names
  useEffect(() => {
    const loadAuthInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const userIdValue = await AsyncStorage.getItem('userId');
        setAuthToken(token);
        setUserId(userIdValue);
        if (token && !socket.connected) {
          socket.connect();
        }
      } catch (error) {
        console.error('Error loading auth info:', error);
      }
    };
    loadAuthInfo();
  }, []);

  // Timer effect
  useEffect(() => {
    if (gameStatus === "playing" && timeLeft > 0 && !feedback) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameStatus === "playing") {
      // FIXED: Use correct event name
      socket.emit('time_attack:finished', { sessionId, participantId });
    }
  }, [timeLeft, gameStatus, feedback, sessionId, participantId]);

  // FIXED: Start time attack session with correct API endpoint
  const startTimeAttack = async () => {
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
      console.log('Starting time attack game with:', { difficulty, durationMinutes });
      
      // FIXED: Use relative URL instead of hardcoded IP
      const response = await fetch('http://94.136.190.104:3000/api/time-attack/play', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          difficulty,
          durationMinutes,
          categories: [],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to start time attack game');
      }

      const data = await response.json();
      console.log('Time attack API response:', data);

    } catch (error: any) {
      console.error('Time attack start error:', error);
      setError(error.message);
      Alert.alert('Error', `Failed to start game: ${error.message}`);
      setIsStarting(false);
    }
  };

  // Handle next question
  const handleNextQuestion = () => {
    if (!socket || !sessionId || !participantId) return;
    
    setSelectedAnswer(null);
    setFeedback(null);
    setGameStatus('playing');
    
    console.log('Requesting next question');
    // FIXED: Use correct event name
    socket.emit('time_attack:request_next_question', {
      sessionId,
      participantId,
    });
  };

  // FIXED: Socket event listeners with correct event names
  useEffect(() => {
    // if (!isConnected || !socket) return;

    const onConnect = () => {
      console.log('Socket connected');
      setIsConnected(true);
    };
    
    const onDisconnect = () => {
      console.log('Socket disconnected');
      setIsConnected(false);
      setError('Lost connection to game server');
    };

    const handleTimeAttackStarted = (data: {
      sessionId: string;
      participantId: string;
      durationMinutes: number;
    }) => {
      console.log('Time attack started:', data);
      
      // Register participant first
      socket.emit("game:register-participant", {
        participantId: data.participantId,
        sessionId: data.sessionId,
      });
      
      setSessionId(data.sessionId);
      setParticipantId(data.participantId);
      setScore(0);
      setTimeLeft(data.durationMinutes * 60);
      setGameStatus("playing");
      setIsStarting(false);
      
      // Request first question
      socket.emit("time_attack:request_next_question", {
        sessionId: data.sessionId,
        participantId: data.participantId,
      });
    };

    const handleNewQuestion = (data: { question: Question }) => {
      console.log('New question received:', data);
      setCurrentQuestion(data.question);
      setQuestionNumber(prev => prev + 1);
    };

    const handleScoreUpdate = (data: { score: number }) => {
      setScore(data.score);
    };

    const handleTimeAttackFinished = (data: {
      scores: Record<string, number>;
    }) => {
      const finalScore = data.scores[participantId] || score;
      setScore(finalScore);
      setGameStatus("finished");
      setCurrentQuestion(null);
    };

    const handleTimeAttackError = (data: { message: string }) => {
      setError(`Time Attack Error: ${data.message}`);
      setIsStarting(false);
    };

    // FIXED: Use correct event names matching web version
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on("time_attack:started", handleTimeAttackStarted);
    socket.on("question:new", handleNewQuestion);
    socket.on("time_attack:score_update", handleScoreUpdate);
    socket.on("time_attack:finished", handleTimeAttackFinished);
    socket.on("time_attack:error", handleTimeAttackError);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off("time_attack:started");
      socket.off("question:new");
      socket.off("time_attack:score_update");
      socket.off("time_attack:finished");
      socket.off("time_attack:error");
    };
  }, [isConnected, socket, participantId, score]);

  // FIXED: Auto-start game when ready
  useEffect(() => {
    if (authToken && socket.connected && gameStatus === 'setup' && !isStarting) {
      console.log('Auto-starting time attack game');
      startTimeAttack();
    }
  }, [authToken, socket.connected, gameStatus, isStarting]);

  // Handle answer submission
  const handleAnswer = (optionId: string) => {
    if (!socket || !currentQuestion || feedback || !optionId) return;
    
    setSelectedAnswer(optionId);
    socket.emit('answer:submit', {
      sessionId,
      participantId,
      questionId: currentQuestion.id,
      optionId,
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <QuizNavBar />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={16} color={colors.foreground} />
            <Text style={styles.backButtonText}>Exit Game</Text>
          </TouchableOpacity>
          <Text style={styles.logo}>TradeVed</Text>
        </View>

        {/* Status Bar */}
        <View style={styles.statusBar}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Score: {score}</Text>
          </View>
          <View style={styles.badge}>
            <Feather name="clock" size={14} color={colors.foreground} style={{ marginRight: 4 }} />
            <Text style={styles.badgeText}>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</Text>
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
            <TouchableOpacity style={styles.retryButton} onPress={startTimeAttack}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Loading States */}
        {isStarting ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#A3E635" />
            <Text style={styles.loadingText}>Starting game...</Text>
          </View>
        ) : gameStatus === 'playing' && !currentQuestion ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#A3E635" />
            <Text style={styles.loadingText}>Loading question...</Text>
          </View>
        ) : null}

        {/* Game Content */}
        {currentQuestion && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Question {questionNumber}</Text>
                </View>
                <CircularProgress value={(timeLeft / (durationMinutes * 60)) * 100} />
              </View>
              <Text style={styles.questionText}>{currentQuestion.text}</Text>
            </View>
            <View style={styles.cardContent}>
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === option.id;
                const isCorrect = feedback && option.id === feedback.correctOptionId;
                
                let buttonStyle = styles.optionButton;
                let textStyle = styles.optionText;
                let icon = (
                  <View style={styles.optionIcon}>
                    <Text style={styles.optionIconText}>{String.fromCharCode(65 + index)}</Text>
                  </View>
                );

                if (feedback) {
                  if (isSelected) {
                    buttonStyle = isCorrect ? styles.correctButton : styles.incorrectButton;
                    textStyle = { ...textStyle, color: isCorrect ? colors['green-500'] : colors['red-500'] };
                    icon = isCorrect ? 
                      <Feather name="check-circle" size={20} color={colors['green-500']} style={{ marginRight: 8 }} /> : 
                      <Feather name="x-circle" size={20} color={colors['red-500']} style={{ marginRight: 8 }} />;
                  } else if (isCorrect) {
                    buttonStyle = styles.correctButton;
                    textStyle = { ...textStyle, color: colors['green-500'] };
                    icon = <Feather name="check-circle" size={20} color={colors['green-500']} style={{ marginRight: 8 }} />;
                  }
                }

                return (
                  <TouchableOpacity
                    key={option.id}
                    style={buttonStyle}
                    onPress={() => handleAnswer(option.id)}
                    disabled={!!feedback}
                  >
                    {icon}
                    <Text style={textStyle}>{option.text}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Feedback Display */}
            {feedback && (
              <View style={styles.cardContent}>
                <View style={[styles.feedbackBox, { 
                  backgroundColor: feedback.correct ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                }]}>
                  <Feather 
                    name={feedback.correct ? 'check-circle' : 'x-circle'} 
                    size={20} 
                    color={feedback.correct ? colors['green-500'] : colors['red-500']} 
                  />
                  <Text style={{ 
                    color: feedback.correct ? colors['green-500'] : colors['red-500'], 
                    marginLeft: 8 
                  }}>
                    {feedback.correct ? 'Correct!' : 'Incorrect!'}
                  </Text>
                </View>
                {feedback.explanation && (
                  <Text style={[styles.feedbackText, { marginTop: 8 }]}>
                    {feedback.explanation}
                  </Text>
                )}
                {feedback.learningTip && (
                  <Text style={[styles.feedbackText, { marginTop: 8, color: colors['amber-500'] }]}>
                    Tip: {feedback.learningTip}
                  </Text>
                )}
                <TouchableOpacity 
                  style={[styles.button, styles.nextButton]} 
                  onPress={handleNextQuestion}
                >
                  <Text style={styles.buttonText}>Next Question</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Results Display */}
        {gameStatus === 'finished' && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={[styles.questionText, { textAlign: 'center' }]}>Time Attack Results</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={{ alignItems: 'center', marginVertical: 24 }}>
                <View style={[styles.resultIconContainer, { 
                  backgroundColor: score > totalQuestions / 2 ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)' 
                }]}>
                  <MaterialCommunityIcons 
                    name={score > totalQuestions / 2 ? 'check-circle-outline' : 'alert-circle-outline'} 
                    size={48} 
                    color={score > totalQuestions / 2 ? colors['green-500'] : colors['amber-500']} 
                  />
                </View>
                <Text style={styles.resultTitle}>
                  {score > totalQuestions / 2 ? "Well Done!" : "Keep Practicing!"}
                </Text>
                <Text style={styles.resultSubtitle}>
                  You scored {score} points in {durationMinutes * 60 - timeLeft} seconds.
                </Text>
              </View>

              <View style={{ marginBottom: 16 }}>
                <View style={styles.summaryRow}>
                  <Text style={styles.infoText}>Time Used</Text>
                  <Text style={styles.infoText}>{durationMinutes * 60 - timeLeft}s</Text>
                </View>
                <LinearProgress value={((durationMinutes * 60 - timeLeft) / (durationMinutes * 60)) * 100} />
              </View>

              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity 
                  style={styles.primaryButton} 
                  onPress={() => {
                    setGameStatus('setup');
                    setScore(0);
                    setTimeLeft(durationMinutes * 60);
                    setCurrentQuestion(null);
                    setQuestionNumber(0);
                    setSelectedAnswer(null);
                    setFeedback(null);
                    setError(null);
                    startTimeAttack();
                  }}
                >
                  <Text style={styles.primaryButtonText}>Play Again</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.secondaryButton} 
                  onPress={() => router.back()}
                >
                  <Text style={styles.secondaryButtonText}>Back to Games</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </>
  );
}

// Styles remain the same
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backButtonText: { marginLeft: 8, color: colors.foreground },
  logo: { fontSize: 22, fontWeight: 'bold', color: colors.foreground },
  statusBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  badge: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 },
  badgeText: { color: colors.foreground, fontWeight: '500' },
  card: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12 },
  cardHeader: { padding: 16 },
  questionText: { fontSize: 18, fontWeight: 'bold', color: colors.foreground, marginTop: 16 },
  cardContent: { padding: 16 },
  optionButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 16, marginBottom: 12 },
  correctButton: { borderColor: colors['green-500'], borderWidth: 2, flexDirection: 'row', alignItems: 'center', borderRadius: 8, padding: 16, marginBottom: 12 },
  incorrectButton: { borderColor: colors['red-500'], borderWidth: 2, flexDirection: 'row', alignItems: 'center', borderRadius: 8, padding: 16, marginBottom: 12 },
  optionText: { color: colors.foreground, fontSize: 16, flex: 1 },
  optionIcon: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  optionIconText: { color: colors.foreground, fontSize: 12 },
  feedbackBox: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 8 },
  feedbackText: { color: colors.foreground, fontSize: 14, lineHeight: 20 },
  resultIconContainer: { width: 96, height: 96, borderRadius: 48, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  resultTitle: { fontSize: 24, fontWeight: 'bold', color: colors.foreground },
  resultSubtitle: { color: colors["muted-foreground"], textAlign: 'center', marginTop: 8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  infoText: { color: colors.foreground },
  linearProgressContainer: { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' },
  linearProgressBar: { height: '100%', backgroundColor: colors.primary },
  primaryButton: { flex: 1, backgroundColor: colors.primary, padding: 16, borderRadius: 8, alignItems: 'center' },
  primaryButtonText: { color: colors["primary-foreground"], fontSize: 16, fontWeight: 'bold' },
  secondaryButton: { flex: 1, borderWidth: 1, borderColor: colors.border, padding: 16, borderRadius: 8, alignItems: 'center' },
  secondaryButtonText: { color: colors.foreground, fontSize: 16, fontWeight: 'bold' },
  button: { backgroundColor: colors.primary, padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  buttonText: { color: colors["primary-foreground"], fontSize: 16, fontWeight: 'bold' },
  nextButton: { backgroundColor: colors['green-500'] },
  connectionWarning: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  warningText: {
    color: colors['red-500'],
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

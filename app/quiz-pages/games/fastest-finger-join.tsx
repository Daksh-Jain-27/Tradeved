import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import QuizNavBar from "../../../components/QuizNavBar";
import { socket } from "../../../lib/socket";

// HSL to HEX conversion and color palette
const hsl = (h: number, s: number, l: number) => `hsl(${h}, ${s}%, ${l}%)`;

const colors = {
  background: '#242620',
  foreground: hsl(210, 40, 98),
  card: hsl(222.2, 84, 4.9),
  "card-foreground": hsl(210, 40, 98),
  primary: hsl(210, 40, 98),
  "primary-foreground": hsl(222.2, 47.4, 11.2),
  "muted-foreground": hsl(215, 20.2, 65.1),
  border: hsl(217.2, 32.6, 17.5),
  yellow: { 500: "#f59e0b" },
  success: "#28a745",
  error: "#dc3545",
  warning: "#ffc107",
};

// --- TYPE DEFINITIONS ---
type FFGameStatus = 'idle' | 'searching' | 'waiting' | 'playing' | 'answered' | 'finished';
interface Player { 
  participantId: string; 
  userId: string; 
  username?: string; 
  avatarUrl?: string; 
}
interface Question { 
  id: string; 
  text: string; 
  options: { id: string; text: string }[]; 
}
interface AnswerData { 
  questionId: string; 
  timeTaken: number; 
  action: 'answered' | 'skipped' | 'timeout'; 
  correct?: boolean; 
}
interface Results { 
  [participantId: string]: AnswerData[]; 
}

const ProgressBar = ({ value }: { value: number }) => (
  <View style={styles.progressContainer}>
    <View style={[styles.progressBar, { width: `${value}%` }]} />
  </View>
);

export default function FastestFingerGame() {
  const router = useRouter();
  
  // --- State Management ---
  const [authInfo, setAuthInfo] = useState<{ userId: string; token: string } | null>(null);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [gameStatus, setGameStatus] = useState<FFGameStatus>('idle');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const playersRef = useRef(players);
  
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(0);
  const [totalTimeLeft, setTotalTimeLeft] = useState(0);
  const [timePerQuestion, setTimePerQuestion] = useState<10 | 20 | 30>(20);
  const [gameDuration, setGameDuration] = useState<1 | 2 | 5>(2);
  
  const [scores, setScores] = useState<Record<string, number>>({});
  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [correctOptionId, setCorrectOptionId] = useState<string | null>(null);
  const [waitingMessage, setWaitingMessage] = useState<string | null>(null);
  const [gameResults, setGameResults] = useState<Results | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => { playersRef.current = players; }, [players]);

  const myParticipantId = useMemo(() => 
    players.find(p => p.userId === authInfo?.userId)?.participantId, 
    [players, authInfo]
  );
  
  const opponent = useMemo(() => 
    players.find(p => p.userId !== authInfo?.userId), 
    [players, authInfo]
  );
  
  const myScore = myParticipantId ? (scores[myParticipantId] || 0) : 0;
  const opponentScore = opponent ? (scores[opponent.participantId] || 0) : 0;

  // --- EFFECT 1: AUTHENTICATION & SOCKET CONNECTION ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const userId = await AsyncStorage.getItem('userId');

        if (token && userId) {
          setAuthInfo({ userId, token });
          if (!socket.connected) socket.connect();
        } else {
          setErrorMessage("You must be logged in to play.");
        }
      } catch (error) {
        setErrorMessage("Failed to load authentication data.");
      }
    };

    initAuth();

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    const onConnectError = (err: Error) => {
      setErrorMessage(`Connection Error: ${err.message}`);
      setIsConnected(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
    };
  }, []);

  // --- Handlers ---
  const findMatch = useCallback(async () => {
    setErrorMessage(null);
    if (!authInfo) return setErrorMessage("Authentication details not found.");
    if (!isConnected) return setErrorMessage("Not connected to game server.");

    setGameStatus('searching');
    try {
      const response = await fetch('http://94.136.190.104:3000/api/fastest-finger/find-match', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${authInfo.token}` 
        },
        body: JSON.stringify({ 
          timePerQuestion: timePerQuestion * 1000, 
          duration: gameDuration 
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error: any) {
      setErrorMessage(`Error finding match: ${error.message}`);
      setGameStatus('idle');
    }
  }, [authInfo, isConnected, timePerQuestion, gameDuration]);

  const handleAnswerClick = (optionId: string) => {
    if (!socket || !currentQuestion || hasAnswered || !sessionId || !myParticipantId) return;
    setSelectedOptionId(optionId);
    setHasAnswered(true);
    setGameStatus('answered');
    socket.emit('answer:submit', { 
      sessionId, 
      participantId: myParticipantId, 
      questionId: currentQuestion.id, 
      optionId 
    });
  };

  const resetGame = () => {
    setGameStatus('idle');
    setSessionId(null);
    setCurrentQuestion(null);
    setHasAnswered(false);
    setSelectedOptionId(null);
    setCorrectOptionId(null);
    setScores({});
    setWaitingMessage(null);
    setPlayers([]);
    setGameResults(null);
    setTotalTimeLeft(0);
    setQuestionNumber(0);
    setTotalQuestions(0);
    setQuestionTimeLeft(0);
  };

  const formatTime = (seconds: number) => 
    `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

  // --- EFFECT 2: GAME EVENT LISTENERS ---
  useEffect(() => {
    if (!isConnected || !socket || !authInfo) return;

    const handleMatchFound = (data: { 
      sessionId: string; 
      players: Player[]; 
      duration: number; 
      timePerQuestion: number; 
      totalQuestions: number; 
    }) => {
      const myInfo = data.players.find(p => p.userId === authInfo.userId);
      if (!myInfo) {
        setErrorMessage("Your player info not found in match data.");
        setGameStatus('idle');
        return;
      }
      socket.emit("game:register-participant", { 
        participantId: myInfo.participantId, 
        sessionId: data.sessionId 
      });
      setSessionId(data.sessionId);
      setPlayers(data.players);
      setTotalQuestions(data.totalQuestions);
      setTotalTimeLeft(data.duration * 60);
      setTimePerQuestion(data.timePerQuestion / 1000 as 10 | 20 | 30);
      setGameStatus('waiting');
    };

    const handleNewQuestion = (data: { 
      question: Question; 
      questionNumber: number; 
      timeLimit: number; 
    }) => {
      setCurrentQuestion(data.question);
      setQuestionNumber(data.questionNumber);
      setQuestionTimeLeft(data.timeLimit / 1000);
      setHasAnswered(false);
      setSelectedOptionId(null);
      setCorrectOptionId(null);
      setGameStatus('playing');
      setWaitingMessage(null);
    };

    const handlePlayerAnswered = (data: { participantId: string; correct: boolean }) => {
      const player = playersRef.current.find(p => p.participantId === data.participantId);
      const isMe = player?.userId === authInfo.userId;
      if (!isMe) {
        setWaitingMessage(`${player?.username || 'Opponent'} has answered!`);
      } else if (!data.correct) {
        setWaitingMessage('Incorrect answer! Locked out for this round.');
      }
    };

    const handlePointAwarded = (data: { 
      participantId: string; 
      allScores: Record<string, number>; 
      correctOptionId: string; 
    }) => {
      setScores(data.allScores);
      setCorrectOptionId(data.correctOptionId);
      const winner = playersRef.current.find(p => p.participantId === data.participantId);
      setWaitingMessage(winner ? `${winner.username} wins this round!` : 'Round over!');
    };

    const handleQuestionTimeout = (data: { questionNumber: number; correctOptionId: string }) => {
      setWaitingMessage('Time up! Moving to the next question...');
      setCorrectOptionId(data.correctOptionId);
    };

    const handleGameEnd = (data: { scores: Record<string, number>; results: Results }) => {
      setScores(data.scores);
      setGameResults(data.results);
      setGameStatus('finished');
      setWaitingMessage(null);
      setCurrentQuestion(null);
    };
    
    socket.on('ff:match_found', handleMatchFound);
    socket.on('ff:new_question', handleNewQuestion);
    socket.on('ff:player_answered', handlePlayerAnswered);
    socket.on('ff:point_awarded', handlePointAwarded);
    socket.on('ff:question_timeout', handleQuestionTimeout);
    socket.on('ff:game_end', handleGameEnd);

    return () => {
      socket.off('ff:match_found');
      socket.off('ff:new_question');
      socket.off('ff:player_answered');
      socket.off('ff:point_awarded');
      socket.off('ff:question_timeout');
      socket.off('ff:game_end');
    };
  }, [isConnected, socket, authInfo]);

  // --- EFFECT 3 & 4 (Timers) ---
  useEffect(() => {
    if (gameStatus === 'playing' && questionTimeLeft > 0 && !hasAnswered) {
      const timer = setTimeout(() => setQuestionTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [gameStatus, questionTimeLeft, hasAnswered]);

  useEffect(() => {
    if ((gameStatus === 'playing' || gameStatus === 'answered' || gameStatus === 'waiting') && totalTimeLeft > 0) {
      const timer = setTimeout(() => setTotalTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [gameStatus, totalTimeLeft]);

  const getOptionStyle = (optionId: string) => {
    if (correctOptionId) {
      if (optionId === correctOptionId) return styles.optionCorrect;
      if (optionId === selectedOptionId && optionId !== correctOptionId) return styles.optionIncorrect;
      return styles.option;
    }
    if (hasAnswered && selectedOptionId === optionId) return styles.optionSelected;
    return styles.option;
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <QuizNavBar />
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={16} color={colors.foreground} />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.logo}>⚡ Fastest Finger</Text>
          <View style={{ width: 80 }} />
        </View>

        {errorMessage && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Feather name="zap" size={24} color={colors.yellow[500]} />
              <Text style={styles.cardTitle}>Fastest Finger First</Text>
            </View>
            <Text style={styles.cardDescription}>
              {gameStatus === 'idle' && "Configure your game settings"}
              {gameStatus === 'searching' && "Finding players for your match..."}
              {gameStatus === 'waiting' && "Match found! Get ready..."}
              {gameStatus === 'playing' && "Game in progress"}
              {gameStatus === 'answered' && "Waiting for next question..."}
              {gameStatus === 'finished' && "Game completed!"}
            </Text>
          </View>

          <View style={styles.cardContent}>
            {/* IDLE STATE - Game Settings */}
            {gameStatus === 'idle' && (
              <View>
                <View style={styles.settingsContainer}>
                  <View style={styles.settingItem}>
                    <Text style={styles.settingLabel}>Time per Question:</Text>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={timePerQuestion}
                        onValueChange={(value) => setTimePerQuestion(value as 10 | 20 | 30)}
                        style={styles.picker}
                        dropdownIconColor={colors.foreground}
                      >
                        <Picker.Item label="10 seconds" value={10} color={colors.foreground} />
                        <Picker.Item label="20 seconds" value={20} color={colors.foreground} />
                        <Picker.Item label="30 seconds" value={30} color={colors.foreground} />
                      </Picker>
                    </View>
                  </View>

                  <View style={styles.settingItem}>
                    <Text style={styles.settingLabel}>Game Duration:</Text>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={gameDuration}
                        onValueChange={(value) => setGameDuration(value as 1 | 2 | 5)}
                        style={styles.picker}
                        dropdownIconColor={colors.foreground}
                      >
                        <Picker.Item label="1 Minute" value={1} color={colors.foreground} />
                        <Picker.Item label="2 Minutes" value={2} color={colors.foreground} />
                        <Picker.Item label="5 Minutes" value={5} color={colors.foreground} />
                      </Picker>
                    </View>
                  </View>
                </View>

                <TouchableOpacity 
                  style={[
                    styles.findMatchButton, 
                    (!authInfo || !isConnected) && styles.buttonDisabled
                  ]} 
                  onPress={findMatch}
                  disabled={!authInfo || !isConnected || gameStatus === ('searching' as FFGameStatus)}
                >
                  <Text style={styles.findMatchButtonText}>
                    {gameStatus === ('searching' as FFGameStatus) ? "Finding Match..." : 
                     !isConnected ? "Connecting..." : "Find Match"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* SEARCHING STATE */}
            {gameStatus === 'searching' && (
              <View style={styles.statusContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.statusText}>🔍 Finding opponent...</Text>
              </View>
            )}

            {/* WAITING STATE */}
            {gameStatus === 'waiting' && (
              <View style={styles.statusContainer}>
                <ActivityIndicator size="large" color={colors.success} />
                <Text style={styles.statusText}>🎯 Match Found! Get Ready...</Text>
                {players.length > 0 && (
                  <View style={styles.playersContainer}>
                    {players.map((player, index) => (
                      <View key={player.participantId} style={styles.playerItem}>
                        <Image 
                          source={{ uri: player.avatarUrl || `https://i.pravatar.cc/150?u=${player.userId}` }} 
                          style={styles.playerAvatar} 
                        />
                        <Text style={styles.playerName}>
                          {player.userId === authInfo?.userId ? 'You' : (player.username || `Player ${index + 1}`)}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* PLAYING/ANSWERED STATE */}
            {(gameStatus === 'playing' || gameStatus === 'answered') && currentQuestion && (
              <View>
                {/* Game Header */}
                <View style={styles.gameHeader}>
                  <View style={styles.gameHeaderItem}>
                    <Text style={styles.gameHeaderText}>Q: {questionNumber}/{totalQuestions}</Text>
                  </View>
                  <View style={styles.gameHeaderItem}>
                    <Text style={styles.gameHeaderText}>GAME: {formatTime(totalTimeLeft)}</Text>
                  </View>
                  <View style={styles.gameHeaderItem}>
                    <Text style={styles.gameHeaderText}>TIME: {questionTimeLeft}s</Text>
                  </View>
                </View>

                {/* Score Board */}
                <View style={styles.scoreBoard}>
                  <Text style={styles.scoreText}>
                    {players.find(p => p.userId === authInfo?.userId)?.username || 'You'}: {myScore}
                  </Text>
                  <Text style={styles.scoreText}>
                    {opponent?.username || 'Opponent'}: {opponentScore}
                  </Text>
                </View>

                {/* Question */}
                <Text style={styles.questionText}>{currentQuestion.text}</Text>

                {/* Options */}
                <View style={styles.optionsContainer}>
                  {currentQuestion.options.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      style={getOptionStyle(option.id)}
                      onPress={() => handleAnswerClick(option.id)}
                      disabled={hasAnswered}
                    >
                      <Text style={styles.optionText}>{option.text}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Waiting Message */}
                {waitingMessage && (
                  <Text style={styles.waitingMessage}>{waitingMessage}</Text>
                )}
              </View>
            )}

            {/* FINISHED STATE */}
            {gameStatus === 'finished' && (
              <View>
                <View style={styles.statusContainer}>
                  <Text style={styles.gameOverTitle}>🏁 Game Over!</Text>
                  <Text style={styles.finalScoresTitle}>Final Scores:</Text>
                  <View style={styles.finalScoreBoard}>
                    <Text style={styles.finalScoreText}>
                      {players.find(p => p.userId === authInfo?.userId)?.username || 'You'}: {myScore}
                    </Text>
                    <Text style={styles.finalScoreText}>
                      {opponent?.username || 'Opponent'}: {opponentScore}
                    </Text>
                  </View>
                  
                  {/* Winner Declaration */}
                  <Text style={styles.winnerText}>
                    {myScore > opponentScore ? '🎉 You Won!' : 
                     myScore < opponentScore ? '😔 You Lost!' : '🤝 It\'s a Tie!'}
                  </Text>
                </View>

                <TouchableOpacity style={styles.playAgainButton} onPress={resetGame}>
                  <Text style={styles.playAgainButtonText}>Play Again</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Footer Info */}
            <View style={styles.footer}>
              <View style={styles.footerInfoRow}>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons name="trophy" size={16} color={colors["muted-foreground"]} />
                  <Text style={styles.infoText}>Top prize: 500 XP</Text>
                </View>
                <View style={styles.infoItem}>
                  <Feather name="clock" size={16} color={colors["muted-foreground"]} />
                  <Text style={styles.infoText}>{gameDuration} min game</Text>
                </View>
                <View style={styles.infoItem}>
                  <Feather name="zap" size={16} color={colors["muted-foreground"]} />
                  <Text style={styles.infoText}>{timePerQuestion}s per Q</Text>
                </View>
              </View>
              
              {gameStatus !== 'idle' && gameStatus !== 'finished' && (
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={() => {
                    resetGame();
                    router.back();
                  }}
                  disabled={gameStatus === 'playing' || gameStatus === 'answered'}
                >
                  <Text style={styles.cancelButtonText}>
                    {gameStatus === 'playing' || gameStatus === 'answered' ? 'Game in Progress' : 'Cancel'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background, 
    padding: 16 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 24 
  },
  backButton: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  backButtonText: { 
    color: colors.foreground, 
    marginLeft: 8 
  },
  logo: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: colors.foreground 
  },
  errorContainer: {
    backgroundColor: colors.error,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  card: { 
    backgroundColor: colors.card, 
    borderWidth: 1, 
    borderColor: colors.border, 
    borderRadius: 12 
  },
  cardHeader: { 
    alignItems: 'center', 
    padding: 16, 
    borderBottomWidth: 1, 
    borderColor: colors.border 
  },
  cardTitleContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 4 
  },
  cardTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: colors["card-foreground"], 
    marginLeft: 8 
  },
  cardDescription: { 
    color: colors["muted-foreground"],
    textAlign: 'center',
  },
  cardContent: { 
    padding: 16 
  },
  settingsContainer: {
    marginBottom: 24,
  },
  settingItem: {
    marginBottom: 16,
  },
  settingLabel: {
    color: colors.foreground,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.card,
  },
  picker: {
    color: colors.foreground,
    height: 50,
  },
  findMatchButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  findMatchButtonText: {
    color: colors["primary-foreground"],
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  statusContainer: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 32 
  },
  statusText: { 
    color: colors["muted-foreground"], 
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  playersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    width: '100%',
  },
  playerItem: {
    alignItems: 'center',
  },
  playerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 8,
  },
  playerName: {
    color: colors.foreground,
    fontSize: 12,
    fontWeight: '500',
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  gameHeaderItem: {
    backgroundColor: colors.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  gameHeaderText: {
    color: colors.foreground,
    fontSize: 12,
    fontWeight: '500',
  },
  scoreBoard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.border,
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  scoreText: {
    color: colors.foreground,
    fontSize: 18,
    fontWeight: 'bold',
  },
  questionText: {
    color: colors.foreground,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
    minHeight: 60,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    padding: 16,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: 8,
    alignItems: 'center',
  },
  optionSelected: {
    padding: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.border,
    borderRadius: 8,
    alignItems: 'center',
  },
  optionCorrect: {
    padding: 16,
    borderWidth: 2,
    borderColor: colors.success,
    backgroundColor: colors.success + '20',
    borderRadius: 8,
    alignItems: 'center',
  },
  optionIncorrect: {
    padding: 16,
    borderWidth: 2,
    borderColor: colors.error,
    backgroundColor: colors.error + '20',
    borderRadius: 8,
    alignItems: 'center',
  },
  optionText: {
    color: colors.foreground,
    fontSize: 16,
    textAlign: 'center',
  },
  waitingMessage: {
    color: colors["muted-foreground"],
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
  gameOverTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.foreground,
    textAlign: 'center',
    marginBottom: 16,
  },
  finalScoresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.foreground,
    textAlign: 'center',
    marginBottom: 12,
  },
  finalScoreBoard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.border,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  finalScoreText: {
    color: colors.foreground,
    fontSize: 18,
    fontWeight: 'bold',
  },
  winnerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.yellow[500],
    textAlign: 'center',
    marginBottom: 16,
  },
  playAgainButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  playAgainButtonText: {
    color: colors["primary-foreground"],
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressContainer: { 
    height: 8, 
    backgroundColor: colors.border, 
    borderRadius: 4, 
    overflow: 'hidden', 
    marginBottom: 24 
  },
  progressBar: { 
    height: '100%', 
    backgroundColor: colors.primary 
  },
  footer: { 
    marginTop: 24 
  },
  footerInfoRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 16 
  },
  infoItem: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  infoText: { 
    marginLeft: 4, 
    color: colors["muted-foreground"], 
    fontSize: 12 
  },
  cancelButton: { 
    borderWidth: 1, 
    borderColor: colors.border, 
    borderRadius: 8, 
    padding: 12, 
    alignItems: 'center' 
  },
  cancelButtonText: { 
    color: colors.foreground 
  },
});

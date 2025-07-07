import { Feather } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from "react";
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

interface Player {
  participantId: string;
  userId: string;
  username?: string;
  avatarUrl?: string;
  isBot?: boolean;
}

interface Question {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
}

interface AnswerData {
  questionId: string;
  timeTaken: number;
  action: "answered" | "skipped" | "timeout";
  correct?: boolean;
}

interface PowerUps {
  hint: number;
  skip: number;
  doubleXP: number;
  extraTime: number;
}

interface BotAction {
  type: 'answer' | 'skip';
  questionId: string;
  optionId?: string;
  timeTaken: number;
}

const LiveDuel: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const sessionId = params.sessionId as string;
  const players = params.players ? JSON.parse(params.players as string) : [];
  const duration = parseInt(params.duration as string) || 2;

  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [flashColor, setFlashColor] = useState<string | null>(null);
  const [powerUps, setPowerUps] = useState<PowerUps>({ hint: 2, skip: 1, doubleXP: 1, extraTime: 1 });
  const [usedPowerUp, setUsedPowerUp] = useState<string | null>(null);
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [waitingMessage, setWaitingMessage] = useState<string | null>(null);
  const [gameResults, setGameResults] = useState<Record<string, AnswerData[]> | null>(null);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'finished'>('idle');

  const me = players.find((p: Player) => !p.isBot);
  const opponent = players.find((p: Player) => p.isBot || p.participantId !== me?.participantId);

  // Debug logs for player identification
  useEffect(() => {
    if (me || opponent) {
      console.log('Players:', {
        me: { id: me?.participantId, isBot: me?.isBot },
        opponent: { id: opponent?.participantId, isBot: opponent?.isBot }
      });
    }
  }, [me, opponent]);

  // Handle game over
  const handleGameOver = useCallback(() => {
    setGameStatus('finished');
    socket.emit('game:end', {
      sessionId,
      participantId: me?.participantId,
    });
  }, [sessionId, me?.participantId]);

  // Initialize game
  useEffect(() => {
    if (!sessionId) {
      Alert.alert('Error', 'Invalid session');
      router.back();
      return;
    }

    // Set initial game status and timer
    setGameStatus('playing');
    setTimeLeft(duration * 60);

    // Initialize scores for both players
    if (me?.participantId && opponent?.participantId) {
      setScores({
        [me.participantId]: 0,
        [opponent.participantId]: 0
      });
    }

    // Register for the game session
    socket.emit('game:register-participant', {
      sessionId,
      participantId: me?.participantId
    });

    // Request first question
    socket.emit('quickduel:request_first_question', {
      sessionId,
      participantId: me?.participantId
    });
  }, [sessionId, duration, router, me?.participantId, opponent?.participantId]);

  // Game timer effect - only this should end the game
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(timer);
          handleGameOver();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStatus, handleGameOver]);

  // Update socket event listeners
  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      // Re-register and request question if reconnecting
      if (sessionId && me?.participantId && gameStatus === 'playing') {
        socket.emit('game:register-participant', {
          sessionId,
          participantId: me.participantId
        });
      }
    };

    const onDisconnect = () => setIsConnected(false);

    const onNewQuestion = (question: Question) => {
      if (gameStatus === 'playing') {
        console.log('New question received:', question);
        setCurrentQuestion(question);
        setSelectedAnswer(null);
        setShowResult(false);
        setUsedPowerUp(null);
        setEliminatedOptions([]);
        setWaitingMessage(null);
      }
    };

    const onScoreUpdate = (newScores: Record<string, number>) => {
      console.log('Score update received:', newScores);
      setScores(prev => ({
        ...prev,
        ...newScores
      }));
    };

    const onGameEnd = (data: { scores: Record<string, number>; results: Record<string, AnswerData[]> }) => {
      setGameStatus('finished');
      setGameResults(data.results);

      // Update final scores
      setScores(data.scores);

      const myScore = data.scores[me?.participantId] || 0;
      const oppScore = data.scores[opponent?.participantId] || 0;

      Alert.alert(
        'Game Over!',
        `Final Score:\nYou: ${myScore}\nOpponent: ${oppScore}`,
        [{
          text: 'View Results',
          onPress: () => router.push({
            pathname: '/quiz-pages/post-match-results',
            params: {
              results: JSON.stringify(data.results),
              scores: JSON.stringify(data.scores),
              players: JSON.stringify(players)
            }
          })
        }]
      );
    };

    const onGameError = (error: { message: string }) => {
      Alert.alert('Error', error.message, [
        { text: 'OK', onPress: () => router.back() }
      ]);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('question:new', onNewQuestion);
    socket.on('score:update', onScoreUpdate);
    socket.on('game:end', onGameEnd);
    socket.on('game:error', onGameError);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('question:new', onNewQuestion);
      socket.off('score:update', onScoreUpdate);
      socket.off('game:end', onGameEnd);
      socket.off('game:error', onGameError);
    };
  }, [sessionId, me?.participantId, opponent, players, router, gameStatus]);

  const handleAnswerClick = useCallback((optionId: string) => {
    if (selectedAnswer !== null || !sessionId || !currentQuestion || !me?.participantId || gameStatus !== 'playing') return;

    const timeTaken = duration * 60 - timeLeft;
    setSelectedAnswer(optionId);

    socket.emit('answer:submit', {
      sessionId,
      participantId: me.participantId,
      questionId: currentQuestion.id,
      optionId,
      timeTaken,
      powerUp: usedPowerUp
    });

    // Show result immediately
    setShowResult(true);
    const isCorrect = optionId === currentQuestion.correctAnswer;
    setFlashColor(isCorrect ? "#bbf7d0" : "#fee2e2");
    setTimeout(() => setFlashColor(null), 300);

    // Request next question after a delay
    setTimeout(() => {
      if (gameStatus === 'playing') {
        setQuestionNumber(prev => prev + 1);
        setWaitingMessage("Waiting for next question...");
        socket.emit('quickduel:request_next_question', {
          sessionId,
          participantId: me.participantId
        });
      }
    }, 1500);
  }, [sessionId, currentQuestion, selectedAnswer, me, duration, timeLeft, usedPowerUp, gameStatus]);

  const powerUpFunctions = {
    hint: () => {
      if (powerUps.hint <= 0 || selectedAnswer !== null || !currentQuestion) return;
      setPowerUps(prev => ({ ...prev, hint: prev.hint - 1 }));
      setUsedPowerUp("hint");

      socket.emit('powerup:use', {
        sessionId,
        participantId: me?.participantId,
        type: 'hint'
      });

      // Eliminate one wrong answer
      const wrongOptions = currentQuestion.options
        .filter(opt => opt.id !== currentQuestion.correctAnswer)
        .map(opt => opt.id);
      const randomWrong = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
      setEliminatedOptions([randomWrong]);
    },
    skip: () => {
      if (powerUps.skip <= 0 || selectedAnswer !== null || !me?.participantId) return;
      setPowerUps(prev => ({ ...prev, skip: prev.skip - 1 }));
      setUsedPowerUp("skip");

      socket.emit('answer:submit', {
        sessionId,
        participantId: me.participantId,
        questionId: currentQuestion?.id,
        action: 'skipped'
      });

      setWaitingMessage("Skipping question...");
      socket.emit('quickduel:request_next_question', {
        sessionId,
        participantId: me.participantId
      });
    },
    extraTime: () => {
      if (powerUps.extraTime <= 0 || selectedAnswer !== null) return;
      setPowerUps(prev => ({ ...prev, extraTime: prev.extraTime - 1 }));
      setTimeLeft(prev => prev + 15);
      setUsedPowerUp("extraTime");

      socket.emit('powerup:use', {
        sessionId,
        participantId: me?.participantId,
        type: 'extraTime'
      });
    },
    doubleXP: () => {
      if (powerUps.doubleXP <= 0 || selectedAnswer !== null) return;
      setPowerUps(prev => ({ ...prev, doubleXP: prev.doubleXP - 1 }));
      setUsedPowerUp("doubleXP");

      socket.emit('powerup:use', {
        sessionId,
        participantId: me?.participantId,
        type: 'doubleXP'
      });
    },
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isConnected) {
    return (
      <View style={styles.connectionError}>
        <ActivityIndicator size="large" color="#A3E635" />
        <Text style={styles.connectionErrorText}>Connecting to game server...</Text>
      </View>
    );
  }

  // Update the JSX to show game status
  return (
    <>
      <QuizNavBar />
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        style={[
          styles.container,
          flashColor ? { backgroundColor: flashColor } : {},
          gameStatus === 'finished' ? styles.finishedContainer : {}
        ]}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Game Status Indicator */}
        {gameStatus === 'finished' && (
          <View style={styles.gameOverBanner}>
            <Text style={styles.gameOverText}>Game Over!</Text>
          </View>
        )}

        {/* Timer and Question Info */}
        <View style={styles.headerRow}>
          <View style={styles.badgeOutline}>
            <Text style={styles.badgeText}>Question {questionNumber}</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Feather name="clock" size={22} color="#94a3b8" />
            <View style={[
              styles.timerCircle,
              timeLeft <= 10 ? styles.timerWarning : null,
              gameStatus === 'finished' ? styles.timerFinished : null
            ]}>
              <Text style={[
                styles.timerText,
                timeLeft <= 10 ? styles.timerTextWarning : null,
                gameStatus === 'finished' ? styles.timerTextFinished : null
              ]}>
                {formatTime(timeLeft)}
              </Text>
            </View>
          </View>
          <View style={[styles.badgeOutline, { borderColor: "rgba(163, 230, 53, 0.2)", backgroundColor: "rgba(163, 230, 53, 0.1)" }]}>
            <Text style={[styles.badgeText, { color: "#A3E635" }]}>+{usedPowerUp === "doubleXP" ? "50" : "25"} XP</Text>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressBarWrap}>
          <View style={[styles.progressBar, { width: `${(questionNumber / 10) * 100}%` }]} />
        </View>

        {/* Question */}
        {currentQuestion ? (
          <LinearGradient
            colors={['rgba(163, 230, 53, 0.1)', 'rgba(56, 189, 248, 0.1)']}
            style={styles.card}
          >
            <Text style={styles.questionText}>{currentQuestion.text}</Text>
            {currentQuestion.options.map((option) => {
              const isEliminated = eliminatedOptions.includes(option.id);
              const isSelected = selectedAnswer === option.id;
              const isCorrect = option.id === currentQuestion.correctAnswer;

              let btnStyle = [styles.answerButton];
              if (isEliminated) btnStyle.push(styles.answerEliminated);
              else if (selectedAnswer === null) btnStyle.push(styles.answerDefault);
              else if (isSelected && isCorrect) btnStyle.push(styles.answerCorrect);
              else if (isSelected && !isCorrect) btnStyle.push(styles.answerWrong);
              else if (isCorrect && showResult) btnStyle.push(styles.answerCorrect);
              else if (selectedAnswer !== null) btnStyle.push(styles.answerDim);

              return (
                <TouchableOpacity
                  key={option.id}
                  style={btnStyle}
                  onPress={() => handleAnswerClick(option.id)}
                  disabled={selectedAnswer !== null || isEliminated}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                    <Text style={[styles.answerText, isEliminated && styles.answerTextEliminated]}>
                      {option.text}
                    </Text>
                    {showResult && isSelected && (
                      isCorrect ? (
                        <Feather name="check-circle" size={20} color="#A3E635" />
                      ) : (
                        <Feather name="x" size={20} color="#ef4444" />
                      )
                    )}
                    {showResult && isCorrect && selectedAnswer !== option.id && (
                      <Feather name="check-circle" size={20} color="#A3E635" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </LinearGradient>
        ) : (
          <View style={styles.waitingContainer}>
            <ActivityIndicator size="large" color="#A3E635" />
            <Text style={styles.waitingText}>{waitingMessage || "Loading question..."}</Text>
          </View>
        )}

        {/* Power-ups */}
        <View style={styles.powerUpsRow}>
          <TouchableOpacity
            style={[styles.powerUpChip, { backgroundColor: powerUps.hint > 0 ? "rgba(234, 179, 8, 0.2)" : "rgba(0, 0, 0, 0.2)" }]}
            onPress={powerUpFunctions.hint}
            disabled={selectedAnswer !== null || powerUps.hint <= 0}
          >
            <Feather name="alert-circle" size={18} color="#fde047" style={{ marginRight: 4 }} />
            <Text style={[styles.powerUpText, { color: powerUps.hint > 0 ? "#fde047" : "#94a3b8" }]}>
              Hint ({powerUps.hint})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.powerUpChip, { backgroundColor: powerUps.skip > 0 ? "rgba(56, 189, 248, 0.2)" : "rgba(0, 0, 0, 0.2)" }]}
            onPress={powerUpFunctions.skip}
            disabled={selectedAnswer !== null || powerUps.skip <= 0}
          >
            <Feather name="skip-forward" size={18} color="#38bdf8" style={{ marginRight: 4 }} />
            <Text style={[styles.powerUpText, { color: powerUps.skip > 0 ? "#38bdf8" : "#94a3b8" }]}>
              Skip ({powerUps.skip})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.powerUpChip, { backgroundColor: powerUps.extraTime > 0 ? "rgba(163, 230, 53, 0.2)" : "rgba(0, 0, 0, 0.2)" }]}
            onPress={powerUpFunctions.extraTime}
            disabled={selectedAnswer !== null || powerUps.extraTime <= 0}
          >
            <Feather name="clock" size={18} color="#A3E635" style={{ marginRight: 4 }} />
            <Text style={[styles.powerUpText, { color: powerUps.extraTime > 0 ? "#A3E635" : "#94a3b8" }]}>
              +Time ({powerUps.extraTime})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.powerUpChip, { backgroundColor: powerUps.doubleXP > 0 ? "rgba(167, 139, 250, 0.2)" : "rgba(0, 0, 0, 0.2)" }]}
            onPress={powerUpFunctions.doubleXP}
            disabled={selectedAnswer !== null || powerUps.doubleXP <= 0}
          >
            <Feather name="zap" size={18} color="#a78bfa" style={{ marginRight: 4 }} />
            <Text style={[styles.powerUpText, { color: powerUps.doubleXP > 0 ? "#a78bfa" : "#94a3b8" }]}>
              2x XP ({powerUps.doubleXP})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Player Tracker */}
        <LinearGradient
          colors={['rgba(163, 230, 53, 0.1)', 'rgba(56, 189, 248, 0.1)']}
          style={styles.cardPlayer}
        >
          <View style={styles.playerRow}>
            <View style={styles.playerCol}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{me?.username?.[0] || 'Y'}</Text>
              </View>
              <Text style={styles.playerName}>{me?.username || 'You'}</Text>
              <Text style={styles.playerScore}>{scores[me?.participantId] || 0}</Text>
            </View>
            <View style={styles.liveCol}>
              <Text style={styles.liveLabel}>Options Trading</Text>
              <View style={styles.liveRow}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
                <View style={styles.liveDot} />
              </View>
            </View>
            <View style={styles.playerCol}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{opponent?.username?.[0] || 'O'}</Text>
              </View>
              <Text style={styles.playerName}>
                {opponent?.username || (opponent?.isBot ? 'Bot' : 'Opponent')}
              </Text>
              <Text style={styles.playerScore}>{scores[opponent?.participantId] || 0}</Text>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242620",
    padding: 16
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  },
  badgeOutline: {
    borderWidth: 1,
    borderColor: "rgba(163, 230, 53, 0.2)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: "rgba(0, 0, 0, 0.2)"
  },
  badgeText: {
    color: "#94a3b8",
    fontWeight: "bold",
    fontSize: 13
  },
  timerCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: "#A3E635",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    backgroundColor: "rgba(163, 230, 53, 0.1)"
  },
  timerText: {
    color: "#A3E635",
    fontWeight: "bold",
    fontSize: 16
  },
  progressBarWrap: {
    height: 8,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 8,
    marginBottom: 12,
    marginTop: 4
  },
  progressBar: {
    height: 8,
    backgroundColor: "#A3E635",
    borderRadius: 8
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(163, 230, 53, 0.2)"
  },
  questionText: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 12,
    color: "#fff"
  },
  answerButton: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(163, 230, 53, 0.2)"
  },
  answerDefault: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(163, 230, 53, 0.2)",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 8
  },
  answerCorrect: {
    backgroundColor: "rgba(163, 230, 53, 0.2)",
    borderColor: "#A3E635",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1
  },
  answerWrong: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    borderColor: "#ef4444",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1
  },
  answerEliminated: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    opacity: 0.3,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(163, 230, 53, 0.2)"
  },
  answerDim: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    opacity: 0.5,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(163, 230, 53, 0.2)"
  },
  answerText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#fff"
  },
  answerTextEliminated: {
    textDecorationLine: "line-through",
    color: "#94a3b8"
  },
  powerUpsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 8
  },
  powerUpChip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "rgba(163, 230, 53, 0.2)"
  },
  powerUpText: {
    fontWeight: "bold",
    fontSize: 13
  },
  cardPlayer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(163, 230, 53, 0.2)"
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  playerCol: {
    alignItems: "center",
    flex: 1
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(163, 230, 53, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4
  },
  avatarText: {
    color: "#A3E635",
    fontWeight: "bold"
  },
  playerName: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#94a3b8"
  },
  playerScore: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#A3E635"
  },
  liveCol: {
    alignItems: "center",
    flex: 1
  },
  liveLabel: {
    fontSize: 11,
    color: "#94a3b8",
    marginBottom: 2
  },
  liveRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#A3E635",
    marginHorizontal: 2
  },
  liveText: {
    color: "#A3E635",
    fontWeight: "bold",
    fontSize: 13,
    marginHorizontal: 2
  },
  connectionError: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#242620',
    padding: 20,
  },
  connectionErrorText: {
    color: '#A3E635',
    marginTop: 10,
    fontSize: 16,
  },
  waitingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  waitingText: {
    color: '#94a3b8',
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  timerWarning: {
    borderColor: '#ef4444',
  },
  timerTextWarning: {
    color: '#ef4444',
  },
  finishedContainer: {
    opacity: 0.7,
  },
  gameOverBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  gameOverText: {
    color: '#ef4444',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timerFinished: {
    borderColor: '#94a3b8',
    opacity: 0.5,
  },
  timerTextFinished: {
    color: '#94a3b8',
  },
});

export default LiveDuel; 
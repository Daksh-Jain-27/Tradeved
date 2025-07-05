import { Feather } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QuizNavBar from "../../components/QuizNavBar";
import { useAuth } from "../../lib/auth-context";
import { socketManager } from "../../lib/socket";

interface Question {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correctAnswerId: string;
}

interface Player {
  participantId: string;
  userId: string;
  username?: string;
  avatarUrl?: string;
}

const LiveDuel: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isAuthenticated, userId, token } = useAuth();
  
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [yourScore, setYourScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [opponentAnswered, setOpponentAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [flashColor, setFlashColor] = useState<string | null>(null);
  const [powerUps, setPowerUps] = useState({ hint: 2, skip: 1, doubleXP: 1, extraTime: 1 });
  const [usedPowerUp, setUsedPowerUp] = useState<string | null>(null);
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);
  const [sessionId] = useState(params.sessionId as string);
  const [players] = useState<Player[]>(JSON.parse(params.players as string));
  const [gameStatus, setGameStatus] = useState<'playing' | 'finished'>('playing');

  // Add a function to calculate progress
  const calculateProgress = (questionId: string | undefined) => {
    if (!questionId) return 0;
    const questionNumber = parseInt(questionId.split('-')[0] || '0', 10);
    return (questionNumber / 10) * 100;
  };

  useEffect(() => {
    if (!isAuthenticated) {
      Alert.alert('Error', 'Authentication required');
      router.back();
      return;
    }

    const initializeGame = async () => {
      try {
        const myPlayer = players.find(p => p.userId === userId);
        if (!myPlayer) {
          Alert.alert('Error', 'Player information not found');
          router.back();
          return;
        }

        // Register as participant
        socketManager.emit('game:register-participant', {
          participantId: myPlayer.participantId,
          sessionId: sessionId
        });

        // Setup game event listeners
        socketManager.on('question:new', handleNewQuestion);
        socketManager.on('score:update', handleScoreUpdate);
        socketManager.on('game:end', handleGameEnd);
        socketManager.on('powerup:hint-result', handleHintResult);
        socketManager.on('opponent:answered', handleOpponentAnswer);
      } catch (error) {
        console.error('Game initialization error:', error);
        Alert.alert('Error', 'Failed to initialize game');
        router.back();
      }
    };

    initializeGame();

    return () => {
      socketManager.off('question:new');
      socketManager.off('score:update');
      socketManager.off('game:end');
      socketManager.off('powerup:hint-result');
      socketManager.off('opponent:answered');
    };
  }, [isAuthenticated, userId, sessionId, players]);

  useEffect(() => {
    if (timeLeft <= 0) {
      router.push('/quiz-pages/post-match-results');
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleNewQuestion = (question: Question) => {
    setCurrentQuestion(question);
    setSelectedAnswer(null);
    setShowResult(false);
    setOpponentAnswered(false);
    setUsedPowerUp(null);
    setEliminatedOptions([]);
    setTimeLeft(30); // Reset timer for new question
  };

  const handleScoreUpdate = (scores: Record<string, number>) => {
    if (!userId) return;
    
    const opponent = players.find(p => p.userId !== userId);
    if (opponent) {
      setOpponentScore(scores[opponent.participantId] || 0);
    }
    
    const myPlayer = players.find(p => p.userId === userId);
    if (myPlayer) {
      setYourScore(scores[myPlayer.participantId] || 0);
    }
  };

  const handleGameEnd = (data: { scores: Record<string, number> }) => {
    setGameStatus('finished');
    handleScoreUpdate(data.scores);
    setTimeout(() => {
      router.push('/quiz-pages/post-match-results');
    }, 2000);
  };

  const handleHintResult = (data: { eliminatedOptionId: string }) => {
    setEliminatedOptions(prev => [...prev, data.eliminatedOptionId]);
  };

  const handleOpponentAnswer = () => {
    setOpponentAnswered(true);
  };

  const handleAnswerSelect = (optionId: string) => {
    if (selectedAnswer !== null || eliminatedOptions.includes(optionId)) return;
    
    setSelectedAnswer(optionId);
    setShowResult(true);
    
    const myPlayer = players.find(p => p.userId === userId);
    if (!myPlayer) return;

    socketManager.emit('answer:submit', {
      sessionId,
      participantId: myPlayer.participantId,
      questionId: currentQuestion?.id,
      optionId
    });

    // Visual feedback
    const isCorrect = optionId === currentQuestion?.correctAnswerId;
    setFlashColor(isCorrect ? "#bbf7d0" : "#fee2e2");
    setTimeout(() => setFlashColor(null), 300);
  };

  const powerUpFunctions = {
    hint: () => {
      if (powerUps.hint <= 0 || selectedAnswer !== null) return;
      setPowerUps((prev) => ({ ...prev, hint: prev.hint - 1 }));
      setUsedPowerUp("hint");
      // Request hint from server
      socketManager.emit('powerup:hint', { sessionId });
    },
    skip: () => {
      if (powerUps.skip <= 0 || selectedAnswer !== null) return;
      setPowerUps((prev) => ({ ...prev, skip: prev.skip - 1 }));
      socketManager.emit('question:skip', { 
        sessionId,
        participantId: players.find(p => p.userId === userId)?.participantId
      });
      setUsedPowerUp("skip");
    },
    extraTime: () => {
      if (powerUps.extraTime <= 0 || selectedAnswer !== null) return;
      setPowerUps((prev) => ({ ...prev, extraTime: prev.extraTime - 1 }));
      setTimeLeft((prev) => prev + 15);
      setUsedPowerUp("extraTime");
      socketManager.emit('powerup:extraTime', { sessionId });
    },
    doubleXP: () => {
      if (powerUps.doubleXP <= 0 || selectedAnswer !== null) return;
      setPowerUps((prev) => ({ ...prev, doubleXP: prev.doubleXP - 1 }));
      setUsedPowerUp("doubleXP");
      socketManager.emit('powerup:doubleXP', { sessionId });
    },
  };

  return (
    <>
      <QuizNavBar />
      <Stack.Screen
        options={{
          headerShown: false
        }}
      />
      <ScrollView style={[styles.container, flashColor ? { backgroundColor: flashColor } : {}]} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.badgeOutline}>
            <Text style={styles.badgeText}>
              Round {currentQuestion?.id ? parseInt(currentQuestion.id.split('-')[0] || '0', 10) : 0}/10
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Feather name="clock" size={22} color="#94a3b8" />
            <View style={styles.timerCircle}><Text style={styles.timerText}>{timeLeft}s</Text></View>
          </View>
          <View style={[styles.badgeOutline, { borderColor: "rgba(163, 230, 53, 0.2)", backgroundColor: "rgba(163, 230, 53, 0.1)" }]}>
            <Text style={[styles.badgeText, { color: "#A3E635" }]}>+{usedPowerUp === "doubleXP" ? "50" : "25"} XP</Text>
          </View>
        </View>
        {/* Progress */}
        <View style={styles.progressBarWrap}>
          <View style={[styles.progressBar, { width: `${calculateProgress(currentQuestion?.id)}%` }]} />
        </View>
        {/* Question */}
        <LinearGradient
          colors={['rgba(163, 230, 53, 0.1)', 'rgba(56, 189, 248, 0.1)']}
          style={styles.card}
        >
          <Text style={styles.questionText}>{currentQuestion?.text}</Text>
          {currentQuestion?.options.map((option) => {
            const isEliminated = eliminatedOptions.includes(option.id);
            const isSelected = selectedAnswer === option.id;
            const isCorrect = option.id === currentQuestion?.correctAnswerId;
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
                onPress={() => handleAnswerSelect(option.id)}
                disabled={selectedAnswer !== null || isEliminated}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <Text style={[styles.answerText, isEliminated && styles.answerTextEliminated]}>{option.text}</Text>
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
        {/* Power-ups */}
        <View style={styles.powerUpsRow}>
          <TouchableOpacity
            style={[styles.powerUpChip, { backgroundColor: powerUps.hint > 0 ? "rgba(234, 179, 8, 0.2)" : "rgba(0, 0, 0, 0.2)" }]}
            onPress={powerUpFunctions.hint}
            disabled={selectedAnswer !== null || powerUps.hint <= 0}
          >
            <Feather name="alert-circle" size={18} color="#fde047" style={{ marginRight: 4 }} />
            <Text style={[styles.powerUpText, { color: powerUps.hint > 0 ? "#fde047" : "#94a3b8" }]}>Hint ({powerUps.hint})</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.powerUpChip, { backgroundColor: powerUps.skip > 0 ? "rgba(56, 189, 248, 0.2)" : "rgba(0, 0, 0, 0.2)" }]}
            onPress={powerUpFunctions.skip}
            disabled={selectedAnswer !== null || powerUps.skip <= 0}
          >
            <Feather name="skip-forward" size={18} color="#38bdf8" style={{ marginRight: 4 }} />
            <Text style={[styles.powerUpText, { color: powerUps.skip > 0 ? "#38bdf8" : "#94a3b8" }]}>Skip ({powerUps.skip})</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.powerUpChip, { backgroundColor: powerUps.extraTime > 0 ? "rgba(163, 230, 53, 0.2)" : "rgba(0, 0, 0, 0.2)" }]}
            onPress={powerUpFunctions.extraTime}
            disabled={selectedAnswer !== null || powerUps.extraTime <= 0}
          >
            <Feather name="clock" size={18} color="#A3E635" style={{ marginRight: 4 }} />
            <Text style={[styles.powerUpText, { color: powerUps.extraTime > 0 ? "#A3E635" : "#94a3b8" }]}>+Time ({powerUps.extraTime})</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.powerUpChip, { backgroundColor: powerUps.doubleXP > 0 ? "rgba(167, 139, 250, 0.2)" : "rgba(0, 0, 0, 0.2)" }]}
            onPress={powerUpFunctions.doubleXP}
            disabled={selectedAnswer !== null || powerUps.doubleXP <= 0}
          >
            <Feather name="zap" size={18} color="#a78bfa" style={{ marginRight: 4 }} />
            <Text style={[styles.powerUpText, { color: powerUps.doubleXP > 0 ? "#a78bfa" : "#94a3b8" }]}>2x XP ({powerUps.doubleXP})</Text>
          </TouchableOpacity>
        </View>
        {/* Player Tracker */}
        <LinearGradient
          colors={['rgba(163, 230, 53, 0.1)', 'rgba(56, 189, 248, 0.1)']}
          style={styles.cardPlayer}
        >
          <View style={styles.playerRow}>
            <View style={styles.playerCol}>
              <View style={styles.avatarCircle}><Text style={styles.avatarText}>You</Text></View>
              <Text style={styles.playerName}>You</Text>
              <Text style={styles.playerScore}>{yourScore}</Text>
            </View>
            <View style={styles.liveCol}>
              <Text style={styles.liveLabel}>Options Trading</Text>
              <View style={styles.liveRow}>
                <View style={styles.liveDot} /><Text style={styles.liveText}>LIVE</Text><View style={styles.liveDot} />
              </View>
            </View>
            <View style={styles.playerCol}>
              <View style={styles.avatarCircle}><Text style={styles.avatarText}>AT</Text></View>
              <Text style={styles.playerName}>Alex_Trader</Text>
              <Text style={styles.playerScore}>{opponentScore}</Text>
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
});

export default LiveDuel; 
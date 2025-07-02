import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import QuizNavBar from "../../../components/QuizNavBar";
import { Stack, useRouter } from 'expo-router';

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

const questions = [
  { id: 1, text: "What is the primary purpose of a stop-loss order?", options: ["To automatically buy more shares when the price drops", "To limit potential losses on a position", "To increase leverage on a trade", "To prevent buying at high prices"], correctAnswer: 1 },
  { id: 2, text: "Which chart pattern often signals a trend reversal?", options: ["Double top", "Ascending triangle", "Bull flag", "Rising wedge"], correctAnswer: 0 },
  { id: 3, text: "What does EMA stand for in technical analysis?", options: ["Equal Moving Average", "Exponential Market Analysis", "Exponential Moving Average", "Extended Market Average"], correctAnswer: 2 },
  { id: 4, text: "Which of these is NOT a common candlestick pattern?", options: ["Doji", "Hammer", "Shooting Star", "Rising Phoenix"], correctAnswer: 3 },
  { id: 5, text: "What is the typical percentage used for the Kelly Criterion in risk management?", options: ["10%", "25%", "50%", "75%"], correctAnswer: 1 },
];

const CircularProgress = ({ value, size = 40, strokeWidth = 4 }: { value: number, size?: number, strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  // This is a simplified representation. A real implementation would use SVG or a library.
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStatus, setGameStatus] = useState<"playing" | "finished">("playing");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);

  useEffect(() => {
    if (gameStatus === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameStatus("finished");
    }
  }, [timeLeft, gameStatus]);

  const handleOptionSelect = (optionIndex: number) => {
    if (selectedOption !== null || gameStatus === "finished") return;
    setSelectedOption(optionIndex);
    if (optionIndex === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
      setFeedback("correct");
    } else {
      setFeedback("incorrect");
    }
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
        setFeedback(null);
      } else {
        setGameStatus("finished");
      }
    }, 1000);
  };

  const handlePlayAgain = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setTimeLeft(60);
    setGameStatus("playing");
    setFeedback(null);
  };

  const currentQuestion = questions[currentQuestionIndex];

  const GameContent = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={styles.badge}><Text style={styles.badgeText}>Question {currentQuestionIndex + 1}/{questions.length}</Text></View>
          <CircularProgress value={(timeLeft / 60) * 100} />
        </View>
        <Text style={styles.questionText}>{currentQuestion.text}</Text>
      </View>
      <View style={styles.cardContent}>
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedOption === index;
          const isCorrect = index === currentQuestion.correctAnswer;
          let buttonStyle = styles.optionButton;
          let textStyle = styles.optionText;
          let icon = <View style={styles.optionIcon}><Text style={styles.optionIconText}>{String.fromCharCode(65 + index)}</Text></View>;

          if (isSelected) {
            buttonStyle = isCorrect ? styles.correctButton : styles.incorrectButton;
            textStyle = { ...textStyle, color: isCorrect ? colors['green-500'] : colors['red-500'] }
            icon = isCorrect ? <Feather name="check-circle" size={20} color={colors['green-500']} style={{ marginRight: 8 }} /> : <Feather name="x-circle" size={20} color={colors['red-500']} style={{ marginRight: 8 }} />
          } else if (selectedOption !== null && isCorrect) {
            buttonStyle = styles.correctButton;
            textStyle = { ...textStyle, color: colors['green-500'] }
          }

          return (
            <TouchableOpacity key={index} style={buttonStyle} onPress={() => handleOptionSelect(index)} disabled={selectedOption !== null}>
              {icon}
              <Text style={textStyle}>{option}</Text>
            </TouchableOpacity>
          )
        })}
        {feedback && (
          <View style={[styles.feedbackBox, { backgroundColor: feedback === 'correct' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
            <Feather name={feedback === 'correct' ? 'check-circle' : 'x-circle'} size={20} color={feedback === 'correct' ? colors['green-500'] : colors['red-500']} />
            <Text style={{ color: feedback === 'correct' ? colors['green-500'] : colors['red-500'], marginLeft: 8 }}>{feedback === 'correct' ? 'Correct!' : 'Incorrect!'}</Text>
          </View>
        )}
      </View>
    </View>
  );

  const ResultsContent = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={[styles.questionText, { textAlign: 'center' }]}>Time Attack Results</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={{ alignItems: 'center', marginVertical: 24 }}>
          <View style={[styles.resultIconContainer, { backgroundColor: score > questions.length / 2 ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)' }]}>
            <MaterialCommunityIcons name={score > questions.length / 2 ? 'check-circle-outline' : 'alert-circle-outline'} size={48} color={score > questions.length / 2 ? colors['green-500'] : colors['amber-500']} />
          </View>
          <Text style={styles.resultTitle}>{score > questions.length / 2 ? "Well Done!" : "Keep Practicing!"}</Text>
          <Text style={styles.resultSubtitle}>You scored {score} out of {questions.length} in {60 - timeLeft} seconds.</Text>
        </View>
        <View style={{ marginBottom: 16 }}>
          <View style={styles.summaryRow}><Text style={styles.infoText}>Accuracy</Text><Text style={styles.infoText}>{Math.round((score / questions.length) * 100)}%</Text></View>
          <LinearProgress value={(score / questions.length) * 100} />
        </View>
        <View style={{ marginBottom: 24 }}>
          <View style={styles.summaryRow}><Text style={styles.infoText}>Time Efficiency</Text><Text style={styles.infoText}>{Math.round(((60 - timeLeft) / 60) * 100)}%</Text></View>
          <LinearProgress value={((60 - timeLeft) / 60) * 100} />
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={styles.primaryButton} onPress={handlePlayAgain}><Text style={styles.primaryButtonText}>Play Again</Text></TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => useRouter().back()}><Text style={styles.secondaryButtonText}>Back to Games</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false
        }}
      />
      <QuizNavBar />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => useRouter().back()}><Feather name="arrow-left" size={16} color={colors.foreground} /><Text style={styles.backButtonText}>Exit Game</Text></TouchableOpacity>
          <Text style={styles.logo}>TradeVed</Text>
        </View>
        <View style={styles.statusBar}>
          <View style={styles.badge}><Text style={styles.badgeText}>Score: {score}/{questions.length}</Text></View>
          <View style={styles.badge}><Feather name="clock" size={14} color={colors.foreground} style={{ marginRight: 4 }} /><Text style={styles.badgeText}>{timeLeft}s</Text></View>
        </View>
        {gameStatus === "playing" ? <GameContent /> : <ResultsContent />}
      </ScrollView>
    </>
  );
}

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
  feedbackBox: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 8, marginTop: 8 },
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
});

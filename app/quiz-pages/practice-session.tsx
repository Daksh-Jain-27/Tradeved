import { Feather } from "@expo/vector-icons";
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
import { Stack, useRouter } from 'expo-router';

const questions = [
  {
    text: "What is a call option?",
    options: [
      "A contract giving the right to sell",
      "A contract giving the right to buy",
      "A type of stock",
      "A trading fee",
    ],
    correctAnswer: 1,
    explanation:
      "A call option gives the holder the right (but not obligation) to buy an underlying asset at a specified price within a certain time period.",
  },
  {
    text: "What does 'going long' mean?",
    options: ["Selling a security", "Buying a security", "Holding for a long time", "Using leverage"],
    correctAnswer: 1,
    explanation: "Going long means buying a security with the expectation that its price will rise.",
  },
];

const totalQuestions = 10;

const PracticeSession: React.FC = () => {
  // For demo, mode and topicId are hardcoded
  const [mode, setMode] = useState<"untimed" | "timed">("untimed"); // or "timed"
  const topicId = "1";

  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(mode === "timed" ? 30 : null);

  const currentQ = questions[Math.min(currentQuestion - 1, questions.length - 1)];

  useEffect(() => {
    if (mode === "timed" && timeLeft !== null && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearInterval(timer);
    } else if (mode === "timed" && timeLeft === 0) {
      handleNext();
    }
  }, [timeLeft, mode]);

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === currentQ.correctAnswer) {
      setScore((prev) => prev + 1);
      Alert.alert("Correct! 🎉", "Well done!");
    } else {
      Alert.alert("Not quite right", "Check the explanation below");
    }
  };

  const handleNext = () => {
    if (currentQuestion >= totalQuestions) {
      // Alert.alert("Practice Complete!", `Score: ${score}/${totalQuestions}`);
      useRouter().push('/quiz-pages/PracticeHub')
      return;
    }
    setCurrentQuestion((prev) => prev + 1);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowExplanation(false);
    if (mode === "timed") setTimeLeft(30);
  };

  const handleRestart = () => {
    setCurrentQuestion(1);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowExplanation(false);
    setScore(0);
    if (mode === "timed") setTimeLeft(30);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false
        }}
      />
      <QuizNavBar />
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.iconButton} onPress={() => useRouter().back()}> 
          <Feather name="arrow-left" size={22} color="#64748b" />
        </TouchableOpacity>
        <View style={{ alignItems: "center" }}>
          <View style={styles.badgeOutline}><Text style={styles.badgeText}>Question {currentQuestion}/{totalQuestions}</Text></View>
          {mode === "timed" && timeLeft !== null && (
            <View style={{
              ...styles.badgeOutline,
              ...(timeLeft <= 5
                ? { backgroundColor: "#fee2e2", borderColor: "#ef4444" }
                : {})
            }}>
              <Text style={{
                ...styles.badgeText,
                ...(timeLeft <= 5 ? { color: "#ef4444" } : {})
              }}>{timeLeft}s</Text>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={handleRestart}> 
          <Feather name="rotate-ccw" size={22} color="#64748b" />
        </TouchableOpacity>
      </View>
      {/* Progress */}
      <View style={styles.progressBarWrap}>
        <View style={[styles.progressBar, { width: `${(currentQuestion / totalQuestions) * 100}%` }]} />
      </View>
      {/* Score */}
      <View style={{ alignItems: "center", marginBottom: 8 }}>
        <View style={[styles.badgeOutline, { backgroundColor: "#f0fdf4", borderColor: "#bbf7d0" }]}> 
          <Text style={[styles.badgeText, { color: "#22c55e" }]}>Score: {score}/{currentQuestion - (selectedAnswer === null ? 1 : 0)}</Text>
        </View>
      </View>
      {/* Question */}
      <View style={styles.card}>
        <Text style={styles.questionText}>{currentQ.text}</Text>
        {currentQ.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === currentQ.correctAnswer;
          let btnStyle = [
            styles.answerButton,
            selectedAnswer === null ? styles.answerDefault : null,
            isSelected && isCorrect ? styles.answerCorrect : null,
            isSelected && !isCorrect ? styles.answerWrong : null,
            isCorrect && showResult && !isSelected ? styles.answerCorrect : null,
            selectedAnswer !== null && !isSelected && !(isCorrect && showResult) ? styles.answerDim : null
          ].filter(Boolean);
          return (
            <TouchableOpacity
              key={index}
              style={btnStyle}
              onPress={() => handleAnswerSelect(index)}
              disabled={selectedAnswer !== null}
            >
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <Text style={styles.answerText}>{option}</Text>
                {showResult && isSelected && (
                  isCorrect ? (
                    <Feather name="check-circle" size={20} color="#22c55e" />
                  ) : (
                    <Feather name="x" size={20} color="#ef4444" />
                  )
                )}
                {showResult && isCorrect && selectedAnswer !== index && (
                  <Feather name="check-circle" size={20} color="#22c55e" />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      {/* Explanation */}
      {showResult && (
        <View style={styles.cardExplanation}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
            <Feather name="info" size={16} color="#38bdf8" style={{ marginRight: 6 }} />
            <Text style={{ color: "#38bdf8", fontWeight: "bold" }}>Explanation</Text>
          </View>
          <Text style={styles.explanationText}>{currentQ.explanation}</Text>
        </View>
      )}
      {/* Next Button */}
      {showResult && (
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>{currentQuestion >= totalQuestions ? "Finish Practice" : "Next Question"}</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#242620", padding: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  iconButton: { padding: 8, borderRadius: 8, backgroundColor: "#fff" },
  badgeOutline: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, backgroundColor: "#fff", marginBottom: 2 },
  badgeText: { color: "#64748b", fontWeight: "bold", fontSize: 13 },
  progressBarWrap: { height: 8, backgroundColor: "#e5e7eb", borderRadius: 8, marginBottom: 12, marginTop: 4 },
  progressBar: { height: 8, backgroundColor: "#22c55e", borderRadius: 8 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#bbf7d0" },
  questionText: { fontWeight: "bold", fontSize: 16, marginBottom: 12 },
  answerButton: { backgroundColor: "#f1f5f9", borderRadius: 10, paddingVertical: 14, paddingHorizontal: 12, marginBottom: 8, borderWidth: 1, borderColor: "#e5e7eb" },
  answerDefault: {},
  answerCorrect: { borderColor: "#22c55e", backgroundColor: "#bbf7d0" },
  answerWrong: { borderColor: "#ef4444", backgroundColor: "#fee2e2" },
  answerDim: { opacity: 0.5 },
  answerText: { fontSize: 15, fontWeight: "500" },
  cardExplanation: { backgroundColor: "#f1f5f9", borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: "#38bdf8" },
  explanationText: { color: "#64748b", fontSize: 13 },
  nextBtn: { backgroundColor: "#22c55e", borderRadius: 8, paddingVertical: 14, alignItems: "center", marginTop: 8 },
  nextBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default PracticeSession; 
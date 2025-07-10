import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import QuizNavBar from "../../../components/QuizNavBar";
import { Stack, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { socket } from "../../../lib/socket";

const API_BASE_URL = "http://94.136.190.104:3000";
const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"];
const DURATIONS = [1, 2, 5, 10];

const colors = {
  background: "#242620",
  foreground: "#f8fafc",
  card: "rgba(30, 41, 59, 0.5)",
  "muted-foreground": "#94a3b8",
  border: "#334155",
  primary: "#f8fafc",
  "primary-foreground": "#0b1120",
  secondary: "#1e293b",
  error: "#ef4444",
  success: "#10b981",
};

export default function GroupPlayJoinScreen() {
  const router = useRouter();
  
  // --- Auth and State ---
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const [isConfigured, setIsConfigured] = useState(false);

  const [step, setStep] = useState<
    "config" | "menu" | "lobby" | "countdown" | "playing" | "finished"
  >("config");
  const [roomCode, setRoomCode] = useState("");
  const [joinRoomCode, setJoinRoomCode] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [lobby, setLobby] = useState<any>(null);
  const [lobbyError, setLobbyError] = useState<string | null>(null);

  const [countdown, setCountdown] = useState<number | null>(null);
  const [game, setGame] = useState<any>(null);
  const [question, setQuestion] = useState<any>(null);
  const [scores, setScores] = useState<any>({});
  const [answering, setAnswering] = useState(false);
  const [finalResults, setFinalResults] = useState<any>(null);

  const [createDifficulty, setCreateDifficulty] = useState("MEDIUM");
  const [createDuration, setCreateDuration] = useState(5);
  const [createMaxPlayers, setCreateMaxPlayers] = useState(4);

  // --- Game Timer State ---
  const [gameTimer, setGameTimer] = useState<number | null>(null);
  const [gameDeadline, setGameDeadline] = useState<number | null>(null);

  const [activeTab, setActiveTab] = useState("create");
  const [loading, setLoading] = useState(false);

  // --- Load stored credentials ---
  useEffect(() => {
    loadStoredCredentials();
  }, []);

  const loadStoredCredentials = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      const storedToken = await AsyncStorage.getItem("authToken");
      
      if (storedUserId && storedToken) {
        setUserId(storedUserId);
        setToken(storedToken);
        setIsConfigured(true);
        setStep("menu");
      }
    } catch (error) {
      console.error("Error loading stored credentials:", error);
    }
  };

  // --- API Fetch Helper ---
  const apiFetch = useCallback(
    async (endpoint: string, body: object) => {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || `Request to ${endpoint} failed`);
      return data;
    },
    [token]
  );

  // --- Register participant in socket room ---
  const registerParticipant = useCallback(
    (lobbyObj: any) => {
      if (!socket || !lobbyObj) return;
      const myParticipant = lobbyObj.participants.find(
        (p: any) => p.userId === userId
      );
      if (myParticipant) {
        socket.emit("game:register-participant", {
          participantId: myParticipant.participantId,
          sessionId: lobbyObj.id,
        });
        console.log(
          "[Socket] Registered participant",
          myParticipant.participantId,
          lobbyObj.id
        );
      }
    },
    [userId]
  );

  // --- Socket Event Handlers ---
  useEffect(() => {
    if (!isConfigured || !userId) return;

    const handleConnect = () => {
      console.log(`[Socket] Connected with ID: ${socket.id}`);
      if (lobby && userId) registerParticipant(lobby);
    };

    const handleDisconnect = (reason: string) => {
      console.warn("[Socket] Disconnected. Reason:", reason);
      setLobbyError(`Disconnected: ${reason}`);
    };

    const handleLobbyUpdate = (data: any) => {
      setLobby(data);
      setRoomCode(data.roomCode || "");
      setIsHost(data.hostId === userId);
      setStep((currentStep) =>
        currentStep !== "countdown" &&
        currentStep !== "playing" &&
        currentStep !== "finished"
          ? "lobby"
          : currentStep
      );
      setLobbyError(null);
    };

    const handleCountdownStarted = (data: any) => {
      setCountdown(data.duration || 10);
      setStep("countdown");
    };

    const handleCountdownCancelled = (data: any) => {
      setCountdown(null);
      setLobbyError(data.reason || "Countdown was cancelled.");
      setStep("lobby");
    };

    const handleGameStarted = (data: any) => {
      setGame(data);
      setScores(
        lobby
          ? lobby.participants.reduce(
              (acc: any, p: any) => ({ ...acc, [p.participantId]: 0 }),
              {}
            )
          : {}
      );
      setStep("playing");
      setCountdown(null);
      if (data.duration) {
        const deadline = Date.now() + data.duration * 60 * 1000;
        setGameDeadline(deadline);
        setGameTimer(data.duration * 60);
      }
    };

    const handleScoreUpdate = (data: any) => setScores(data.scores);

    const handleGameFinished = (data: any) => {
      setFinalResults(data);
      setStep("finished");
      setGameTimer(0);
    };

    const handleNewQuestion = (data: any) => {
      setQuestion(data);
      setAnswering(false);
    };

    const handleLobbyDissolved = (data: any) => {
      setLobbyError(data.reason || "Lobby has been dissolved.");
      setLobby(null);
      setRoomCode("");
      setStep("menu");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("lobby:update", handleLobbyUpdate);
    socket.on("lobby:countdown_started", handleCountdownStarted);
    socket.on("lobby:countdown_cancelled", handleCountdownCancelled);
    socket.on("group_game:started", handleGameStarted);
    socket.on("group_game:score_update", handleScoreUpdate);
    socket.on("group_game:finished", handleGameFinished);
    socket.on("question:new", handleNewQuestion);
    socket.on("lobby:dissolved", handleLobbyDissolved);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("lobby:update", handleLobbyUpdate);
      socket.off("lobby:countdown_started", handleCountdownStarted);
      socket.off("lobby:countdown_cancelled", handleCountdownCancelled);
      socket.off("group_game:started", handleGameStarted);
      socket.off("group_game:score_update", handleScoreUpdate);
      socket.off("group_game:finished", handleGameFinished);
      socket.off("question:new", handleNewQuestion);
      socket.off("lobby:dissolved", handleLobbyDissolved);
    };
  }, [isConfigured, userId, lobby, registerParticipant]);

  // --- Re-register participant after lobby changes ---
  useEffect(() => {
    if (lobby && socket && userId) registerParticipant(lobby);
  }, [lobby, registerParticipant, userId]);

  // --- Countdown Timer Logic ---
  useEffect(() => {
    if (step === "countdown" && countdown !== null && countdown > 0) {
      const timer = setTimeout(
        () => setCountdown((c) => (c ? c - 1 : 0)),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [step, countdown]);

  // --- Game Timer Logic ---
  useEffect(() => {
    if (step !== "playing" || gameDeadline === null) return;
    setGameTimer(Math.max(0, Math.round((gameDeadline - Date.now()) / 1000)));
    const interval = setInterval(() => {
      setGameTimer((prev) => {
        const remaining = Math.max(
          0,
          Math.round((gameDeadline - Date.now()) / 1000)
        );
        if (remaining <= 0) clearInterval(interval);
        return remaining;
      });
    }, 250);
    return () => clearInterval(interval);
  }, [step, gameDeadline]);

  const showToast = (title: string, description: string) => {
    Alert.alert(title, description);
  };

  const handleSaveConfig = async () => {
    if (userId && token) {
      try {
        await AsyncStorage.setItem("userId", userId);
        await AsyncStorage.setItem("authToken", token);
        setIsConfigured(true);
        setStep("menu");
      } catch (error) {
        setLobbyError("Failed to save credentials.");
      }
    } else {
      setLobbyError("User ID and Token are required.");
    }
  };

  const handleCreateRoom = async () => {
    setLobbyError(null);
    setLoading(true);
    try {
      const settings = {
        difficulty: createDifficulty,
        durationMinutes: createDuration,
        maxPlayers: createMaxPlayers,
      };
      const response = await apiFetch("/api/group/create", settings);
      if (response && response.lobby) {
        setLobby(response.lobby);
        setRoomCode(response.roomCode);
        setIsHost(true);
        setStep("lobby");
        if (socket && socket.connected)
          registerParticipant(response.lobby);
      } else {
        throw new Error("Invalid response from server after creating room.");
      }
    } catch (err: any) {
      setLobbyError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!joinRoomCode.trim()) {
      setLobbyError("Please enter a room code.");
      return;
    }
    
    setLobbyError(null);
    setLoading(true);
    try {
      const lobbyState = await apiFetch("/api/group/join", { roomCode: joinRoomCode });
      if (lobbyState && lobbyState.id) {
        setLobby(lobbyState);
        setRoomCode(lobbyState.roomCode);
        setIsHost(lobbyState.hostId === userId);
        setStep("lobby");
        if (socket && socket.connected)
          registerParticipant(lobbyState);
      } else {
        throw new Error("Invalid response from server after joining room.");
      }
    } catch (err: any) {
      setLobbyError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartCountdown = async () => {
    setLobbyError(null);
    setLoading(true);
    try {
      if (!roomCode) throw new Error("Room code is missing.");
      await apiFetch("/api/group/initiate-countdown", { roomCode });
    } catch (err: any) {
      setLobbyError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveLobby = async () => {
    setLobbyError(null);
    try {
      if (lobby && lobby.id) {
        await apiFetch("/api/group/leave", {
          sessionId: lobby.id,
          userId: userId,
        });
      }
      setLobby(null);
      setRoomCode("");
      setStep("menu");
    } catch (err: any) {
      setLobbyError(err.message);
    }
  };

  const handleCancelCountdown = async () => {
    setLobbyError(null);
    try {
      if (!lobby || !lobby.id)
        throw new Error("Lobby data missing to cancel countdown.");
      await apiFetch("/api/group/cancel-countdown", { sessionId: lobby.id });
    } catch (err: any) {
      setLobbyError(err.message);
    }
  };

  const handleAnswer = (optionId: string) => {
    if (!question || answering || !socket || !game || !lobby) return;
    setAnswering(true);
    const myParticipant = lobby.participants.find(
      (p: any) => p.userId === userId
    );
    if (!myParticipant) return;
    socket.emit("answer:submit", {
      sessionId: game.sessionId || game.id,
      participantId: myParticipant.participantId,
      questionId: question.id,
      optionId,
    });
    console.log("Answer sent:", optionId);
  };

  const handleCopyCode = () => {
    showToast("Room code copied!", "Share this code with your friends.");
  };

  // --- Configuration Screen ---
  if (!isConfigured || step === "config") {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <QuizNavBar />
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="arrow-left" size={24} color={colors.foreground} />
            </TouchableOpacity>
            <Text style={styles.logo}>TradeVed</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>⚙️ Game Setup</Text>
              <Text style={styles.cardDescription}>
                Enter your details to continue. They will be saved in your device.
              </Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.label}>Your User ID</Text>
              <TextInput
                value={userId}
                onChangeText={setUserId}
                placeholder="Enter User ID"
                placeholderTextColor={colors["muted-foreground"]}
                style={styles.input}
              />
              <Text style={styles.label}>Your Auth Token (JWT)</Text>
              <TextInput
                value={token}
                onChangeText={setToken}
                placeholder="Paste Token"
                placeholderTextColor={colors["muted-foreground"]}
                style={styles.input}
                secureTextEntry
              />
              {lobbyError && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{lobbyError}</Text>
                </View>
              )}
            </View>
            <View style={styles.cardFooter}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleSaveConfig}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors["primary-foreground"]} />
                ) : (
                  <Text style={styles.primaryButtonText}>Save & Continue</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </>
    );
  }

  // --- Menu Screen ---
  if (step === "menu") {
    const CreateRoomTab = () => (
      <View style={styles.tabContent}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Create New Room</Text>
            <Text style={styles.cardDescription}>Set up a game room with custom settings</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.label}>Difficulty</Text>
            <View style={styles.pickerContainer}>
              {DIFFICULTIES.map((diff) => (
                <TouchableOpacity
                  key={diff}
                  style={[
                    styles.pickerOption,
                    createDifficulty === diff && styles.pickerOptionActive
                  ]}
                  onPress={() => setCreateDifficulty(diff)}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    createDifficulty === diff && styles.pickerOptionTextActive
                  ]}>
                    {diff}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Duration (minutes)</Text>
            <View style={styles.pickerContainer}>
              {DURATIONS.map((dur) => (
                <TouchableOpacity
                  key={dur}
                  style={[
                    styles.pickerOption,
                    createDuration === dur && styles.pickerOptionActive
                  ]}
                  onPress={() => setCreateDuration(dur)}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    createDuration === dur && styles.pickerOptionTextActive
                  ]}>
                    {dur}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Max Players</Text>
            <View style={styles.inputRow}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setCreateMaxPlayers(Math.max(2, createMaxPlayers - 1))}
              >
                <Feather name="minus" size={16} color={colors.foreground} />
              </TouchableOpacity>
              <Text style={styles.counterValue}>{createMaxPlayers}</Text>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setCreateMaxPlayers(Math.min(10, createMaxPlayers + 1))}
              >
                <Feather name="plus" size={16} color={colors.foreground} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.cardFooter}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleCreateRoom}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors["primary-foreground"]} />
              ) : (
                <Text style={styles.primaryButtonText}>Create Room</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );

    const JoinRoomTab = () => (
      <View style={styles.tabContent}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Join a Room</Text>
            <Text style={styles.cardDescription}>Enter a room code to join a friend's game</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.label}>Room Code</Text>
            <TextInput
              value={joinRoomCode}
              onChangeText={(text) => setJoinRoomCode(text.toUpperCase())}
              placeholder="Enter room code"
              placeholderTextColor={colors["muted-foreground"]}
              style={styles.input}
              maxLength={10}
            />
            <Text style={styles.helpText}>Ask your friend for the room code.</Text>
          </View>
          <View style={styles.cardFooter}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleJoinRoom}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors["primary-foreground"]} />
              ) : (
                <Text style={styles.primaryButtonText}>Join Room</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );

    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <QuizNavBar />
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="arrow-left" size={24} color={colors.foreground} />
            </TouchableOpacity>
            <Text style={styles.logo}>TradeVed</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "create" && styles.activeTab]}
              onPress={() => setActiveTab("create")}
            >
              <Feather name="plus" size={16} color={activeTab === 'create' ? colors['primary-foreground'] : colors.foreground} style={{ marginRight: 8 }} />
              <Text style={[styles.tabText, activeTab === "create" && styles.activeTabText]}>Create Room</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "join" && styles.activeTab]}
              onPress={() => setActiveTab("join")}
            >
              <Feather name="users" size={16} color={activeTab === 'join' ? colors['primary-foreground'] : colors.foreground} style={{ marginRight: 8 }} />
              <Text style={[styles.tabText, activeTab === "join" && styles.activeTabText]}>Join Room</Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'create' ? <CreateRoomTab /> : <JoinRoomTab />}

          {lobbyError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{lobbyError}</Text>
            </View>
          )}
        </ScrollView>
      </>
    );
  }

  // --- Lobby Screen ---
  if (step === "lobby" && lobby) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <QuizNavBar />
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleLeaveLobby}>
              <Feather name="arrow-left" size={24} color={colors.foreground} />
            </TouchableOpacity>
            <Text style={styles.logo}>TradeVed</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Lobby: {roomCode}</Text>
              <Text style={styles.cardDescription}>Waiting for players to join</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.label}>Room Code</Text>
              <View style={styles.inputRow}>
                <TextInput value={roomCode} editable={false} style={styles.input} />
                <TouchableOpacity style={styles.iconButton} onPress={handleCopyCode}>
                  <Feather name="copy" size={18} color={colors.foreground} />
                </TouchableOpacity>
              </View>

              <View style={styles.playerHeader}>
                <Text style={styles.sectionTitle}>Players ({lobby.participants.length}/{lobby.maxPlayers})</Text>
              </View>

              {lobby.participants.map((player: any) => (
                <View key={player.participantId} style={styles.playerRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.avatarPlaceholder}>
                      <Feather name="user" size={20} color={colors.foreground} />
                    </View>
                    <Text style={styles.playerName}>{player.username}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: player.userId === lobby.hostId ? colors.success : colors.primary }]}>
                    <Text style={[styles.badgeText, { color: player.userId === lobby.hostId ? colors.foreground : colors["primary-foreground"] }]}>
                      {player.userId === lobby.hostId ? 'Host' : 'Ready'}
                    </Text>
                  </View>
                </View>
              ))}

              <Text style={styles.sectionTitle}>Game Settings</Text>
              <View style={styles.settingRow}>
                <Text style={styles.infoText}>Difficulty</Text>
                <Text style={styles.infoText}>{lobby.difficulty || 'Medium'}</Text>
              </View>
              <View style={styles.settingRow}>
                <Text style={styles.infoText}>Duration</Text>
                <Text style={styles.infoText}>{lobby.durationMinutes || 5} min</Text>
              </View>
              <View style={styles.settingRow}>
                <Text style={styles.infoText}>Max Players</Text>
                <Text style={styles.infoText}>{lobby.maxPlayers}</Text>
              </View>
            </View>
            <View style={styles.cardFooter}>
              {isHost && (
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleStartCountdown}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={colors["primary-foreground"]} />
                  ) : (
                    <Text style={styles.primaryButtonText}>Start Game</Text>
                  )}
                </TouchableOpacity>
              )}
              <View style={styles.secondaryActions}>
                <TouchableOpacity style={styles.secondaryButton} onPress={handleCopyCode}>
                  <Feather name="copy" size={16} color={colors.foreground} />
                  <Text style={styles.secondaryButtonText}>Copy Code</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {lobbyError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{lobbyError}</Text>
            </View>
          )}
        </ScrollView>
      </>
    );
  }

  // --- Countdown Screen ---
  if (step === "countdown") {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <QuizNavBar />
        <View style={[styles.container, styles.centerContent]}>
          <Text style={styles.countdownTitle}>Game starting in...</Text>
          <Text style={styles.countdownNumber}>{countdown}</Text>
          {isHost && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleCancelCountdown}
            >
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </>
    );
  }

  // --- Playing Screen ---
  if (step === "playing" && game) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <QuizNavBar />
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleLeaveLobby}>
              <Feather name="arrow-left" size={24} color={colors.foreground} />
            </TouchableOpacity>
            <Text style={styles.logo}>TradeVed</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.gameTimerContainer}>
            <Text style={styles.gameTimerText}>
              Time Left: {gameTimer !== null
                ? `${Math.floor(gameTimer / 60)}:${(gameTimer % 60)
                    .toString()
                    .padStart(2, "0")}`
                : "--:--"}
            </Text>
          </View>

          {/* Scoreboard */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Scores</Text>
            </View>
            <View style={styles.cardContent}>
              {lobby.participants.map((player: any) => (
                <View key={player.participantId} style={styles.scoreRow}>
                  <Text style={styles.playerName}>{player.username}</Text>
                  <Text style={styles.scoreValue}>{scores[player.participantId] || 0}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Question */}
          {question ? (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Question</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.questionText}>{question.text}</Text>
                <View style={styles.optionsContainer}>
                  {question.options.map((option: any) => (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.optionButton,
                        answering && styles.optionButtonDisabled
                      ]}
                      onPress={() => handleAnswer(option.id)}
                      disabled={answering || (gameTimer !== null && gameTimer <= 0)}
                    >
                      <Text style={styles.optionButtonText}>{option.text}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.waitingText}>Waiting for next question...</Text>
              </View>
            </View>
          )}
        </ScrollView>
      </>
    );
  }

  // --- Finished Screen ---
  if (step === "finished" && finalResults) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <QuizNavBar />
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setStep("menu")}>
              <Feather name="arrow-left" size={24} color={colors.foreground} />
            </TouchableOpacity>
            <Text style={styles.logo}>TradeVed</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>🏁 Game Over!</Text>
              <Text style={styles.cardDescription}>Final Results</Text>
            </View>
            <View style={styles.cardContent}>
              {lobby.participants.map((player: any) => (
                <View key={player.participantId} style={styles.scoreRow}>
                  <Text style={styles.playerName}>{player.username}</Text>
                  <Text style={styles.scoreValue}>{finalResults.scores[player.participantId] || 0}</Text>
                </View>
              ))}
            </View>
            <View style={styles.cardFooter}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => setStep("menu")}
              >
                <Text style={styles.primaryButtonText}>Back to Menu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </>
    );
  }

  // --- Loading Screen ---
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <QuizNavBar />
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background, 
    padding: 16 
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 24 
  },
  logo: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: colors.foreground 
  },
  tabsContainer: { 
    flexDirection: 'row', 
    backgroundColor: colors.secondary, 
    borderRadius: 8, 
    padding: 4, 
    marginBottom: 16 
  },
  tab: { 
    flex: 1, 
    flexDirection: 'row', 
    paddingVertical: 10, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 6 
  },
  activeTab: { 
    backgroundColor: colors.primary 
  },
  tabText: { 
    color: colors.foreground, 
    fontWeight: '500' 
  },
  activeTabText: { 
    color: colors["primary-foreground"] 
  },
  tabContent: { 
    marginTop: 4 
  },
  card: { 
    backgroundColor: colors.card, 
    borderWidth: 1, 
    borderColor: colors.border, 
    borderRadius: 12,
    marginBottom: 16
  },
  cardHeader: { 
    padding: 16, 
    borderBottomWidth: 1, 
    borderColor: colors.border 
  },
  cardTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: colors.foreground, 
    marginBottom: 4 
  },
  cardDescription: { 
    color: colors["muted-foreground"] 
  },
  cardContent: { 
    padding: 16 
  },
  cardFooter: { 
    padding: 16, 
    borderTopWidth: 1, 
    borderColor: colors.border 
  },
  label: { 
    color: colors.foreground, 
    fontSize: 14, 
    fontWeight: '500', 
    marginBottom: 8 
  },
  inputRow: { 
    flexDirection: 'row', 
    alignItems: 'center',
    marginBottom: 16
  },
  input: { 
    flex: 1, 
    backgroundColor: colors.secondary, 
    color: colors.foreground, 
    padding: 12, 
    borderRadius: 8, 
    fontSize: 16, 
    textAlign: 'center' 
  },
  iconButton: { 
    padding: 12, 
    marginLeft: 8, 
    borderWidth: 1, 
    borderColor: colors.border, 
    borderRadius: 8 
  },
  playerHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginVertical: 16 
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: colors.foreground,
    marginBottom: 12
  },
  playerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 8, 
    borderWidth: 1, 
    borderColor: colors.border, 
    borderRadius: 8, 
    marginBottom: 8 
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  playerName: { 
    color: colors.foreground, 
    fontWeight: '500' 
  },
  badge: { 
    borderRadius: 12, 
    paddingHorizontal: 10, 
    paddingVertical: 4 
  },
  badgeText: { 
    fontWeight: 'bold', 
    fontSize: 12 
  },
  settingRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 12, 
    borderWidth: 1, 
    borderColor: colors.border, 
    borderRadius: 8, 
    marginBottom: 8 
  },
  infoText: { 
    color: colors.foreground 
  },
  primaryButton: { 
    backgroundColor: colors.primary, 
    padding: 16, 
    borderRadius: 8, 
    alignItems: 'center',
    marginBottom: 8
  },
  primaryButtonText: { 
    color: colors["primary-foreground"], 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  secondaryActions: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: 4 
  },
  secondaryButton: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: colors.border, 
    borderRadius: 8, 
    padding: 12, 
    marginHorizontal: 4 
  },
  secondaryButtonText: { 
    color: colors.foreground, 
    marginLeft: 8 
  },
  helpText: { 
    color: colors["muted-foreground"], 
    fontSize: 12, 
    textAlign: 'center', 
    marginTop: 16 
  },
  errorContainer: {
    backgroundColor: colors.error,
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  errorText: {
    color: colors.foreground,
    textAlign: 'center',
    fontWeight: '500',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  pickerOption: {
    flex: 1,
    minWidth: 80,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    alignItems: 'center',
  },
  pickerOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pickerOptionText: {
    color: colors.foreground,
    fontWeight: '500',
  },
  pickerOptionTextActive: {
    color: colors["primary-foreground"],
  },
  counterButton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterValue: {
    flex: 1,
    textAlign: 'center',
    color: colors.foreground,
    fontSize: 18,
    fontWeight: 'bold',
  },
  countdownTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: 20,
  },
  countdownNumber: {
    fontSize: 72,
    fontWeight: '900',
    color: colors.error,
    marginBottom: 40,
  },
  gameTimerContainer: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  gameTimerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.error,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.success,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: 16,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: colors.secondary,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionButtonDisabled: {
    opacity: 0.5,
  },
  optionButtonText: {
    color: colors.foreground,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  waitingText: {
    color: colors["muted-foreground"],
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  loadingText: {
    color: colors.foreground,
    fontSize: 16,
    marginTop: 16,
  },
});

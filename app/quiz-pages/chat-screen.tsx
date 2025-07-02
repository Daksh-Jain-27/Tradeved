import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, Feather } from "@expo/vector-icons";
import QuizNavBar from "../../components/QuizNavBar";
import { Stack, useRouter } from 'expo-router';

interface ChatScreenProps {
  userId: string;
}

type Message = {
  id: number;
  text: string;
  sender: "me" | "other";
  timestamp: string;
};

const user = {
  name: "Alex Trader",
  username: "alex_trader",
  avatar: require("../../assets/images/profile.png"),
  online: true,
};

const initialMessages: Message[] = [
  { id: 1, text: "Hey! Ready for a trading duel?", sender: "other", timestamp: "2:30 PM" },
  { id: 2, text: "Let's do this 🚀", sender: "me", timestamp: "2:31 PM" },
  { id: 3, text: "Options or technical analysis?", sender: "other", timestamp: "2:32 PM" },
  { id: 4, text: "Let's go with options! I've been practicing", sender: "me", timestamp: "2:33 PM" },
];

const ChatScreen: React.FC<ChatScreenProps> = ({ userId }) => {
  const navigation = useNavigation();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: message,
        sender: "me",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  const handleChallenge = () => {
    // navigation.navigate("DuelLobby", { invite: userId });
    // alert(`Challenge sent to user: ${userId}`);
    useRouter().push('/quiz-pages/duel-lobby')
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false
        }}
      />
      <QuizNavBar />
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#242620" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={20} color="#64748b" />
              </TouchableOpacity>
              <Image source={user.avatar} style={styles.avatar} />
              <View>
                <Text style={styles.headerName}>{user.name}</Text>
                <Text style={styles.headerStatus}>{user.online ? "Online" : "Offline"}</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.iconButton} onPress={handleChallenge}>
                <Feather name="users" size={20} color="#64748b" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Feather name="more-vertical" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Messages */}
          <ScrollView
            style={styles.messagesContainer}
            contentContainerStyle={{ paddingVertical: 8 }}
            ref={scrollViewRef}
          >
            {messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageRow,
                  msg.sender === "me" ? styles.messageRowMe : styles.messageRowOther,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    msg.sender === "me" ? styles.messageBubbleMe : styles.messageBubbleOther,
                  ]}
                >
                  <Text style={styles.messageText}>{msg.text}</Text>
                  <Text
                    style={[
                      styles.messageTimestamp,
                      msg.sender === "me"
                        ? styles.messageTimestampMe
                        : styles.messageTimestampOther,
                    ]}
                  >
                    {msg.timestamp}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Input */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={handleSendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !message.trim() && { backgroundColor: "#e5e7eb" },
              ]}
              onPress={handleSendMessage}
              disabled={!message.trim()}
            >
              <Feather name="send" size={20} color={message.trim() ? "#000" : "#64748b"} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  iconButton: {
    padding: 6,
    marginRight: 6,
    borderRadius: 8,
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10, backgroundColor: "#e5e7eb" },
  headerName: { fontWeight: "bold", fontSize: 16 },
  headerStatus: { fontSize: 12, color: "#64748b" },
  headerRight: { flexDirection: "row", alignItems: "center" },
  messagesContainer: { flex: 1, marginBottom: 8 },
  messageRow: { flexDirection: "row", marginBottom: 8 },
  messageRowMe: { justifyContent: "flex-end" },
  messageRowOther: { justifyContent: "flex-start" },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 14,
  },
  messageBubbleMe: { backgroundColor: "#bbf7d0" },
  messageBubbleOther: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#e5e7eb" },
  messageText: { fontSize: 15 },
  messageTimestamp: { fontSize: 11, marginTop: 4 },
  messageTimestampMe: { color: "#000" },
  messageTimestampOther: { color: "#64748b" },
  inputRow: { flexDirection: "row", alignItems: "center" },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#bbf7d0",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ChatScreen; 
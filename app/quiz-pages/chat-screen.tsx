import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import QuizNavBar from "../../components/QuizNavBar";

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
          <LinearGradient
            colors={['rgba(163, 230, 53, 0.1)', 'rgba(56, 189, 248, 0.1)']}
            style={styles.header}
          >
            <View style={styles.headerLeft}>
              <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={20} color="#94a3b8" />
              </TouchableOpacity>
              <Image source={user.avatar} style={styles.avatar} />
              <View>
                <Text style={styles.headerName}>{user.name}</Text>
                <Text style={styles.headerStatus}>{user.online ? "Online" : "Offline"}</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.iconButton} onPress={handleChallenge}>
                <Feather name="users" size={20} color="#94a3b8" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Feather name="more-vertical" size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

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
                  <Text style={[
                    styles.messageText,
                    msg.sender === "me" ? styles.messageTextMe : styles.messageTextOther
                  ]}>{msg.text}</Text>
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
              placeholderTextColor="#94a3b8"
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={handleSendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !message.trim() && { backgroundColor: "rgba(0, 0, 0, 0.2)" },
              ]}
              onPress={handleSendMessage}
              disabled={!message.trim()}
            >
              <Feather 
                name="send" 
                size={20} 
                color={message.trim() ? "#000" : "#94a3b8"} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: "#242620" 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 12,
    paddingHorizontal: 12,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(163, 230, 53, 0.2)",
    borderRadius: 12
  },
  headerLeft: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  iconButton: {
    padding: 6,
    marginRight: 6,
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(163, 230, 53, 0.2)"
  },
  avatar: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    marginRight: 10, 
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 2,
    borderColor: "#A3E635"
  },
  headerName: { 
    fontWeight: "bold", 
    fontSize: 16,
    color: "#fff"
  },
  headerStatus: { 
    fontSize: 12, 
    color: "#94a3b8" 
  },
  headerRight: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  messagesContainer: { 
    flex: 1, 
    marginBottom: 8 
  },
  messageRow: { 
    flexDirection: "row", 
    marginBottom: 8 
  },
  messageRowMe: { 
    justifyContent: "flex-end" 
  },
  messageRowOther: { 
    justifyContent: "flex-start" 
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  messageBubbleMe: { 
    backgroundColor: "rgba(163, 230, 53, 0.1)",
    borderColor: "rgba(163, 230, 53, 0.2)"
  },
  messageBubbleOther: { 
    backgroundColor: "rgba(0, 0, 0, 0.2)", 
    borderColor: "rgba(163, 230, 53, 0.2)" 
  },
  messageText: { 
    fontSize: 15 
  },
  messageTextMe: {
    color: "#A3E635"
  },
  messageTextOther: {
    color: "#fff"
  },
  messageTimestamp: { 
    fontSize: 11, 
    marginTop: 4 
  },
  messageTimestampMe: { 
    color: "#94a3b8" 
  },
  messageTimestampOther: { 
    color: "#94a3b8" 
  },
  inputRow: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  input: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "rgba(163, 230, 53, 0.2)",
    marginRight: 8,
    color: "#fff"
  },
  sendButton: {
    backgroundColor: "#9bec00",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ChatScreen; 
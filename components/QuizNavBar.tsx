import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const NAV_ITEMS = [
  { label: "Home", icon: <Feather name="home" size={24} />, route: "/(tabs)/Quiz" },
  { label: "Games", icon: <FontAwesome5 name="gamepad" size={22} />, route: "/quiz-pages/games-hub" },
  { label: "Practice", icon: <Feather name="book-open" size={24} />, route: "/quiz-pages/PracticeHub" },
  // { label: "Compete", icon: <FontAwesome5 name="award" size={22} />, route: "/quiz-pages/competition-hub" },
  { label: "Social", icon: <Feather name="users" size={24} />, route: "/quiz-pages/social-hub" },
  // { label: "Profile", icon: <Feather name="user" size={24} />, route: "/quiz-pages/profile-screen" },
];

export default function QuizNavBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.navbar}>
      {[0, 1].map(row => (
        <View key={row} style={styles.row}>
          {NAV_ITEMS.slice(row * 3, row * 3 + 3).map(item => {
            const isActive = pathname === item.route;
            return (
              <TouchableOpacity
                key={item.label}
                style={styles.item}
                onPress={() => router.push(item.route as any)}
              >
                {React.cloneElement(item.icon, { color: isActive ? "#22c55e" : "#94a3b8" })}
                <Text style={[styles.label, { color: isActive ? "#22c55e" : "#94a3b8" }]}> 
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: "#242620",
    paddingTop: 40,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  item: {
    alignItems: "center",
    flex: 1,
  },
  label: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: "500",
  },
}); 
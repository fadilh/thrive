import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null); // State to store selected emoji/mood

  // Fetch messages and mood from AsyncStorage when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const storedMessages = await AsyncStorage.getItem("messages");
      const storedMood = await AsyncStorage.getItem("mood");

      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
      if (storedMood) {
        setSelectedMood(storedMood); // Load saved mood state
      }
    };
    fetchData();
  }, []);

  // Handler for clicking emojis and saving the mood state
  const handleEmojiPress = async (feeling) => {
    setSelectedMood(feeling); // Update the mood state locally
    await AsyncStorage.setItem("mood", feeling); // Save the selected mood in AsyncStorage
    console.log(`User is feeling: ${feeling}`);
  };

  // Function to return a readable mood string
  const getMoodText = (mood) => {
    switch (mood) {
      case "happy":
        return "You are feeling happy 😊";
      case "neutral":
        return "You are feeling neutral 😐";
      case "sad":
        return "You are feeling sad 😢";
      default:
        return "How are you feeling today?";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{getMoodText(selectedMood)}</Text>
      <View style={styles.emojiContainer}>
        <TouchableOpacity
          style={[
            styles.emojiButton,
            selectedMood === "happy" ? styles.selectedEmoji : null, // Highlight if "happy" is selected
          ]}
          onPress={() => handleEmojiPress("happy")}
        >
          <Text style={styles.emoji}>😊</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.emojiButton,
            selectedMood === "neutral" ? styles.selectedEmoji : null, // Highlight if "neutral" is selected
          ]}
          onPress={() => handleEmojiPress("neutral")}
        >
          <Text style={styles.emoji}>😐</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.emojiButton,
            selectedMood === "sad" ? styles.selectedEmoji : null, // Highlight if "sad" is selected
          ]}
          onPress={() => handleEmojiPress("sad")}
        >
          <Text style={styles.emoji}>😢</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F7F9FC",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333333",
  },
  emojiContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  emojiButton: {
    padding: 10,
    borderRadius: 50,
    elevation: 3,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDDDDD",
  },
  selectedEmoji: {
    backgroundColor: "#BDE0FE", // Light blue color to indicate the selected emoji
    borderColor: "#007BFF", // Stronger border color for the selected emoji
  },
  emoji: {
    fontSize: 80,
  },
  messageContainer: {
    backgroundColor: "#E8F0FE",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  messageText: {
    fontSize: 16,
    color: "#333333",
  },
});

export default HomeScreen;

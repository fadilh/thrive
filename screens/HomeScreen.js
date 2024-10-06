import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null); // State to store selected emoji/mood
  const [recommendation, setRecommendation] = useState("");
  const [userMessage, setUserMessage] = useState(""); // User's custom message
  const [loading, setLoading] = useState(false); // Loading state

  const screenHeight = Dimensions.get("window").height;

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
  };

  // Function to call the /recommend API
  const getRecommendation = async (message) => {
    try {
      setLoading(true); // Show loading indicator
      const response = await fetch("http://127.0.0.1:5000/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: { message: message },
        }),
      });
      const result = await response.json();
      if (result.output) {
        setRecommendation(result.output); // Set the recommendation text
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error fetching recommendation:", error);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Handler for the 'Ask AI' button click
  const handlePostMessage = () => {
    if (userMessage.trim()) {
      getRecommendation(userMessage);
      setUserMessage(""); // Clear the input field after submission
    } else {
      alert("Error", "Please type a message first.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>How are you feeling today?</Text>
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

        {/* Display recommendation */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#007BFF"
            style={styles.loading}
          />
        ) : recommendation ? (
          <View style={styles.recommendationContainer}>
            <Text style={styles.recommendationText}>{recommendation}</Text>
          </View>
        ) : null}
      </View>

      {/* Message input area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
      >
        <TextInput
          style={[styles.input]} // Set height to 40% of the screen for a larger input
          placeholder="Type your message here..." // Placeholder text
          placeholderTextColor="#999" // Ensure placeholder text is visible
          value={userMessage}
          onChangeText={setUserMessage}
          maxLength={100} // Limit the input to 100 characters
          multiline
        />
        {/* <Text style={styles.charCount}>{`${userMessage.length}`}</Text> */}

        <TouchableOpacity style={styles.askButton} onPress={handlePostMessage}>
          <Text style={styles.askButtonText}>Ask AI</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", // White background for clean look
  },
  contentContainer: {
    // flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333333", // Dark text for contrast
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
    backgroundColor: "#FFFFFF", // White background for emoji buttons
    borderWidth: 1,
    borderColor: "#DDDDDD",
  },
  selectedEmoji: {
    backgroundColor: "#FFB74D", // Orange highlight for selected emoji
    borderColor: "#FF9800", // Darker orange border for selected emoji
  },
  emoji: {
    fontSize: 80,
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#DDDDDD",
    // backgroundColor: "#f5f5f5", // Light background for input area
  },
  input: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333", // Dark border for contrast
    textAlignVertical: "top", // Ensures the text starts at the top of the box
    color: "#333", // Dark text color for readability
  },
  charCount: {
    alignSelf: "flex-end",
    marginTop: 5,
    fontSize: 14,
    color: "#999", // Light text for character count
  },
  askButton: {
    marginTop: 10,
    alignSelf: "center", // Center the button, so it doesn't span the whole width
    backgroundColor: "#FF9800", // Orange button for action
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000", // Subtle shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  askButtonText: {
    color: "#fff", // White text on orange button
    fontSize: 18,
    fontWeight: "bold",
  },
  recommendationContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#FFCC80", // Light orange for recommendation background
    borderRadius: 8,
  },
  recommendationText: {
    fontSize: 16,
    color: "#333", // Dark text for readability
    textAlign: "center",
  },
  loading: {
    marginTop: 20,
  },
});

export default HomeScreen;

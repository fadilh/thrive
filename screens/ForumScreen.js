import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Sample User ID
const userID = "user123";

const ForumScreen = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch messages from AsyncStorage when the component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      const storedMessages = await AsyncStorage.getItem("forumMessages");
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    };
    fetchMessages();
  }, []);

  // Function to handle posting a new message
  const handlePostMessage = async () => {
    if (newMessage.trim() === "") {
      return; // Don't allow empty messages
    }

    // Get current date and format it as "MMM dd, hh:mm AM/PM"
    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }); // e.g., "Oct 5"
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }); // e.g., "10:30 AM"

    const newEntry = {
      userID,
      date: `${formattedDate}, ${formattedTime}`,
      message: newMessage,
    };

    const updatedMessages = [...messages, newEntry];
    setMessages(updatedMessages);
    setNewMessage(""); // Clear input after posting

    // Save to AsyncStorage
    await AsyncStorage.setItem(
      "forumMessages",
      JSON.stringify(updatedMessages)
    );
  };

  // Render each message
  const renderMessage = ({ item }) => (
    <View style={styles.messageContainer}>
      <Text style={styles.messageUser}>{item.userID}</Text>
      <Text style={styles.messageText}>{item.message}</Text>
      <Text style={styles.messageDate}>{item.date}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Type your message here..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.postButton} onPress={handlePostMessage}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  messageList: {
    padding: 16,
  },
  messageContainer: {
    backgroundColor: "#E8F0FE",
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  messageUser: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
    color: "#333",
  },
  messageText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  messageDate: {
    fontSize: 12,
    color: "#888",
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    fontSize: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  postButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  postButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ForumScreen;

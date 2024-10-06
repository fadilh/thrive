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

const validateMessage = async (message) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/validate-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: { message }, // Send the message to validate
      }),
    });

    const result = await response.json();
    return result.output === "True";
  } catch (error) {
    console.error("Error validating message:", error);
    return false;
  }
};

// Message Component
const Message = ({ messageData, addReply, handleLike }) => {
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);

  // Function to handle adding a reply
  const handleAddReply = async () => {
    if (replyText.trim() === "") {
      return; // Don't allow empty replies
    }

    const isValid = await validateMessage(replyText);

    if (!isValid) {
      alert("Your reply was likely hurtful and offensive.");
      return;
    }

    addReply(messageData.id, replyText);
    setReplyText(""); // Clear input after reply
    setShowReplyInput(false); // Hide input after reply
  };

  return (
    <View style={styles.messageContainer}>
      <Text style={styles.messageUser}>{messageData.userID}</Text>
      <Text style={styles.messageText}>{messageData.message}</Text>
      <View style={styles.likeContainer}>
        <Text style={styles.likeCount}>{messageData.likes}</Text>
        <TouchableOpacity onPress={() => handleLike(messageData.id)}>
          <Text style={styles.likeButton}>❤️</Text>
        </TouchableOpacity>
      </View>
      {/* <Text style={styles.messageDate}>{messageData.date}</Text> */}

      {/* Like Button with Heart Emoji and Like Count */}
      <View style={styles.likeContainer}>
        <Text style={styles.messageDate}>{messageData.date}</Text>
      </View>
      {/* <View style={styles.messageFooter}>
        <View style={styles.likeContainer}>
          <Text style={styles.likeCount}>{messageData.likes}</Text>
          <TouchableOpacity onPress={() => handleLike(messageData.id)}>
            <Text style={styles.likeButton}>❤️</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.messageDate}>{messageData.date}</Text>
      </View> */}

      {/* Reply Button */}
      <TouchableOpacity onPress={() => setShowReplyInput(!showReplyInput)}>
        <Text style={styles.replyButton}>Reply</Text>
      </TouchableOpacity>

      {/* Reply Input Field */}
      {showReplyInput && (
        <View style={styles.replyInputContainer}>
          <TextInput
            style={styles.replyInput}
            placeholder="Type your reply..."
            value={replyText}
            onChangeText={setReplyText}
          />
          <TouchableOpacity
            style={styles.replyPostButton}
            onPress={handleAddReply}
          >
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Render Replies */}
      {messageData.replies && (
        <FlatList
          data={messageData.replies}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.replyContainer}>
              <Text style={styles.replyUser}>{item.userID}</Text>
              <Text style={styles.replyText}>{item.message}</Text>
              <Text style={styles.replyDate}>{item.date}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

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

    const isValid = await validateMessage(newMessage);

    if (!isValid) {
      alert("Your message was likely hurtful and offensive.");
      return;
    }

    // Proceed with posting the message if valid
    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    const newEntry = {
      id: Math.random().toString(),
      userID,
      date: `${formattedDate}, ${formattedTime}`,
      message: newMessage,
      replies: [],
      likes: 0,
    };

    const updatedMessages = [...messages, newEntry];
    setMessages(updatedMessages);
    setNewMessage(""); // Clear input after posting

    await AsyncStorage.setItem(
      "forumMessages",
      JSON.stringify(updatedMessages)
    );
  };

  // Function to handle adding a reply to a specific message
  const addReply = async (messageId, replyText) => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    const reply = {
      userID,
      date: `${formattedDate}, ${formattedTime}`,
      message: replyText,
    };

    const updatedMessages = messages.map((message) => {
      if (message.id === messageId) {
        return {
          ...message,
          replies: [...message.replies, reply],
        };
      }
      return message;
    });

    setMessages(updatedMessages);

    // Save updated messages with replies to AsyncStorage
    await AsyncStorage.setItem(
      "forumMessages",
      JSON.stringify(updatedMessages)
    );
  };

  // Function to handle liking a message
  const handleLike = async (messageId) => {
    const updatedMessages = messages.map((message) => {
      if (message.id === messageId) {
        return {
          ...message,
          likes: message.likes + 1,
        };
      }
      return message;
    });

    setMessages(updatedMessages);

    // Save updated messages with likes to AsyncStorage
    await AsyncStorage.setItem(
      "forumMessages",
      JSON.stringify(updatedMessages)
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Message
            messageData={item}
            addReply={addReply}
            handleLike={handleLike}
          />
        )}
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
  messageFooter: {
    flexDirection: "column", // Stack the like button and date vertically
    alignItems: "flex-end", // Align both to the right
    marginTop: 4,
  },

  likeContainer: {
    flexDirection: "row", // Place the count and like button side by side
    alignItems: "center",
    justifyContent: "flex-end", // Align them to the right
    marginBottom: 4, // Space between the like button and date
  },

  likeCount: {
    fontSize: 16,
    color: "#333",
  },

  likeButton: {
    fontSize: 20,
    marginLeft: 4, // Add space between count and button
  },

  messageDate: {
    fontSize: 12,
    color: "#888",
    textAlign: "right", // Align date to the right
  },

  replyButton: {
    color: "#007BFF",
    marginTop: 4,
    fontSize: 14,
  },
  replyInputContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  replyInput: {
    flex: 1,
    padding: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    fontSize: 14,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  replyPostButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  postButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  replyContainer: {
    backgroundColor: "#DDEFFD",
    padding: 8,
    marginTop: 6,
    borderRadius: 6,
  },
  replyUser: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#333",
  },
  replyText: {
    fontSize: 14,
    color: "#333",
    marginVertical: 2,
  },
  replyDate: {
    fontSize: 10,
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
});

export default ForumScreen;

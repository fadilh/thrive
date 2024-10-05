import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PostMessageScreen = ({ route, navigation }) => {
  const [newMessage, setNewMessage] = useState("");
  const { messages, setMessages } = route.params;

  // Save the new message to AsyncStorage and navigate back
  const handlePostMessage = async () => {
    if (newMessage.trim()) {
      const updatedMessages = [newMessage, ...messages];
      setMessages(updatedMessages);
      await AsyncStorage.setItem("messages", JSON.stringify(updatedMessages));
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type your message..."
        multiline
        value={newMessage}
        onChangeText={setNewMessage}
      />
      <Button title="Post" onPress={handlePostMessage} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    height: 100,
    marginBottom: 20,
    textAlignVertical: "top",
  },
});

export default PostMessageScreen;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FAB } from "react-native-elements";

const HomeScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);

  // Fetch messages from AsyncStorage when the component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      const storedMessages = await AsyncStorage.getItem("messages");
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    };
    fetchMessages();
  }, []);

  // Render each message
  const renderMessage = ({ item }) => (
    <View style={styles.messageContainer}>
      <Text style={styles.messageText}>{item}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Mental Health Forum</Text>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderMessage}
      />
      <FAB
        title="Post"
        placement="right"
        color="green"
        onPress={() =>
          navigation.navigate("PostMessage", { messages, setMessages })
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  messageContainer: {
    backgroundColor: "#d9f9b1",
    padding: 10,
    marginVertical: 8,
    borderRadius: 10,
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
});

export default HomeScreen;

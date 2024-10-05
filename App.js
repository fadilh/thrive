import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import PostMessageScreen from "./screens/PostMessageScreen";
import ForumScreen from "./screens/ForumScreen";

// Bottom Tab Navigator for Forum and Dashboard
const Tab = createBottomTabNavigator();

const DashboardScreen = () => {
  return <HomeScreen />;
};

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Dashboard">
        <Tab.Screen name="Thrive" component={DashboardScreen} />
        <Tab.Screen name="Forum" component={ForumScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

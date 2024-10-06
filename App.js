import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/HomeScreen";
import ForumScreen from "./screens/ForumScreen";

const Tab = createBottomTabNavigator();

const DashboardScreen = () => {
  return <HomeScreen />;
};

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Thrive" component={DashboardScreen} />
        <Tab.Screen name="Forum" component={ForumScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import DashboardScreen from "../screens/DashboardScreen";
import TreeScreen from "../screens/TreeScreen";
import HistoryScreen from "../screens/HistoryScreen";
import NotificationScreen from "../screens/NotificationScreen";

import TreeDetailsScreen from "../screens/TreeDetailsScreen";
import AIResultScreen from "../screens/AIResultScreen";
import SensorsScreen from "../screens/SensorsScreen";
import IrrigationScreen from "../screens/IrrigationScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { colors } from "../../theme";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: colors.accent,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Trees"
        component={TreeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="park" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="history" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="notifications" size={size} color={color} />
          ),
        }}
      />

       <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="TreeDetails" component={TreeDetailsScreen} options={{ headerShown: true, title: "Détail olivier" }} />
            <Stack.Screen name="AIResult" component={AIResultScreen} options={{ headerShown: true, title: "Analyse IA" }} />
            <Stack.Screen name="Sensors" component={SensorsScreen} options={{ headerShown: true, title: "Capteurs" }} />
            <Stack.Screen name="Irrigation" component={IrrigationScreen} options={{ headerShown: true, title: "Irrigation" }} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: true, title: "Paramètres" }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
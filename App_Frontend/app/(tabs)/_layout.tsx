import { FontAwesome, Ionicons } from "@expo/vector-icons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs, router } from "expo-router";
import { TouchableOpacity, View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#7743DB", // Active tab icon and text color
        tabBarInactiveTintColor: "#C3ACD0", // Inactive tab icon and text color
        tabBarStyle: {
          backgroundColor: "#FFFBF5", // Tab bar background color
          borderTopWidth: 0, // Remove the top border
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: "#FFFBF5", // Header background color
        },
        headerTintColor: "#7743DB", // Header text color
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 20,
        },
        headerRight: () => (
          <View style={{ flexDirection: "row", gap: 20, marginRight: 16 }}>
            <TouchableOpacity onPress={() => router.push("/search")}>
              <Ionicons name="search-outline" size={24} color="#7743DB" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/settings")}>
              <Ionicons name="settings-outline" size={24} color="#7743DB" />
            </TouchableOpacity>
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="library-music" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
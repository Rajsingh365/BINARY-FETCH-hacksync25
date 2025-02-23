import { FontAwesome, Ionicons } from "@expo/vector-icons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Tabs,router } from "expo-router";
import { TouchableOpacity, View } from "react-native";

export default function TabLayout() {
  return (

    <Tabs screenOptions={{ 
      tabBarActiveTintColor: "blue", 
      headerShown: true,
      headerRight: () => (
        <View style={{ flexDirection: "row", gap: 20, marginRight: 16 }}>
          <TouchableOpacity onPress={() => router.push("/search")}>
            <Ionicons name="search-outline" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/settings")}>
            <Ionicons name="settings-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    }}>

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

      {/* <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="cog" color={color} />
          ),
        }}
      /> */}
    </Tabs>
  );
}
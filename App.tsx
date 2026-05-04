import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import Diary from "./src/screens/Diary";
import Details from "./src/screens/Details";
import Alerts from "./src/screens/Alerts";
import AI from "./src/screens/AI";
import Profile from "./src/screens/Profile";

import { Image } from "react-native";
import { colors } from "./src/styles/theme";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderColor: colors.border,
        },
      }}
    >
      <Tab.Screen
        name="Diary"
        component={Diary}
        options={{
          tabBarLabel: "Diário",
          tabBarIcon: () => (
            <Image
              source={require("./assets/icons/diary.png")}
              style={{ width: 24, height: 24 }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Alerts"
        component={Alerts}
        options={{
          tabBarLabel: "Alertas",
          tabBarIcon: () => (
            <Image
              source={require("./assets/icons/alert.png")}
              style={{ width: 24, height: 24 }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="AI"
        component={AI}
        options={{
          tabBarLabel: "IA",
          tabBarIcon: () => (
            <Image
              source={require("./assets/icons/ai.png")}
              style={{ width: 24, height: 24 }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: () => (
            <Image
              source={require("./assets/icons/user.png")}
              style={{ width: 24, height: 24 }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Tabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Details" component={Details} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
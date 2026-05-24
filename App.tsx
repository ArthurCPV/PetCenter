import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import Diary from "./src/screens/Diary";
import Alerts from "./src/screens/Alerts";
import AI from "./src/screens/AI";
import Profile from "./src/screens/Profile";
import Welcome from "./src/screens/Welcome";
import Login from "./src/screens/Login";
import PetDiary from "./src/screens/PetDiary";

import { Image } from "react-native";
import { colors } from "./src/styles/theme";
import { styles_gb } from "./src/styles/global";

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
          borderTopWidth: 0,
          elevation: 8,
          ...styles_gb.tabBar,
        },

        tabBarLabelStyle: styles_gb.tabLabel,

        tabBarItemStyle: {
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: 8,
        },
      }}
    >
      <Tab.Screen
        name="Diary"
        component={Diary}
        options={{
          tabBarLabel: "Diário",
          tabBarIcon: ({focused}) => (
            <Image
              source={require("./assets/icons/pokecenter-3.png")}
                  style={{
                    width: 50,
                    height: 50
                  }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Alerts"
        component={Alerts}
        options={{
          tabBarLabel: "Alertas",
          tabBarIcon: ({focused}) => (
            <Image
              source={require("./assets/icons/pokealert-1.png")}
                  style={{
                    width: 32,
                    height: 38
                  }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="AI"
        component={AI}
        options={{
          tabBarLabel: "IA",
          tabBarIcon: ({focused}) => (
            <Image
              source={require("./assets/icons/rotondex-1.png")}
                  style={{
                    width: 55,
                    height: 36
                  }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({focused}) => (
            <Image
              source={require("./assets/icons/poketrainer.png")}
                  style={{
                    width: 40,
                    height: 40
                  }}
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
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Tabs} />
        <Stack.Screen name="PetDiary" component={PetDiary} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
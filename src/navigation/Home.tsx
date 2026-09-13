import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from "react-native";

import { colors } from "../styles/theme";

import type {
    HomeStack,
    TabsStack,
} from "../types/navigation";

import Diary from "../screens/Diary";
import Details from "../screens/Details";
import Alerts from "../screens/Alerts";
import AI from "../screens/AI";
import Profile from "../screens/Profile";
import Welcome from "../screens/Welcome";
import Login from "../screens/Login";
import Register from "../screens/Register";

const Stack = createNativeStackNavigator<HomeStack>();
const Tab = createBottomTabNavigator<TabsStack>();

const Tabs = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,

                tabBarActiveTintColor: colors.primary,

                tabBarStyle: {
                    backgroundColor: "#fff",
                    height: 120,
                },

                tabBarLabelStyle: {
                    marginTop: 8,
                    marginBottom: 10,
                },

                tabBarIconStyle: {
                    marginTop: 8,
                    marginBottom: 0,
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
                            source={require("../../assets/icons/pokecenter-3.png")}
                            style={{
                                width: 50,
                                height: 50,
                            }}
                            resizeMode="contain"
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
                            source={require("../../assets/icons/pokealert-1.png")}
                            style={{
                                width: 32,
                                height: 38,
                            }}
                            resizeMode="contain"
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
                            source={require("../../assets/icons/rotondex-1.png")}
                            style={{
                                width: 55,
                                height: 36,
                            }}
                            resizeMode="contain"
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
                            source={require("../../assets/icons/poketrainer.png")}
                            style={{
                                width: 40,
                                height: 40,
                            }}
                            resizeMode="contain"
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const Home = () => {
    return (
        <Stack.Navigator
            initialRouteName="Welcome"
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="Welcome"
                component={Welcome}
            />

            <Stack.Screen
                name="Login"
                component={Login}
            />

            <Stack.Screen
                name="Register"
                component={Register}
            />

            <Stack.Screen
                name="Home"
                component={Tabs}
            />

            <Stack.Screen
                name="Details"
                component={Details}
            />
        </Stack.Navigator>
    );
};

export default Home;
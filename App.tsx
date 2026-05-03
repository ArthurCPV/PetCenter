import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Diary from "./src/screens/Diary";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Diário" component={Diary} />
        <Tab.Screen name="Alertas" component={Diary} />
        <Tab.Screen name="IA" component={Diary} />
        <Tab.Screen name="Perfil" component={Diary} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
import { NavigationContainer } from "@react-navigation/native";
import * as Notifications from "expo-notifications";

import Home from "./src/navigation/Home";
import { AuthProvider } from "./src/auth/AuthContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Home />
      </NavigationContainer>
    </AuthProvider>
  );
}
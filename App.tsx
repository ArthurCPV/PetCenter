import {
  createNavigationContainerRef,
  NavigationContainer,
} from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";

import Home from "./src/navigation/Home";
import { AuthProvider, useAuth } from "./src/auth/AuthContext";
import type { HomeStack } from "./src/types/navigation";

const navigationRef = createNavigationContainerRef<HomeStack>();
const NOTIFICATION_SOURCE = "petcenter-alert";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const AppNavigation = () => {
  const { isAuthenticated } = useAuth();
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const [hasPendingAlertNavigation, setHasPendingAlertNavigation] =
    useState(false);

  useEffect(() => {
    let isMounted = true;

    const handleNotificationResponse = (
      response: Notifications.NotificationResponse | null,
    ): void => {
      if (!response) {
        return;
      }

      const { data } = response.notification.request.content;

      if (data.source === NOTIFICATION_SOURCE && data.alertId !== undefined) {
        setHasPendingAlertNavigation(true);
      }
    };

    const subscription =
      Notifications.addNotificationResponseReceivedListener(
        handleNotificationResponse,
      );

    void Notifications.getLastNotificationResponseAsync()
      .then((response) => {
        if (isMounted) {
          handleNotificationResponse(response);
        }
      })
      .catch((error: unknown) => {
        console.error("Não foi possível ler a interação com a notificação:", error);
      });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (
      !hasPendingAlertNavigation ||
      !isAuthenticated ||
      !isNavigationReady ||
      !navigationRef.isReady()
    ) {
      return;
    }

    navigationRef.navigate("Home", { screen: "Alerts" });
    setHasPendingAlertNavigation(false);

    void Notifications.clearLastNotificationResponseAsync().catch(
      (error: unknown) => {
        console.error("Não foi possível limpar a interação com a notificação:", error);
      },
    );
  }, [hasPendingAlertNavigation, isAuthenticated, isNavigationReady]);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => setIsNavigationReady(true)}
    >
      <Home />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppNavigation />
    </AuthProvider>
  );
}
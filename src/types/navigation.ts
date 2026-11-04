import type { NavigatorScreenParams } from "@react-navigation/native";

export type HomeStack = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Home: NavigatorScreenParams<TabsStack> | undefined;
};

export type TabsStack = {
  Diary: undefined;
  Alerts: undefined;
  AI: undefined;
  Profile: undefined;
};

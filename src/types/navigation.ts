import type { DiaryEntry } from "./index";

type HomeStack = {
  Welcome: undefined;
  Login: undefined;
  Home: undefined;
  Details: {
    entry: DiaryEntry;
  };
};

type TabsStack = {
  Diary: undefined;
  Alerts: undefined;
  AI: undefined;
  Profile: undefined;
};

export { type HomeStack, type TabsStack };

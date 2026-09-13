import type { DiaryEntry } from "./index";

export type HomeStack = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Details: {
    entry: DiaryEntry;
  };
};

export type TabsStack = {
  Diary: undefined;
  Alerts: undefined;
  AI: undefined;
  Profile: undefined;
};

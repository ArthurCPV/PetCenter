import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DiaryEntry } from "../types";

const STORAGE_KEY = "DIARY_ENTRIES";

export const useDiary = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data).map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt),
      }));
      setEntries(parsed);
    }
  };

  const saveEntries = async (newEntries: DiaryEntry[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
  };

  const addEntry = (title: string) => {
    const newEntry: DiaryEntry = {
      id: String(Date.now()),
      title,
      createdAt: new Date(),
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    saveEntries(updated);
  };

  return { entries, addEntry };
};
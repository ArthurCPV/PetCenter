import React from "react";
import { View, Text, FlatList } from "react-native";
import Form from "../../components/Form";
import EntryCard from "../../components/EntryCard";
import { useDiary } from "../../store/useDiary";
import { styles } from "../../styles/theme";
import { DiaryEntry } from "../../types";

import { Image } from "react-native";

type GroupedEntries = {
  Hoje: DiaryEntry[];
  Ontem: DiaryEntry[];
  Antigos: DiaryEntry[];
};

const groupByDate = (entries: DiaryEntry[]): GroupedEntries => {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  const groups: GroupedEntries = {
    Hoje: [],
    Ontem: [],
    Antigos: [],
  };

  entries.forEach((entry) => {
    const date = new Date(entry.createdAt).toDateString();

    if (date === today) groups.Hoje.push(entry);
    else if (date === yesterday) groups.Ontem.push(entry);
    else groups.Antigos.push(entry);
  });

  return groups;
};

const Diary = () => {
  const { entries, addEntry } = useDiary();

  const grouped = groupByDate(entries);

  const data = Object.entries(grouped) as [string, DiaryEntry[]][];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Image
            source={require("../../../assets/pokecenter-4.png")} // ajuste o caminho se necessário
            style={styles.logo}
          />
          <Text style={styles.title}>PetCenter</Text>
        </View>
      </View>

      <Form onSubmit={addEntry} />

      {entries.length === 0 && (
        <Text style={styles.emptyText}>
          Nenhum registro ainda. Comece hoje ✨
        </Text>
      )}

      <FlatList
        data={data}
        keyExtractor={(item) => item[0]}
        renderItem={({ item }) => {
          const [section, entries] = item;

          if (entries.length === 0) return null;

          return (
            <>
              <Text style={styles.sectionTitle}>{section}</Text>
              {entries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))}
            </>
          );
        }}
      />
    </View>
  );
};

export default Diary;
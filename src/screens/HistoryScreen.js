import React from "react";
import { FlatList, Text, StyleSheet } from "react-native";
import HistoryItem from "../components/HistoryItem";
import { colors, spacing } from "../../theme";

export default function HistoryScreen() {
  const history = [
    { id: "1", place: "Olivier OL-001", status: "Healthy", time: "08:30" },
    { id: "2", place: "Olivier OL-002", status: "Water Stress", time: "09:15" },
    { id: "3", place: "Olivier OL-003", status: "Disease Detected", time: "10:05" },
    { id: "4", place: "Olivier OL-004", status: "Healthy", time: "11:20" },
  ];

  return (
    <FlatList
      style={styles.container}
      data={history}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <HistoryItem item={item} />}
      ListHeaderComponent={
        <>
          <Text style={styles.title}>Historique</Text>
          <Text style={styles.subtitle}>Dernières observations des oliviers</Text>
        </>
      }
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listContent: { padding: spacing.lg },
  title: { fontSize: 26, fontWeight: "700", color: colors.text, marginTop: 20 },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: 5, marginBottom: 20 },
});
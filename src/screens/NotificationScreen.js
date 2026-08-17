import React, { useState } from "react";
import { FlatList, Text, View, StyleSheet } from "react-native";
import NotificationCard from "../components/NotificationCard";
import { colors, spacing } from "../../theme";

export default function NotificationScreen() {
  const [notifications] = useState([
    { id: "1", type: "disease", title: "Maladie détectée", message: "7 oliviers présentent des symptômes suspects.", time: "Aujourd'hui, 10:05", read: false },
    { id: "2", type: "waterStress", title: "Stress hydrique détecté", message: "5 oliviers nécessitent une surveillance.", time: "Aujourd'hui, 09:15", read: false },
    { id: "3", type: "system", title: "Capteur reconnecté", message: "Le capteur d'humidité du sol est de nouveau en ligne.", time: "Hier, 18:42", read: true },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <FlatList
      style={styles.container}
      data={notifications}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <NotificationCard notification={item} />}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <>
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>
            {unreadCount > 0 ? `${unreadCount} notification${unreadCount > 1 ? "s" : ""} non lue${unreadCount > 1 ? "s" : ""}` : "Tout est à jour"}
          </Text>
        </>
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Aucune notification</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listContent: { padding: spacing.lg },
  title: { fontSize: 26, fontWeight: "700", color: colors.text, marginTop: 20 },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: 5, marginBottom: 20 },
  empty: { alignItems: "center", marginTop: 60 },
  emptyText: { fontSize: 14, color: colors.sage },
});
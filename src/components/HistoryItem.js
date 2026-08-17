import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, radius } from "../../theme";

const STATUS_CONFIG = {
  "Healthy": { icon: "leaf", color: colors.success },
  "Water Stress": { icon: "water-alert", color: colors.clay },
  "Disease Detected": { icon: "leaf-off", color: colors.alert },
};

export default function HistoryItem({ item }) {
  const config = STATUS_CONFIG[item.status] || { icon: "help-circle", color: colors.textMuted };

  return (
    <View style={styles.container}>
      <View style={[styles.iconBox, { backgroundColor: `${config.color}22` }]}>
        <MaterialCommunityIcons name={config.icon} size={20} color={config.color} />
      </View>

      <View style={styles.info}>
        <Text style={styles.place}>{item.place}</Text>
        <Text style={[styles.status, { color: config.color }]}>{item.status}</Text>
      </View>

      <Text style={styles.time}>{item.time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 13,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconBox: { width: 38, height: 38, borderRadius: 12, justifyContent: "center", alignItems: "center", marginRight: 12 },
  info: { flex: 1 },
  place: { fontSize: 14, fontWeight: "700", color: colors.text },
  status: { fontSize: 12, marginTop: 2 },
  time: { fontSize: 11, color: colors.sage },
});
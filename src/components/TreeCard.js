import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, radius } from "../../theme";

const STATUS_CONFIG = {
  healthy: { icon: "leaf", color: colors.success, label: "Sain" },
  disease: { icon: "leaf-off", color: colors.alert, label: "Maladie détectée" },
  waterStress: { icon: "water-alert", color: colors.clay, label: "Stress hydrique" },
};

export default function TreeCard({ tree }) {
  const config = STATUS_CONFIG[tree.status] || STATUS_CONFIG.healthy;

  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: `${config.color}22` }]}>
        <MaterialCommunityIcons name="tree" size={24} color={config.color} />
      </View>

      <View style={styles.info}>
        <Text style={styles.id}>{tree.id}</Text>
        <View style={styles.statusRow}>
          <MaterialCommunityIcons name={config.icon} size={13} color={config.color} />
          <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
        </View>
      </View>

      <View style={styles.metrics}>
        <Text style={styles.metricValue}>{tree.soilMoisture}%</Text>
        <Text style={styles.metricLabel}>sol</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 13,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconBox: { width: 44, height: 44, borderRadius: 14, justifyContent: "center", alignItems: "center", marginRight: 12 },
  info: { flex: 1 },
  id: { fontSize: 14, fontWeight: "700", color: colors.text },
  statusRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  statusText: { fontSize: 11, marginLeft: 4 },
  metrics: { alignItems: "flex-end" },
  metricValue: { fontSize: 15, fontWeight: "700", color: colors.accent },
  metricLabel: { fontSize: 10, color: colors.sage },
});
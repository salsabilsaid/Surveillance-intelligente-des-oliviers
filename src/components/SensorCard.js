import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function SensorCard({ icon, title, value, unit, iconColor }) {
  return (
    <View style={styles.sensorCard}>
      <View style={[styles.sensorIcon, { backgroundColor: `${iconColor}18` }]}>
        <MaterialCommunityIcons name={icon} size={23} color={iconColor} />
      </View>

      <View style={styles.sensorInfo}>
        <Text style={styles.sensorTitle}>{title}</Text>
        <View style={styles.sensorValueRow}>
          <Text style={styles.sensorValue}>{value}</Text>
          <Text style={styles.sensorUnit}>{unit}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sensorCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 1,
  },
  sensorIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  sensorInfo: { flex: 1 },
  sensorTitle: { fontSize: 11, color: "#7A857A" },
  sensorValueRow: { flexDirection: "row", alignItems: "baseline", marginTop: 3 },
  sensorValue: { fontSize: 20, fontWeight: "700", color: "#283B2A" },
  sensorUnit: { fontSize: 11, color: "#7B877B", marginLeft: 3 },
});
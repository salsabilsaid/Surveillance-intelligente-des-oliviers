import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, radius } from "../../theme";

const TYPE_CONFIG = {
  disease: { icon: "leaf-off", color: colors.alert },
  waterStress: { icon: "water-alert", color: colors.clay },
  system: { icon: "access-point", color: colors.info },
};

export default function NotificationCard({ notification }) {
  const config = TYPE_CONFIG[notification.type] || TYPE_CONFIG.system;

  return (
    <View style={[styles.card, !notification.read && styles.unread]}>
      <View style={[styles.iconBox, { backgroundColor: `${config.color}22` }]}>
        <MaterialCommunityIcons name={config.icon} size={19} color={config.color} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.message}>{notification.message}</Text>
        <Text style={styles.time}>{notification.time}</Text>
      </View>

      {!notification.read && <View style={styles.dot} />}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 13,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  unread: { borderColor: colors.accent + "40" },
  iconBox: { width: 38, height: 38, borderRadius: 12, justifyContent: "center", alignItems: "center", marginRight: 12 },
  content: { flex: 1 },
  title: { fontSize: 13, fontWeight: "700", color: colors.text },
  message: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  time: { fontSize: 10, color: colors.sage, marginTop: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent, marginLeft: 8, marginTop: 4 },
});
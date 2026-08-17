import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { socket } from "../services/socket";
import { colors, radius, spacing } from "../../theme";

const SENSORS_CONFIG = [
  { key: "temperature", icon: "thermometer", title: "Température", unit: "°C", color: "#E08E45", description: "Température ambiante mesurée au niveau du verger.", range: { min: 15, max: 40 } },
  { key: "airHumidity", icon: "water-percent", title: "Humidité de l'air", unit: "%", color: colors.info, description: "Taux d'humidité présent dans l'air ambiant.", range: { min: 20, max: 90 } },
  { key: "soilMoisture", icon: "water", title: "Humidité du sol", unit: "%", color: colors.clay, description: "Niveau d'humidité mesuré dans le sol autour des racines.", range: { min: 0, max: 100 } },
  { key: "light", icon: "white-balance-sunny", title: "Rayonnement lumineux", unit: "kLux", color: colors.accent, description: "Intensité lumineuse reçue par les oliviers.", range: { min: 0, max: 100 } },
];

export default function SensorsScreen() {
  const [data, setData] = useState({ temperature: 31.5, airHumidity: 58, soilMoisture: 34, light: 42 });
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);
    const handleUpdate = (newData) => setData((prev) => ({ ...prev, ...newData }));

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("update", handleUpdate);
    if (socket.connected) setConnected(true);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("update", handleUpdate);
    };
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Capteurs</Text>
          <Text style={styles.subtitle}>Données environnementales en direct</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: connected ? `${colors.success}22` : `${colors.alert}22` }]}>
          <View style={[styles.dot, { backgroundColor: connected ? colors.success : colors.alert }]} />
          <Text style={[styles.badgeText, { color: connected ? colors.success : colors.alert }]}>
            {connected ? "LIVE" : "OFFLINE"}
          </Text>
        </View>
      </View>

      {SENSORS_CONFIG.map((sensor) => {
        const value = data[sensor.key];
        const ratio = Math.min(Math.max((value - sensor.range.min) / (sensor.range.max - sensor.range.min), 0), 1);

        return (
          <View key={sensor.key} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBox, { backgroundColor: `${sensor.color}22` }]}>
                <MaterialCommunityIcons name={sensor.icon} size={22} color={sensor.color} />
              </View>
              <View style={styles.cardHeaderInfo}>
                <Text style={styles.cardTitle}>{sensor.title}</Text>
                <Text style={styles.cardValue}>{value}<Text style={styles.cardUnit}> {sensor.unit}</Text></Text>
              </View>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${ratio * 100}%`, backgroundColor: sensor.color }]} />
            </View>
            <Text style={styles.description}>{sensor.description}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "700", color: colors.text },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  badge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 7, borderRadius: 20 },
  dot: { width: 7, height: 7, borderRadius: 4, marginRight: 6 },
  badgeText: { fontSize: 10, fontWeight: "700", letterSpacing: 1 },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: colors.border },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  iconBox: { width: 44, height: 44, borderRadius: 14, justifyContent: "center", alignItems: "center", marginRight: 12 },
  cardHeaderInfo: { flex: 1 },
  cardTitle: { fontSize: 13, color: colors.textMuted },
  cardValue: { fontSize: 20, fontWeight: "700", color: colors.text, marginTop: 2 },
  cardUnit: { fontSize: 13, fontWeight: "400", color: colors.sage },
  barTrack: { height: 6, backgroundColor: colors.surfaceAlt, borderRadius: 3, overflow: "hidden", marginBottom: 10 },
  barFill: { height: "100%", borderRadius: 3 },
  description: { fontSize: 12, color: colors.textMuted, lineHeight: 17 },
});
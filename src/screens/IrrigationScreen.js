import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Switch, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { socket } from "../services/socket";
import { colors, radius, spacing } from "../../theme";

export default function IrrigationScreen() {
  const [irrigation, setIrrigation] = useState(false);
  const [connected, setConnected] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);
    const handleUpdate = (newData) => {
      if (newData.irrigation !== undefined) {
        setIrrigation(newData.irrigation);
        setPending(false);
      }
    };

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

  const toggleIrrigation = (value) => {
    if (!connected) return;
    setPending(true);
    setIrrigation(value);
    socket.emit("irrigation_control", { irrigation: value });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Irrigation</Text>
      <Text style={styles.subtitle}>Contrôle du système d'arrosage</Text>

      <View style={styles.card}>
        <View style={[styles.iconCircle, { backgroundColor: irrigation ? `${colors.info}22` : colors.surfaceAlt }]}>
          <MaterialCommunityIcons name="water-pump" size={36} color={irrigation ? colors.info : colors.sage} />
        </View>

        <Text style={styles.status}>{irrigation ? "Irrigation en cours" : "Irrigation désactivée"}</Text>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>{irrigation ? "Activée" : "Désactivée"}</Text>
          {pending ? (
            <ActivityIndicator size="small" color={colors.info} style={styles.switchLoader} />
          ) : (
            <Switch
              value={irrigation}
              onValueChange={toggleIrrigation}
              disabled={!connected}
              trackColor={{ false: colors.surfaceAlt, true: `${colors.info}80` }}
              thumbColor={irrigation ? colors.info : colors.textMuted}
            />
          )}
        </View>

        {!connected && (
          <View style={styles.warningBox}>
            <MaterialCommunityIcons name="alert-circle-outline" size={16} color={colors.alert} />
            <Text style={styles.warningText}>Système hors ligne — le contrôle est indisponible.</Text>
          </View>
        )}
      </View>

      <View style={styles.infoBox}>
        <MaterialCommunityIcons name="information-outline" size={16} color={colors.sage} />
        <Text style={styles.infoText}>L'activation manuelle envoie une commande directe à l'ESP32. Le statut réel est confirmé dès réception.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  title: { fontSize: 24, fontWeight: "700", color: colors.text, marginTop: 10 },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: 4, marginBottom: 24 },
  card: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: 24, alignItems: "center", borderWidth: 1, borderColor: colors.border },
  iconCircle: { width: 84, height: 84, borderRadius: 24, justifyContent: "center", alignItems: "center", marginBottom: 16 },
  status: { fontSize: 16, fontWeight: "700", color: colors.text },
  switchRow: { flexDirection: "row", alignItems: "center", marginTop: 20 },
  switchLabel: { fontSize: 13, color: colors.textMuted, marginRight: 12 },
  switchLoader: { marginLeft: 4 },
  warningBox: { flexDirection: "row", alignItems: "center", marginTop: 18, backgroundColor: `${colors.alert}18`, borderRadius: 10, padding: 10 },
  warningText: { fontSize: 11, color: colors.alert, marginLeft: 6, flex: 1 },
  infoBox: { flexDirection: "row", alignItems: "flex-start", backgroundColor: colors.surface, borderRadius: 12, padding: 12, marginTop: 20, borderWidth: 1, borderColor: colors.border },
  infoText: { fontSize: 11, color: colors.textMuted, marginLeft: 8, flex: 1, lineHeight: 16 },
});
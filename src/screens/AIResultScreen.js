import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { socket } from "../services/socket";
import { colors, radius, spacing } from "../../theme";

const STATUS_CONFIG = {
  healthy: { icon: "leaf", color: colors.success, label: "Sain", message: "Aucun problème détecté sur cet olivier." },
  disease: { icon: "leaf-off", color: colors.alert, label: "Maladie détectée", message: "Des symptômes de maladie ont été identifiés." },
  waterStress: { icon: "water-alert", color: colors.clay, label: "Stress hydrique", message: "Cet olivier manque d'eau." },
};

export default function AIResultScreen() {
  const route = useRoute();
  const { tree } = route.params || {};

  const [analysis, setAnalysis] = useState(tree ? { status: tree.status, treeId: tree.id, live: false } : null);

  useEffect(() => {
    if (!tree) return;
    const handleAnalysis = (payload) => {
      if (payload.treeId === tree.id) setAnalysis({ ...payload, live: true });
    };
    socket.on("analysis", handleAnalysis);
    return () => socket.off("analysis", handleAnalysis);
  }, [tree]);

  if (!tree) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Aucun olivier sélectionné.</Text>
      </View>
    );
  }

  const config = STATUS_CONFIG[analysis?.status] || STATUS_CONFIG.healthy;

  return (
    <View style={styles.container}>
      <Text style={styles.treeLabel}>Olivier {tree.id}</Text>
      <Text style={styles.title}>Analyse IA</Text>

      <View style={[styles.resultCard, { backgroundColor: `${config.color}15` }]}>
        <View style={[styles.iconCircle, { backgroundColor: `${config.color}25` }]}>
          <MaterialCommunityIcons name={config.icon} size={36} color={config.color} />
        </View>
        <Text style={[styles.statusLabel, { color: config.color }]}>{config.label}</Text>
        <Text style={styles.message}>{analysis?.message || config.message}</Text>
        {analysis?.confidence != null && (
          <Text style={styles.confidence}>Confiance : {Math.round(analysis.confidence * 100)}%</Text>
        )}
        <View style={styles.liveBadge}>
          <View style={[styles.liveDot, { backgroundColor: analysis?.live ? colors.success : colors.sage }]} />
          <Text style={styles.liveText}>{analysis?.live ? "Analyse en direct" : "Dernier statut connu"}</Text>
        </View>
      </View>

      <View style={styles.waitingBox}>
        <ActivityIndicator size="small" color={colors.sage} />
        <Text style={styles.waitingText}>En attente d'une nouvelle analyse ESP32...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  treeLabel: { fontSize: 12, fontWeight: "700", color: colors.sage, letterSpacing: 1, marginTop: 10 },
  title: { fontSize: 22, fontWeight: "700", color: colors.text, marginTop: 6, marginBottom: 20 },
  errorText: { fontSize: 14, color: colors.sage, textAlign: "center", marginTop: 40 },
  resultCard: { borderRadius: radius.xl, padding: 24, alignItems: "center", borderWidth: 1, borderColor: colors.border },
  iconCircle: { width: 76, height: 76, borderRadius: 22, justifyContent: "center", alignItems: "center", marginBottom: 14 },
  statusLabel: { fontSize: 19, fontWeight: "700" },
  message: { fontSize: 13, color: colors.textMuted, textAlign: "center", marginTop: 8, lineHeight: 19 },
  confidence: { fontSize: 12, color: colors.sage, marginTop: 10 },
  liveBadge: { flexDirection: "row", alignItems: "center", marginTop: 16 },
  liveDot: { width: 7, height: 7, borderRadius: 4, marginRight: 6 },
  liveText: { fontSize: 11, color: colors.textMuted },
  waitingBox: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 24 },
  waitingText: { fontSize: 12, color: colors.sage, marginLeft: 8 },
});
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { colors, radius, spacing } from "../../theme";

const STATUS_CONFIG = {
  healthy: { icon: "leaf", color: colors.success, label: "Sain" },
  disease: { icon: "leaf-off", color: colors.alert, label: "Maladie détectée" },
  waterStress: { icon: "water-alert", color: colors.clay, label: "Stress hydrique" },
};

export default function TreeDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { tree } = route.params || {};

  if (!tree) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Aucune donnée pour cet olivier.</Text>
      </View>
    );
  }

  const config = STATUS_CONFIG[tree.status] || STATUS_CONFIG.healthy;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.statusBanner, { backgroundColor: `${config.color}18` }]}>
        <View style={[styles.statusIcon, { backgroundColor: `${config.color}25` }]}>
          <MaterialCommunityIcons name="tree" size={34} color={config.color} />
        </View>
        <Text style={styles.treeId}>{tree.id}</Text>
        <View style={styles.statusRow}>
          <MaterialCommunityIcons name={config.icon} size={15} color={config.color} />
          <Text style={[styles.statusLabel, { color: config.color }]}>{config.label}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>DONNÉES CAPTEUR</Text>
      <View style={styles.metricCard}>
        <MaterialCommunityIcons name="water" size={20} color={colors.clay} />
        <View style={styles.metricInfo}>
          <Text style={styles.metricLabel}>Humidité du sol</Text>
          <Text style={styles.metricValue}>{tree.soilMoisture}%</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>ACTIONS</Text>
      <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("AIResult", { tree })}>
        <MaterialCommunityIcons name="brain" size={19} color={colors.background} />
        <Text style={styles.actionButtonText}>Voir l'analyse IA</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  errorText: { fontSize: 14, color: colors.sage, textAlign: "center", marginTop: 40 },
  statusBanner: { borderRadius: radius.xl, padding: 24, alignItems: "center", marginBottom: 20 },
  statusIcon: { width: 66, height: 66, borderRadius: 20, justifyContent: "center", alignItems: "center", marginBottom: 12 },
  treeId: { fontSize: 20, fontWeight: "700", color: colors.text },
  statusRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  statusLabel: { fontSize: 13, fontWeight: "600", marginLeft: 5 },
  sectionTitle: { fontSize: 11, fontWeight: "700", letterSpacing: 1.5, color: colors.sage, marginBottom: 12, marginTop: 8 },
  metricCard: { flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderRadius: radius.md, padding: 15, marginBottom: 20, borderWidth: 1, borderColor: colors.border },
  metricInfo: { marginLeft: 12 },
  metricLabel: { fontSize: 12, color: colors.textMuted },
  metricValue: { fontSize: 17, fontWeight: "700", color: colors.text, marginTop: 2 },
  actionButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: colors.accent, borderRadius: radius.md, paddingVertical: 14 },
  actionButtonText: { color: colors.background, fontWeight: "700", fontSize: 14, marginLeft: 8 },
});
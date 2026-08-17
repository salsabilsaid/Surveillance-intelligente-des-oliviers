import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BASE_URL } from "../config";
import { colors, radius, spacing } from "../../theme";
import { useAuth } from "../context/AuthContext";
export default function SettingsScreen() {
  const [notifDisease, setNotifDisease] = useState(true);
  const [notifWater, setNotifWater] = useState(true);
  const [notifSystem, setNotifSystem] = useState(false);
  const { logout } = useAuth();

  const SettingRow = ({ icon, title, subtitle, value, onValueChange }) => (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <MaterialCommunityIcons name={icon} size={18} color={colors.accent} />
      </View>
      <View style={styles.rowInfo}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle && <Text style={styles.rowSubtitle}>{subtitle}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.surfaceAlt, true: `${colors.accent}80` }}
        thumbColor={value ? colors.accent : colors.textMuted}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Paramètres</Text>

      <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
      <View style={styles.card}>
        <SettingRow icon="leaf-off" title="Maladies détectées" subtitle="Alerte immédiate en cas de détection" value={notifDisease} onValueChange={setNotifDisease} />
        <View style={styles.divider} />
        <SettingRow icon="water-alert" title="Stress hydrique" subtitle="Alerte quand un olivier manque d'eau" value={notifWater} onValueChange={setNotifWater} />
        <View style={styles.divider} />
        <SettingRow icon="access-point" title="État du système" subtitle="Connexion/déconnexion des capteurs" value={notifSystem} onValueChange={setNotifSystem} />
      </View>

      <Text style={styles.sectionTitle}>SYSTÈME</Text>
      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Serveur</Text>
          <Text style={styles.infoValue}>{BASE_URL}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.dangerButton} onPress={logout}>
        <MaterialCommunityIcons name="logout" size={18} color={colors.alert} />
        <Text style={styles.dangerButtonText}>Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  title: { fontSize: 24, fontWeight: "700", color: colors.text, marginTop: 10, marginBottom: 20 },
  sectionTitle: { fontSize: 11, fontWeight: "700", letterSpacing: 1.5, color: colors.sage, marginBottom: 10, marginTop: 10 },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, paddingHorizontal: 15, borderWidth: 1, borderColor: colors.border },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 14 },
  rowIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.surfaceAlt, justifyContent: "center", alignItems: "center", marginRight: 12 },
  rowInfo: { flex: 1 },
  rowTitle: { fontSize: 14, fontWeight: "600", color: colors.text },
  rowSubtitle: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.border },
  infoRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 14 },
  infoLabel: { fontSize: 13, color: colors.textMuted },
  infoValue: { fontSize: 13, fontWeight: "600", color: colors.text },
  dangerButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: `${colors.alert}18`, borderRadius: radius.md, paddingVertical: 14, marginTop: 24 },
  dangerButtonText: { color: colors.alert, fontWeight: "700", fontSize: 14, marginLeft: 8 },
});
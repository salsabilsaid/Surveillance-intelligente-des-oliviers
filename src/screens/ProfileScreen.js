import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors, radius, spacing } from "../../theme";

export default function ProfileScreen() {
  const navigation = useNavigation();

  const InfoRow = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
      <MaterialCommunityIcons name={icon} size={17} color={colors.sage} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarBox}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons name="account" size={40} color={colors.accent} />
        </View>
        <Text style={styles.name}>Exploitation Olive AIoT</Text>
        <Text style={styles.role}>Propriétaire</Text>
      </View>

      <Text style={styles.sectionTitle}>INFORMATIONS</Text>
      <View style={styles.card}>
        <InfoRow icon="map-marker-outline" label="Localisation" value="Tunis, Tunisie" />
        <View style={styles.divider} />
        <InfoRow icon="tree-outline" label="Oliviers suivis" value="120" />
        <View style={styles.divider} />
        <InfoRow icon="calendar-outline" label="Membre depuis" value="2025" />
      </View>

      <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate("Settings")}>
        <MaterialCommunityIcons name="cog-outline" size={18} color={colors.accent} />
        <Text style={styles.settingsButtonText}>Paramètres</Text>
        <MaterialCommunityIcons name="chevron-right" size={20} color={colors.sage} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  avatarBox: { alignItems: "center", marginTop: 20, marginBottom: 24 },
  avatar: { width: 84, height: 84, borderRadius: 26, backgroundColor: colors.surface, justifyContent: "center", alignItems: "center", marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  name: { fontSize: 18, fontWeight: "700", color: colors.text },
  role: { fontSize: 13, color: colors.textMuted, marginTop: 3 },
  sectionTitle: { fontSize: 11, fontWeight: "700", letterSpacing: 1.5, color: colors.sage, marginBottom: 10 },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, paddingHorizontal: 15, borderWidth: 1, borderColor: colors.border },
  infoRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14 },
  infoLabel: { fontSize: 13, color: colors.textMuted, marginLeft: 10, flex: 1 },
  infoValue: { fontSize: 13, fontWeight: "600", color: colors.text },
  divider: { height: 1, backgroundColor: colors.border },
  settingsButton: { flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderRadius: radius.md, padding: 15, marginTop: 20, borderWidth: 1, borderColor: colors.border },
  settingsButtonText: { fontSize: 14, fontWeight: "600", color: colors.text, marginLeft: 10, flex: 1 },
});
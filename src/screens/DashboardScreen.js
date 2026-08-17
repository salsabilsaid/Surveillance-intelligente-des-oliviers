import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Animated,
  Modal,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { socket } from "../services/socket";
import SensorCard from "../components/SensorCard";
import { colors, radius, spacing } from "../../theme";
import { useTrees } from "../context/TreeContext";
import TrendChart from "../components/TrendChart";

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { addTree } = useTrees();
  const [modalVisible, setModalVisible] = useState(false);
  const [newId, setNewId] = useState("");
  const [newStatus, setNewStatus] = useState("healthy");

  const today = new Date().toLocaleDateString("fr-FR");

  const STATUS_OPTIONS = [
    { value: "healthy", label: "Sain", color: colors.success },
    { value: "waterStress", label: "Stress hydrique", color: colors.clay },
    { value: "disease", label: "Maladie", color: colors.alert },
  ];

  const handleAddTree = () => {
    if (!newId.trim()) return;

    addTree({ id: newId.trim(), status: newStatus, addedAt: today });

    setNewId("");
    setNewStatus("healthy");
    setModalVisible(false);
  };

  const [connected, setConnected] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [data, setData] = useState({
    totalTrees: 120,
    healthyTrees: 108,
    diseasedTrees: 7,
    waterStressTrees: 5,
    temperature: 31.5,
    airHumidity: 58,
    soilMoisture: 34,
    light: 42,
    irrigation: false,
  });
  

  const [lastUpdate, setLastUpdate] = useState("-");

  // Pulsation du point LIVE
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.3, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  useEffect(() => {
    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);
    const handleUpdate = (newData) => {
      console.log("IoT update :", newData);
      setData((prev) => ({ ...prev, ...newData }));
      setLastUpdate(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
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

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const healthRate =
    data.totalTrees > 0 ? Math.round((data.healthyTrees / data.totalTrees) * 100) : 0;
  const healthTrend = [
    { label: "Lun", value: 82 },
    { label: "Mar", value: 85 },
    { label: "Mer", value: 84 },
    { label: "Jeu", value: 88 },
    { label: "Ven", value: 86 },
    { label: "Sam", value: 89 },
    { label: "Dim", value: healthRate },
  ];
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.surface, colors.background]}
        style={styles.headerGradient}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
      >
        {/* ================= HEADER ================= */}
        <View style={styles.header}>
          <View>
            <Text style={styles.smallTitle}>OLIVE AIoT</Text>
            <Text style={styles.title}>Bonjour 👋</Text>

            <View style={styles.liveRow}>
              <Animated.View
                style={[
                  styles.liveDot,
                  { backgroundColor: connected ? colors.success : colors.alert, opacity: pulse },
                ]}
              />
              <Text style={styles.liveText}>{connected ? "En direct" : "Hors ligne"}</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.settingsIcon} onPress={() => setModalVisible(true)}>
              <MaterialCommunityIcons name="plus" size={22} color={colors.sage} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingsIcon} onPress={() => navigation.navigate("Settings")}>
              <MaterialCommunityIcons name="cog-outline" size={22} color={colors.sage} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.updateText}>
          {lastUpdate !== "-" ? `Dernière mise à jour • ${lastUpdate}` : "En attente de données..."}
        </Text>

        {/* ================= HERO : SANTÉ DU VERGER ================= */}
        <View style={styles.heroCard}>
          <Text style={styles.heroEyebrow}>SANTÉ DU VERGER</Text>

          <View style={styles.heroValueRow}>
            <Text style={styles.heroValue}>{healthRate}</Text>
            <Text style={styles.heroPercent}>%</Text>
          </View>
          <Text style={styles.heroCaption}>{data.healthyTrees} oliviers sains sur {data.totalTrees}</Text>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${healthRate}%` }]} />
          </View>

          <View style={styles.miniStatsRow}>
            <View style={styles.miniStat}>
              <MaterialCommunityIcons name="tree" size={16} color={colors.sage} />
              <Text style={styles.miniStatValue}>{data.totalTrees}</Text>
              <Text style={styles.miniStatLabel}>Total</Text>
            </View>

            <View style={styles.miniStatDivider} />

            <View style={styles.miniStat}>
              <MaterialCommunityIcons name="leaf-off" size={16} color={colors.alert} />
              <Text style={styles.miniStatValue}>{data.diseasedTrees}</Text>
              <Text style={styles.miniStatLabel}>Maladies</Text>
            </View>

            <View style={styles.miniStatDivider} />

            <View style={styles.miniStat}>
              <MaterialCommunityIcons name="water-alert" size={16} color={colors.clay} />
              <Text style={styles.miniStatValue}>{data.waterStressTrees}</Text>
              <Text style={styles.miniStatLabel}>Stress</Text>
            </View>
          </View>
        </View>
        {/* ================= TENDANCE SANTÉ ================= */}
        <TrendChart title="TENDANCE SUR 7 JOURS" data={healthTrend} unit="%" color={colors.accent} />

        

        {/* ================= ENVIRONMENT ================= */}
        <TouchableOpacity onPress={() => navigation.navigate("Sensors")} style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>DONNÉES ENVIRONNEMENTALES</Text>
          <MaterialCommunityIcons name="chevron-right" size={16} color={colors.sage} />
        </TouchableOpacity>

        <View style={styles.sensorGrid}>
          <SensorCard icon="thermometer" title="Température" value={data.temperature} unit="°C" iconColor="#E08E45" />
          <SensorCard icon="water-percent" title="Humidité air" value={data.airHumidity} unit="%" iconColor={colors.info} />
          <SensorCard icon="water" title="Humidité sol" value={data.soilMoisture} unit="%" iconColor={colors.clay} />
          <SensorCard icon="white-balance-sunny" title="Rayonnement" value={data.light} unit="kLux" iconColor={colors.accent} />
        </View>

        {/* ================= IRRIGATION ================= */}
        <Text style={styles.sectionTitle}>IRRIGATION</Text>
        <TouchableOpacity style={styles.irrigationCard} onPress={() => navigation.navigate("Irrigation")}>
          <View style={[styles.irrigationIcon, { backgroundColor: data.irrigation ? `${colors.info}25` : colors.surfaceAlt }]}>
            <MaterialCommunityIcons name="water-pump" size={26} color={data.irrigation ? colors.info : colors.sage} />
          </View>

          <View style={styles.irrigationInfo}>
            <Text style={styles.irrigationTitle}>Système d'irrigation</Text>
            <Text style={styles.irrigationStatus}>
              {data.irrigation ? "Irrigation en cours" : "Irrigation désactivée"}
            </Text>
          </View>

          <View style={[styles.irrigationBadge, { backgroundColor: data.irrigation ? `${colors.info}25` : colors.surfaceAlt }]}>
            <Text style={[styles.irrigationBadgeText, { color: data.irrigation ? colors.info : colors.textMuted }]}>
              {data.irrigation ? "ON" : "OFF"}
            </Text>
          </View>
        </TouchableOpacity>

        {/* ================= ALERTS ================= */}
        <Text style={styles.sectionTitle}>ALERTES RÉCENTES</Text>

        <View style={styles.alertCard}>
          <View style={[styles.alertIcon, { backgroundColor: `${colors.clay}22` }]}>
            <MaterialCommunityIcons name="water-alert" size={20} color={colors.clay} />
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Stress hydrique détecté</Text>
            <Text style={styles.alertText}>5 oliviers nécessitent une surveillance.</Text>
          </View>
          <Text style={styles.alertTime}>Maintenant</Text>
        </View>

        <View style={styles.alertCard}>
          <View style={[styles.alertIcon, { backgroundColor: `${colors.alert}22` }]}>
            <MaterialCommunityIcons name="leaf-off" size={20} color={colors.alert} />
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Maladie détectée</Text>
            <Text style={styles.alertText}>7 oliviers présentent des symptômes.</Text>
          </View>
          <Text style={styles.alertTime}>Aujourd'hui</Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Nouvel olivier</Text>

            <Text style={styles.fieldLabel}>ID de l'olivier</Text>
            <TextInput
              style={styles.input}
              placeholder="ex: OL-006"
              placeholderTextColor={colors.sage}
              value={newId}
              onChangeText={setNewId}
              autoCapitalize="characters"
            />

            <Text style={styles.fieldLabel}>Date d'ajout</Text>
            <View style={styles.dateBox}>
              <MaterialCommunityIcons name="calendar" size={16} color={colors.sage} />
              <Text style={styles.dateText}>{today}</Text>
            </View>

            <Text style={styles.fieldLabel}>État de santé</Text>
            <View style={styles.statusOptions}>
              {STATUS_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.statusOption,
                    newStatus === option.value && { backgroundColor: `${option.color}25`, borderColor: option.color },
                  ]}
                  onPress={() => setNewStatus(option.value)}
                >
                  <Text style={[styles.statusOptionText, newStatus === option.value && { color: option.color }]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmButton, !newId.trim() && styles.confirmButtonDisabled]}
                onPress={handleAddTree}
                disabled={!newId.trim()}
              >
                <Text style={styles.confirmButtonText}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerGradient: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    height: 260,
  },

  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: 55,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  smallTitle: { fontSize: 12, fontWeight: "700", letterSpacing: 2, color: colors.accent, marginBottom: 6 },
  title: { fontSize: 26, fontWeight: "700", color: colors.text },
  liveRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  liveDot: { width: 7, height: 7, borderRadius: 4, marginRight: 6 },
  liveText: { fontSize: 12, color: colors.textMuted },
  settingsIcon: {
    width: 38, height: 38, borderRadius: 13,
    backgroundColor: colors.surface,
    justifyContent: "center", alignItems: "center",
    borderWidth: 1, borderColor: colors.border,
  },

  updateText: { fontSize: 11, color: colors.textMuted, marginHorizontal: spacing.lg, marginTop: 14, marginBottom: 18 },

  heroCard: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  heroEyebrow: { fontSize: 11, fontWeight: "700", letterSpacing: 1.5, color: colors.sage },
  heroValueRow: { flexDirection: "row", alignItems: "flex-end", marginTop: 8 },
  heroValue: { fontSize: 52, fontWeight: "700", color: colors.accent, lineHeight: 54 },
  heroPercent: { fontSize: 22, fontWeight: "700", color: colors.accent, marginLeft: 4, marginBottom: 6 },
  heroCaption: { fontSize: 13, color: colors.textMuted, marginTop: 2, marginBottom: 16 },

  progressTrack: { height: 6, backgroundColor: colors.surfaceAlt, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: colors.accent, borderRadius: 3 },

  miniStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  miniStat: { flex: 1, alignItems: "center" },
  miniStatValue: { fontSize: 17, fontWeight: "700", color: colors.text, marginTop: 4 },
  miniStatLabel: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  miniStatDivider: { width: 1, height: 30, backgroundColor: colors.border },

  sectionHeader: {
    flexDirection: "row", alignItems: "center",
    marginHorizontal: spacing.lg, marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11, fontWeight: "700", letterSpacing: 1.5, color: colors.sage,
    marginHorizontal: spacing.lg, marginBottom: 12, marginTop: 4,
  },

  sensorGrid: { paddingHorizontal: spacing.lg, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },

  irrigationCard: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  irrigationIcon: { width: 48, height: 48, borderRadius: 15, justifyContent: "center", alignItems: "center" },
  irrigationInfo: { flex: 1, marginLeft: 13 },
  irrigationTitle: { fontSize: 14, fontWeight: "700", color: colors.text },
  irrigationStatus: { fontSize: 12, color: colors.textMuted, marginTop: 3 },
  irrigationBadge: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 12 },
  irrigationBadgeText: { fontSize: 11, fontWeight: "700" },

  alertCard: {
    marginHorizontal: spacing.lg, marginBottom: 10,
    backgroundColor: colors.surface, borderRadius: radius.md, padding: 13,
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: colors.border,
  },
  alertIcon: { width: 40, height: 40, borderRadius: 13, justifyContent: "center", alignItems: "center" },
  alertContent: { flex: 1, marginLeft: 12 },
  alertTitle: { fontSize: 13, fontWeight: "700", color: colors.text },
  alertText: { fontSize: 11, color: colors.textMuted, marginTop: 3 },
  alertTime: { fontSize: 10, color: colors.sage },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", color: colors.text, marginBottom: 18 },
  fieldLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 1, color: colors.sage, marginBottom: 8, marginTop: 12 },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateText: { fontSize: 14, color: colors.textMuted, marginLeft: 8 },
  statusOptions: { flexDirection: "row", gap: 8 },
  statusOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
  },
  statusOptionText: { fontSize: 11, fontWeight: "600", color: colors.textMuted },
  modalActions: { flexDirection: "row", gap: 10, marginTop: 24 },
  cancelButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: radius.md,
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
  },
  cancelButtonText: { color: colors.textMuted, fontWeight: "600", fontSize: 14 },
  confirmButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: radius.md,
    alignItems: "center",
    backgroundColor: colors.accent,
  },
  confirmButtonDisabled: { backgroundColor: colors.surfaceAlt },
  confirmButtonText: { color: colors.background, fontWeight: "700", fontSize: 14 },
});
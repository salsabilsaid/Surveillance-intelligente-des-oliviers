import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import HistoryItem from "../components/HistoryItem";
import { colors, spacing } from "../../theme";
import { getHistory } from "../services/api";
import { socket } from "../services/socket";

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // CHARGER L'HISTORIQUE
  // =========================
  const loadHistory = async () => {
    try {
      const response = await getHistory();

      console.log("Historique reçu :", response.data);

      setHistory(response.data);
    } catch (error) {
      console.error(
        "Erreur récupération historique :",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // API + SOCKET.IO
  // =========================
  useEffect(() => {
    loadHistory();

    const handleNewDiagnostic = (diagnostic) => {
      console.log("Nouveau diagnostic reçu :", diagnostic);

      // On recharge l'historique depuis MongoDB
      loadHistory();
    };

    socket.on("nouveau_diagnostic", handleNewDiagnostic);

    return () => {
      socket.off("nouveau_diagnostic", handleNewDiagnostic);
    };
  }, []);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>
          Chargement de l'historique...
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={history}
      keyExtractor={(item, index) =>
        item.id?.toString() || index.toString()
      }
      renderItem={({ item }) => (
        <HistoryItem item={item} />
      )}
      ListHeaderComponent={
        <>
          <Text style={styles.title}>Historique</Text>

          <Text style={styles.subtitle}>
            Dernières observations des oliviers
          </Text>
        </>
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            Aucun historique disponible
          </Text>

          <Text style={styles.emptySubtext}>
            Les diagnostics apparaîtront ici automatiquement.
          </Text>
        </View>
      }
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  listContent: {
    padding: spacing.lg,
    paddingBottom: 30,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.text,
    marginTop: 20,
  },

  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 5,
    marginBottom: 20,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },

  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: colors.textMuted,
  },

  empty: {
    alignItems: "center",
    marginTop: 60,
  },

  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },

  emptySubtext: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 8,
    textAlign: "center",
  },
});
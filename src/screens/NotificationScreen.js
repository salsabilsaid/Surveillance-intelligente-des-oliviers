import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import NotificationCard from "../components/NotificationCard";
import { colors, spacing } from "../../theme";
import { getAlerts } from "../services/api";
import { socket } from "../services/socket";

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // CHARGER LES NOTIFICATIONS
  // =========================
  const loadNotifications = async () => {
    try {
      const response = await getAlerts();

      console.log("Notifications reçues :", response.data);

      setNotifications(response.data);
    } catch (error) {
      console.error(
        "Erreur récupération notifications :",
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
    loadNotifications();

    const handleNewDiagnostic = (diagnostic) => {
      console.log(
        "Nouveau diagnostic reçu pour notification :",
        diagnostic
      );

      // Recharge les alertes créées par le backend
      loadNotifications();
    };

    socket.on("nouveau_diagnostic", handleNewDiagnostic);

    return () => {
      socket.off("nouveau_diagnostic", handleNewDiagnostic);
    };
  }, []);

  // =========================
  // MARQUER COMME LUE
  // =========================
  const markAsRead = async (notification) => {
    try {
      const response = await fetch(
        `${require("../config").BASE_URL}/api/alerts/${notification.id}/read`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Impossible de marquer la notification");
      }

      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? { ...item, read: true }
            : item
        )
      );
    } catch (error) {
      console.error("Erreur notification :", error);
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Chargement des notifications...
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={notifications}
      keyExtractor={(item, index) =>
        item.id?.toString() || index.toString()
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (!item.read) {
              markAsRead(item);
            }
          }}
        >
          <NotificationCard notification={item} />
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <>
          <Text style={styles.title}>
            Notifications
          </Text>

          <Text style={styles.subtitle}>
            {unreadCount > 0
              ? `${unreadCount} notification${
                  unreadCount > 1 ? "s" : ""
                } non lue${
                  unreadCount > 1 ? "s" : ""
                }`
              : "Tout est à jour"}
          </Text>
        </>
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            Aucune notification
          </Text>

          <Text style={styles.emptySubtext}>
            Les alertes apparaîtront ici automatiquement.
          </Text>
        </View>
      }
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
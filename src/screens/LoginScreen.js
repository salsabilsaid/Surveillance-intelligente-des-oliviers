import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { colors, radius, spacing } from "../../theme";

export default function LoginScreen({ navigation }) {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    login(email, password);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.logoBox}>
        <View style={styles.logoCircle}>
          <MaterialCommunityIcons name="tree" size={38} color={colors.accent} />
        </View>
        <Text style={styles.appName}>OLIVE AIoT</Text>
        <Text style={styles.tagline}>Surveillance intelligente des oliviers</Text>
      </View>

      <Text style={styles.title}>Connexion</Text>

      <Text style={styles.fieldLabel}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="vous@exemple.com"
        placeholderTextColor={colors.sage}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.fieldLabel}>Mot de passe</Text>
      <View style={styles.passwordRow}>
        <TextInput
          style={styles.passwordInput}
          placeholder="••••••••"
          placeholderTextColor={colors.sage}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
          <MaterialCommunityIcons name={showPassword ? "eye-off" : "eye"} size={20} color={colors.sage} />
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color={colors.background} /> : <Text style={styles.primaryButtonText}>Se connecter</Text>}
      </TouchableOpacity>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Pas encore de compte ? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.footerLink}>Créer un compte</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, justifyContent: "center" },
  logoBox: { alignItems: "center", marginBottom: 40 },
  logoCircle: {
    width: 76, height: 76, borderRadius: 22,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    justifyContent: "center", alignItems: "center", marginBottom: 14,
  },
  appName: { fontSize: 13, fontWeight: "700", letterSpacing: 2, color: colors.accent },
  tagline: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  title: { fontSize: 24, fontWeight: "700", color: colors.text, marginBottom: 24 },
  fieldLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 1, color: colors.sage, marginBottom: 8, marginTop: 14 },
  input: {
    backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: 15, paddingVertical: 13,
    color: colors.text, fontSize: 14, borderWidth: 1, borderColor: colors.border,
  },
  passwordRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: 15,
    borderWidth: 1, borderColor: colors.border,
  },
  passwordInput: { flex: 1, paddingVertical: 13, color: colors.text, fontSize: 14 },
  errorText: { color: colors.alert, fontSize: 12, marginTop: 14, textAlign: "center" },
  primaryButton: {
    backgroundColor: colors.accent, borderRadius: radius.md, paddingVertical: 15,
    alignItems: "center", marginTop: 26,
  },
  primaryButtonText: { color: colors.background, fontWeight: "700", fontSize: 15 },
  footerRow: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { fontSize: 13, color: colors.textMuted },
  footerLink: { fontSize: 13, color: colors.accent, fontWeight: "700" },
});
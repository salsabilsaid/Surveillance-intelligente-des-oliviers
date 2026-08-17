import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Polyline, Circle, Line, Defs, LinearGradient, Stop, Polygon } from "react-native-svg";
import { colors, radius, spacing } from "../../theme";

const CHART_HEIGHT = 140;
const CHART_WIDTH = 300;
const PADDING = 10;

export default function TrendChart({ title, data, unit = "%", color = colors.accent }) {
  const values = data.map((d) => d.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = PADDING + (i / (data.length - 1)) * (CHART_WIDTH - PADDING * 2);
    const y = PADDING + (1 - (d.value - min) / range) * (CHART_HEIGHT - PADDING * 2);
    return { x, y, value: d.value, label: d.label };
  });

  const linePoints = points.map((p) => `${p.x},${p.y}`).join(" ");
  const fillPoints = `${PADDING},${CHART_HEIGHT - PADDING} ${linePoints} ${CHART_WIDTH - PADDING},${CHART_HEIGHT - PADDING}`;

  const last = data[data.length - 1];
  const first = data[0];
  const trend = last.value - first.value;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.trendBadge}>
          <Text style={[styles.trendText, { color: trend >= 0 ? colors.success : colors.alert }]}>
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend).toFixed(1)}{unit}
          </Text>
        </View>
      </View>

      <Text style={styles.currentValue}>
        {last.value}
        <Text style={styles.currentUnit}> {unit}</Text>
      </Text>

      <Svg width="100%" height={CHART_HEIGHT} viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}>
        <Defs>
          <LinearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.35" />
            <Stop offset="1" stopColor={color} stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* Lignes de grille horizontales */}
        {[0.25, 0.5, 0.75].map((r) => (
          <Line
            key={r}
            x1={PADDING}
            y1={PADDING + r * (CHART_HEIGHT - PADDING * 2)}
            x2={CHART_WIDTH - PADDING}
            y2={PADDING + r * (CHART_HEIGHT - PADDING * 2)}
            stroke={colors.border}
            strokeWidth="1"
          />
        ))}

        <Polygon points={fillPoints} fill="url(#fillGradient)" />
        <Polyline points={linePoints} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

        {points.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r={i === points.length - 1 ? 4 : 2.5} fill={i === points.length - 1 ? color : colors.surface} stroke={color} strokeWidth="2" />
        ))}
      </Svg>

      <View style={styles.labelsRow}>
        {data.map((d, i) => (
          <Text key={i} style={styles.labelText}>{d.label}</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 11, fontWeight: "700", letterSpacing: 1, color: colors.sage },
  trendBadge: {},
  trendText: { fontSize: 12, fontWeight: "700" },
  currentValue: { fontSize: 30, fontWeight: "700", color: colors.text, marginTop: 4, marginBottom: 12 },
  currentUnit: { fontSize: 15, fontWeight: "400", color: colors.textMuted },
  labelsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 6, paddingHorizontal: PADDING },
  labelText: { fontSize: 10, color: colors.sage },
});
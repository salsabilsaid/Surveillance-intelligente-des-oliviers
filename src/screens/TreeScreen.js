
import { FlatList, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import TreeCard from "../components/TreeCard";
import { colors, spacing } from "../../theme";
import { useTrees } from "../context/TreeContext";

export default function TreeScreen() {
  const navigation = useNavigation();

  const { trees } = useTrees();

  return (
    <FlatList
      style={styles.container}
      data={trees}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate("TreeDetails", { tree: item })}>
          <TreeCard tree={item} />
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <>
          <Text style={styles.title}>Oliviers</Text>
          <Text style={styles.subtitle}>{trees.length} oliviers suivis</Text>
        </>
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Aucun olivier enregistré</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listContent: { padding: spacing.lg },
  title: { fontSize: 26, fontWeight: "700", color: colors.text, marginTop: 20 },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: 5, marginBottom: 20 },
  empty: { alignItems: "center", marginTop: 60 },
  emptyText: { fontSize: 14, color: colors.sage },
});
import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useAppData } from "../../lib/app-data";
import { formatDate } from "../../types/app";

export default function DiaryScreen() {
  const { appData } = useAppData();
  const entries = appData.diaryEntries;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Diary</Text>
        <Link href="/diary/new" style={styles.newButton}>
          <Text style={styles.newButtonText}>New Update</Text>
        </Link>
      </View>
      {entries.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No diary updates yet. Start a daily entry to track progress.</Text>
        </View>
      ) : (
        entries.map((entry) => (
          <View key={entry.id} style={styles.entryCard}>
            <View style={styles.entryHeader}>
              <Text style={styles.entryDate}>{formatDate(entry.date)}</Text>
              <Text style={styles.entryPoints}>+{entry.points} pts</Text>
            </View>
            <Text style={styles.entryText} numberOfLines={3}>
              {entry.text}
            </Text>
            <Text style={styles.entryMeta}>
              Connected goals: {entry.goalIds.length}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
  },
  newButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  newButtonText: {
    color: "white",
    fontWeight: "700",
  },
  emptyState: {
    padding: 20,
    backgroundColor: "#f1f5f9",
    borderRadius: 16,
  },
  emptyText: {
    color: "#475569",
  },
  entryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  entryDate: {
    fontWeight: "700",
    color: "#0f172a",
  },
  entryPoints: {
    color: "#2563eb",
    fontWeight: "700",
  },
  entryText: {
    color: "#334155",
    lineHeight: 22,
    marginBottom: 12,
  },
  entryMeta: {
    color: "#64748b",
  },
});

import { Link, useSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useAppData } from "../../lib/app-data";
import { formatDate } from "../../types/app";

export default function GoalDetailScreen() {
  const { goalId } = useSearchParams();
  const { appData } = useAppData();
  const id = Array.isArray(goalId) ? goalId[0] : goalId;
  const goal = appData.goals.find((item) => item.id === id);
  const related = appData.diaryEntries.filter((entry) =>
    id ? entry.goalIds.includes(id) : false
  );
  const actions = related.length;
  const lastUpdate = related[0]?.date ?? null;

  if (!goal) {
    return (
      <View style={styles.missingContainer}>
        <Text style={styles.missingText}>Goal not found.</Text>
        <Link href="/goals" style={styles.backLink}>
          <Text style={styles.backLinkText}>Back to Goals</Text>
        </Link>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>{goal.title}</Text>
      <Text style={styles.description}>{goal.description ?? "No description provided."}</Text>
      {goal.targetDate ? (
        <Text style={styles.meta}>Target date: {formatDate(goal.targetDate)}</Text>
      ) : null}
      <View style={styles.statsCard}>
        <Text style={styles.statsLabel}>Action updates linked</Text>
        <Text style={styles.statsValue}>{actions}</Text>
        {lastUpdate ? (
          <Text style={styles.meta}>Last update: {formatDate(lastUpdate)}</Text>
        ) : (
          <Text style={styles.meta}>No updates linked yet.</Text>
        )}
      </View>
      <Link href="/goals" style={styles.backLink}>
        <Text style={styles.backLinkText}>Back to Goals</Text>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#475569",
    marginBottom: 16,
  },
  meta: {
    color: "#64748b",
    marginBottom: 16,
  },
  statsCard: {
    backgroundColor: "#eef2ff",
    padding: 20,
    borderRadius: 18,
    marginBottom: 24,
  },
  statsLabel: {
    fontSize: 16,
    color: "#334155",
    marginBottom: 10,
  },
  statsValue: {
    fontSize: 40,
    fontWeight: "800",
    color: "#3730a3",
    marginBottom: 8,
  },
  missingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  missingText: {
    fontSize: 18,
    marginBottom: 16,
  },
  backLink: {
    padding: 12,
    backgroundColor: "#2563eb",
    borderRadius: 14,
  },
  backLinkText: {
    color: "white",
    fontWeight: "700",
  },
});

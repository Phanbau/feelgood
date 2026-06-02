import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useAppData } from "../../lib/app-data";
import { formatDate } from "../../types/app";

export default function GoalsScreen() {
  const { appData } = useAppData();
  const goals = appData.goals;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Goals</Text>
        <Link href="/goals/new" style={styles.newButton}>
          <Text style={styles.newButtonText}>Add Goal</Text>
        </Link>
      </View>
      {goals.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No goals yet. Create one to start tracking progress.</Text>
        </View>
      ) : (
        goals.map((goal: any) => (
          <Link key={goal.id} href={`/goals/${goal.id}`} style={styles.goalCard}>
            <Text style={styles.goalTitle}>{goal.title}</Text>
            <Text style={styles.goalDescription} numberOfLines={2}>
              {goal.description ?? "No description"}
            </Text>
            {goal.targetDate ? (
              <Text style={styles.goalMeta}>Target: {formatDate(goal.targetDate)}</Text>
            ) : null}
          </Link>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    maxWidth: 600,
    alignSelf: "center",
    width: "100%",
    marginHorizontal: "auto",
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
    backgroundColor: "#f8fafc",
    borderRadius: 16,
  },
  emptyText: {
    color: "#475569",
  },
  goalCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  goalDescription: {
    color: "#475569",
    marginBottom: 12,
  },
  goalMeta: {
    fontSize: 14,
    color: "#64748b",
  },
});

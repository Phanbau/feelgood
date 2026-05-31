import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>FeelGood Diary</Text>
      <Text style={styles.subtitle}>
        Reflect on actions, connect them to your goals, and earn positive momentum.
      </Text>
      <View style={styles.grid}>
        <Link href="/profile" style={styles.card}>
          <Text style={styles.cardTitle}>Profile</Text>
          <Text style={styles.cardDescription}>See your points, profile, and progress summary.</Text>
        </Link>
        <Link href="/goals" style={styles.card}>
          <Text style={styles.cardTitle}>Goals</Text>
          <Text style={styles.cardDescription}>Manage goals and review action stats.</Text>
        </Link>
        <Link href="/diary" style={styles.card}>
          <Text style={styles.cardTitle}>Diary</Text>
          <Text style={styles.cardDescription}>Create daily updates linked to your goals.</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f8fafc",
  },
  heading: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 10,
  },
  subtitle: {
    color: "#475569",
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 24,
  },
  grid: {
    gap: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  cardDescription: {
    color: "#475569",
    fontSize: 15,
    lineHeight: 22,
  },
});

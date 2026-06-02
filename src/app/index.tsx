import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>FeelGood</Text>
      <View style={styles.buttonContainer}>
        <Link href="/goals" style={styles.button}>
          <Text style={styles.buttonText}>Goals</Text>
        </Link>
        <Link href="/diary" style={styles.button}>
          <Text style={styles.buttonText}>Diary</Text>
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
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 48,
    fontWeight: "800",
    marginBottom: 60,
    textAlign: "center",
    color: "#0f172a",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 24,
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 40,
    paddingVertical: 24,
    borderRadius: 20,
    minWidth: 140,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "800",
  },
});

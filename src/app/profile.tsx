import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useAppData } from "../lib/app-data";
import { formatDate, Profile as ProfileType } from "../types/app";

export default function ProfileScreen() {
  const { appData, isReady, saveProfile } = useAppData();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  useEffect(() => {
    if (!isReady) {
      return;
    }
    setName(appData.profile?.name ?? "");
    setBio(appData.profile?.bio ?? "");
    setCreatedAt(appData.profile?.createdAt ?? "");
  }, [isReady, appData.profile]);

  const points = appData.profile?.points ?? 0;
  const goalCount = appData.goals.length;
  const entryCount = appData.diaryEntries.length;

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert("Missing name", "Please enter your name before saving your profile.");
      return;
    }

    const profile: ProfileType = {
      name: name.trim(),
      bio: bio.trim() || undefined,
      points,
      createdAt: createdAt || new Date().toISOString(),
    };

    await saveProfile(profile);
    setCreatedAt(profile.createdAt);
    Alert.alert("Profile saved", "Your profile has been updated.");
  }

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile…</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Your Profile</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.label}>About you</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="A short bio or purpose statement"
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={4}
        />
        <Button title="Save Profile" onPress={handleSave} />
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Points</Text>
        <Text style={styles.summaryValue}>{points}</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Goals</Text>
          <Text style={styles.statValue}>{goalCount}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Diary entries</Text>
          <Text style={styles.statValue}>{entryCount}</Text>
        </View>
        {createdAt ? (
          <Text style={styles.metaText}>Profile created {formatDate(createdAt)}</Text>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#f8fafc",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  summaryCard: {
    backgroundColor: "#eff6ff",
    borderRadius: 16,
    padding: 20,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 48,
    fontWeight: "800",
    color: "#2563eb",
    marginBottom: 16,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statLabel: {
    color: "#334155",
  },
  statValue: {
    fontWeight: "700",
    color: "#0f172a",
  },
  metaText: {
    marginTop: 10,
    color: "#475569",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: "#64748b",
  },
});

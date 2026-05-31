import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAppData } from "../../lib/app-data";
import { getEncouragement } from "../../lib/encouragement";
import { calculateEntryPoints } from "../../lib/storage";
import { DiaryEntry } from "../../types/app";

export default function NewDiaryScreen() {
  const router = useRouter();
  const { appData, addDiaryEntry } = useAppData();
  const [text, setText] = useState("");
  const goals = appData.goals;
  const [selectedGoalIds, setSelectedGoalIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  function toggleGoal(goalId: string) {
    setSelectedGoalIds((current) =>
      current.includes(goalId)
        ? current.filter((id) => id !== goalId)
        : [...current, goalId]
    );
  }

  async function handleSave() {
    if (!text.trim()) {
      Alert.alert("Missing update", "Please write a short diary update before saving.");
      return;
    }

    setSaving(true);
    const points = calculateEntryPoints(selectedGoalIds.length);
    const encouragement = getEncouragement(selectedGoalIds.length);
    const now = new Date();

    const entry: DiaryEntry = {
      id: `${Date.now()}`,
      date: now.toISOString(),
      text: text.trim(),
      goalIds: selectedGoalIds,
      points,
      encouragement,
      createdAt: now.toISOString(),
    };

    await addDiaryEntry(entry);
    setSaving(false);
    Alert.alert("Update saved", encouragement);
    router.push("/diary");
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>New Diary Update</Text>
      <Text style={styles.label}>What did you do today?</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Write your reflection here"
        value={text}
        onChangeText={setText}
        multiline
        numberOfLines={6}
      />

      <Text style={styles.label}>Connect to goals</Text>
      {goals.length === 0 ? (
        <Text style={styles.noGoals}>No goals available yet. Add a goal first.</Text>
      ) : (
        goals.map((goal) => {
          const selected = selectedGoalIds.includes(goal.id);
          return (
            <TouchableOpacity
              key={goal.id}
              style={[styles.goalItem, selected && styles.goalItemSelected]}
              onPress={() => toggleGoal(goal.id)}
            >
              <Text style={[styles.goalTitle, selected && styles.goalTitleSelected]}>{goal.title}</Text>
            </TouchableOpacity>
          );
        })
      )}

      <View style={styles.footer}>
        <Text style={styles.pointsPreview}>Points on save: {calculateEntryPoints(selectedGoalIds.length)}</Text>
        <Button title={saving ? "Saving…" : "Save Update"} onPress={handleSave} disabled={saving} />
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
    fontWeight: "800",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#ffffff",
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
  },
  textArea: {
    minHeight: 140,
    textAlignVertical: "top",
  },
  noGoals: {
    color: "#475569",
    marginBottom: 18,
  },
  goalItem: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#ffffff",
  },
  goalItemSelected: {
    backgroundColor: "#e0f2fe",
    borderColor: "#38bdf8",
  },
  goalTitle: {
    color: "#0f172a",
    fontWeight: "600",
  },
  goalTitleSelected: {
    color: "#0369a1",
  },
  footer: {
    marginTop: 24,
  },
  pointsPreview: {
    marginBottom: 12,
    color: "#334155",
  },
});

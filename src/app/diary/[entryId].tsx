import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAppData } from "../../lib/app-data";
import { getEncouragement } from "../../lib/encouragement";
import { calculateEntryPoints } from "../../lib/storage";
import { DiaryEntry } from "../../types/app";

export default function EditDiaryScreen() {
  const router = useRouter();
  const { entryId } = useLocalSearchParams();
  const { appData, isReady, updateDiaryEntry } = useAppData();
  const id = Array.isArray(entryId) ? entryId[0] : entryId;
  const [text, setText] = useState("");
  const [selectedGoalIds, setSelectedGoalIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const goals = appData.goals;

  useEffect(() => {
    if (!isReady || !id) {
      return;
    }
    const entry = appData.diaryEntries.find((item) => item.id === id);
    if (entry) {
      setText(entry.text);
      setSelectedGoalIds(entry.goalIds);
    }
  }, [appData, id, isReady]);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading update…</Text>
      </View>
    );
  }

  const entry = id ? appData.diaryEntries.find((item) => item.id === id) : null;
  if (!entry) {
    return (
      <View style={styles.missingContainer}>
        <Text style={styles.missingText}>Diary update not found.</Text>
        <Link href="/diary" style={styles.backLink}>
          <Text style={styles.backLinkText}>Back to Diary</Text>
        </Link>
      </View>
    );
  }

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

    const updatedEntry: DiaryEntry = {
      ...entry,
      text: text.trim(),
      goalIds: selectedGoalIds,
      points,
    };

    await updateDiaryEntry(updatedEntry);
    setSaving(false);
    Alert.alert("Update saved", encouragement);
    router.push("/diary");
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Edit Diary Update</Text>
      <Text style={styles.label}>What did you do today?</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Update your reflection"
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
        <Text style={styles.pointsPreview}>Points if saved: {calculateEntryPoints(selectedGoalIds.length)}</Text>
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

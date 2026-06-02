import { Link } from "expo-router";
import { useState } from "react";
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AffirmationToast } from "../../components/affirmation-toast";
import { useAppData } from "../../lib/app-data";
import { getEncouragement, getRandomAffirmation } from "../../lib/encouragement";
import { calculateEntryPoints } from "../../lib/storage";
import { formatDate, DiaryEntry } from "../../types/app";

export default function DiaryScreen() {
  const { appData, addDiaryEntry } = useAppData();
  const entries = appData.diaryEntries;
  const goals = appData.goals;
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [text, setText] = useState("");
  const [selectedGoalIds, setSelectedGoalIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [showAffirmation, setShowAffirmation] = useState(false);

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
    setShowAffirmation(true);
    setText("");
    setSelectedGoalIds([]);
    setIsExpanded(false);
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Diary</Text>
        
        {/* Expandable Entry Box */}
        <View style={styles.entryBoxWrapper}>
          <View style={styles.stripedPaper}>
            {[...Array(8)].map((_, i) => (
              <View key={i} style={styles.line} />
            ))}
          </View>
          <TouchableOpacity
            style={[styles.entryBox, isExpanded && styles.entryBoxExpanded]}
            onPress={() => !isExpanded && setIsExpanded(true)}
            activeOpacity={0.8}
          >
            {!isExpanded ? (
              <Text style={styles.entryBoxPlaceholder}>What did you do today?</Text>
            ) : (
              <View style={styles.expandedContent}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Write your reflection here"
                value={text}
                onChangeText={setText}
                multiline
                numberOfLines={5}
                autoFocus
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
                      <Text style={[styles.goalTitle, selected && styles.goalTitleSelected]}>
                        {goal.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              )}

              <View style={styles.footer}>
                <Text style={styles.pointsPreview}>
                  Points on save: {calculateEntryPoints(selectedGoalIds.length)}
                </Text>
                <View style={styles.buttonRow}>
                  <Button
                    title="Cancel"
                    onPress={() => {
                      setText("");
                      setSelectedGoalIds([]);
                      setIsExpanded(false);
                    }}
                    color="#94a3b8"
                  />
                  <Button
                    title={saving ? "Saving…" : "Save Update"}
                    onPress={handleSave}
                    disabled={saving}
                  />
                </View>
              </View>
            </View>
          )}
        </TouchableOpacity>
        </View>
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No diary updates yet. Start a daily entry to track progress.</Text>
          </View>
        ) : (
          entries.map((entry) => (
            <Link key={entry.id} href={`/diary/${entry.id}`} style={styles.entryCard}>
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
            </Link>
          ))
        )}
      </ScrollView>
      <AffirmationToast
        message={getRandomAffirmation()}
        visible={showAffirmation}
        onHide={() => setShowAffirmation(false)}
      />
    </View>
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
  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
  },
  entryBoxWrapper: {
    position: "relative",
    marginBottom: 20,
    width: "100%",
  },
  stripedPaper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
  },
  line: {
    height: 1.5,
    backgroundColor: "#d4d4d8",
    marginVertical: 8,
  },
  entryBox: {
    backgroundColor: "#fffbf5",
    borderWidth: 1,
    borderColor: "#f5deb3",
    borderRadius: 12,
    padding: 16,
    minHeight: 60,
    justifyContent: "center",
    position: "relative",
    zIndex: 1,
  },
  entryBoxExpanded: {
    backgroundColor: "#fffef9",
    borderColor: "#d4a574",
    minHeight: "auto",
  },
  entryBoxPlaceholder: {
    color: "#8b7355",
    fontSize: 18,
    fontStyle: "italic",
    fontFamily: "Marker Felt",
  },
  expandedContent: {
    gap: 16,
  },
  input: {
    backgroundColor: "transparent",
    borderColor: "#e0e7ff",
    borderWidth: 0,
    borderRadius: 0,
    padding: 0,
    fontSize: 16,
    color: "#3d2817",
    fontFamily: "Marker Felt",
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
    paddingVertical: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },
  noGoals: {
    color: "#475569",
    fontSize: 14,
  },
  goalItem: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#ffffff",
  },
  goalItemSelected: {
    backgroundColor: "#e0f2fe",
    borderColor: "#38bdf8",
  },
  goalTitle: {
    color: "#0f172a",
    fontWeight: "600",
    fontSize: 14,
  },
  goalTitleSelected: {
    color: "#0369a1",
  },
  footer: {
    gap: 12,
  },
  pointsPreview: {
    fontSize: 13,
    color: "#334155",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
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
    width: "100%",
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

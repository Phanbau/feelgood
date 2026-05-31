import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { useAppData } from "../../lib/app-data";
import { Goal } from "../../types/app";

export default function NewGoalScreen() {
  const router = useRouter();
  const { addGoal } = useAppData();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");

  async function handleSave() {
    if (!title.trim()) {
      Alert.alert("Missing title", "Please enter a title for this goal.");
      return;
    }

    const goal: Goal = {
      id: `${Date.now()}`,
      title: title.trim(),
      description: description.trim() || undefined,
      targetDate: targetDate.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    await addGoal(goal);
    router.push("/goals");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>New Goal</Text>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Exercise 3x per week"
          value={title}
          onChangeText={setTitle}
        />
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Why this goal matters to you"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
        <Text style={styles.label}>Target date</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={targetDate}
          onChangeText={setTargetDate}
        />
        <Button title="Save Goal" onPress={handleSave} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 14,
    marginBottom: 18,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
});

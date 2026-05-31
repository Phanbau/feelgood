import { Stack } from "expo-router";
import { AppDataProvider } from "../lib/app-data";

export default function RootLayout() {
  return (
    <AppDataProvider>
      <Stack screenOptions={{ headerTitleAlign: "center" }} />
    </AppDataProvider>
  );
}

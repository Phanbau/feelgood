import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

interface AffirmationToastProps {
  message: string;
  visible: boolean;
  onHide?: () => void;
}

export function AffirmationToast({ message, visible, onHide }: AffirmationToastProps) {
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Fade in
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Fade out after 2 seconds
      const timer = setTimeout(() => {
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          onHide?.();
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [visible, opacityAnim, onHide]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity: opacityAnim }]}>
      <View style={styles.toast}>
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  toast: {
    backgroundColor: "#f5f3ff",
    borderRadius: 24,
    paddingHorizontal: 48,
    paddingVertical: 40,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  message: {
    fontSize: 32,
    fontWeight: "800",
    color: "#6b7280",
    textAlign: "center",
    letterSpacing: 0.5,
  },
});

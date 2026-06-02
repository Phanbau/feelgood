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
    pointerEvents: "none",
  },
  toast: {
    backgroundColor: "#ec4899",
    borderRadius: 20,
    paddingHorizontal: 32,
    paddingVertical: 20,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  message: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    letterSpacing: 0.3,
  },
});

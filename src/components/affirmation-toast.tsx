import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

interface AffirmationToastProps {
  message: string;
  visible: boolean;
  onHide?: () => void;
}

const CONFETTI_COUNT = 20;

interface Confetto {
  id: number;
  left: number;
  scaleAnim: Animated.Value;
  opacityAnim: Animated.Value;
}

function ConfettiPiece({ confetto }: { confetto: Confetto }) {
  return (
    <Animated.View
      style={[
        styles.confetto,
        {
          left: confetto.left,
          transform: [{ scale: confetto.scaleAnim }],
          opacity: confetto.opacityAnim,
        },
      ]}
    >
      <Text style={styles.confettoEmoji}>✨</Text>
    </Animated.View>
  );
}

export function AffirmationToast({ message, visible, onHide }: AffirmationToastProps) {
  const textOpacityAnim = useRef(new Animated.Value(0)).current;
  const confettiRef = useRef<Confetto[]>([]);

  useEffect(() => {
    if (visible) {
      // Create confetti particles
      confettiRef.current = Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
        id: i,
        left: Math.random() * 300 - 150,
        scaleAnim: new Animated.Value(0),
        opacityAnim: new Animated.Value(1),
      }));

      // Animate text fade in
      Animated.timing(textOpacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Animate confetti
      confettiRef.current.forEach((confetto, index) => {
        // Pop/scale animation
        Animated.timing(confetto.scaleAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();

        // Fade out after pop
        setTimeout(() => {
          Animated.timing(confetto.opacityAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }).start();
        }, 300);
      });

      // Text fade out after 2 seconds
      const timer = setTimeout(() => {
        Animated.timing(textOpacityAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          onHide?.();
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [visible, textOpacityAnim, onHide]);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.confettiContainer}>
        {confettiRef.current.map((confetto) => (
          <ConfettiPiece key={confetto.id} confetto={confetto} />
        ))}
      </View>
      <Animated.View style={[styles.textWrapper, { opacity: textOpacityAnim }]}>
        <Text style={styles.message}>{message}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 100,
    pointerEvents: "none",
  },
  confettiContainer: {
    position: "absolute",
    width: "100%",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  confetto: {
    position: "absolute",
    fontSize: 24,
  },
  confettoEmoji: {
    fontSize: 32,
  },
  textWrapper: {
    zIndex: 10,
  },
  message: {
    fontSize: 36,
    fontWeight: "800",
    color: "#4b5563",
    textAlign: "center",
    letterSpacing: 0.5,
    paddingHorizontal: 30,
  },
});

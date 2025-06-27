import React, { useEffect, useState } from "react";
import { Text, StyleSheet, StyleProp, TextStyle } from "react-native";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  style?: StyleProp<TextStyle>;
}

export function AnimatedCounter({
  value,
  duration = 1000,
  style,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      setCount(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <Text style={[styles.text, style]}>{count.toLocaleString()}</Text>;
}

const styles = StyleSheet.create({
  text: {
    // The 'tabular-nums' class in Tailwind CSS is equivalent to fontVariant: ['tabular-nums'] in React Native.
    fontVariant: ["tabular-nums"],
  },
}); 
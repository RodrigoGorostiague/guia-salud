import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/base';
import { radii, spacing, useAppTheme } from '@/theme';

export function AppStartupLoader() {
  const { colors } = useAppTheme();
  const [orbit] = useState(() => new Animated.Value(0));
  const [pulse] = useState(() => new Animated.Value(0));
  const [fade] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(orbit, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1,
            duration: 900,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 0,
            duration: 900,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ),
    ]).start();
  }, [fade, orbit, pulse]);

  const rotate = orbit.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spread = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 4],
  });

  const centerScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.16],
  });

  return (
    <Animated.View style={[styles.overlay, { backgroundColor: colors.background, opacity: fade }]}> 
      <View style={styles.content}>
        <Animated.View style={[styles.orbit, { transform: [{ rotate }] }]}> 
          <Animated.View
            style={[
              styles.dot,
              styles.dotLeft,
              { backgroundColor: colors.error, transform: [{ translateX: Animated.multiply(spread, -1) }] },
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              styles.dotCenter,
              { backgroundColor: colors.warning, transform: [{ scale: centerScale }] },
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              styles.dotRight,
              { backgroundColor: colors.success, transform: [{ translateX: spread }] },
            ]}
          />
        </Animated.View>

        <View style={styles.copy}>
          <AppText variant="subheading">Guia Salud</AppText>
          <AppText variant="caption" color="textSecondary">
            Preparando tu orientacion inicial
          </AppText>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: spacing.xl,
  },
  orbit: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: radii.pill,
  },
  dotLeft: {
    left: 24,
  },
  dotCenter: {
    left: 39,
  },
  dotRight: {
    right: 24,
  },
  copy: {
    alignItems: 'center',
    gap: spacing.xs,
  },
});

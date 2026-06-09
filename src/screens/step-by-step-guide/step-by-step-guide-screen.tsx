import { useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { AppButton, AppCard, AppContainer, AppHeader, AppText } from '@/components/base';
import { triggerActionHaptics } from '@/services/haptics';
import { radii, spacing, useAppTheme } from '@/theme';

const guideSteps = [
  {
    id: '1',
    step: 'Paso 1',
    title: 'Describe tu situacion',
    description: 'Empieza indicando el sintoma principal y el contexto general para orientar mejor la evaluacion.',
  },
  {
    id: '2',
    step: 'Paso 2',
    title: 'Responde preguntas guiadas',
    description: 'La experiencia futura te acompanara con preguntas breves para entender intensidad, duracion y señales de alerta.',
  },
  {
    id: '3',
    step: 'Paso 3',
    title: 'Recibe una clasificacion orientativa',
    description: 'El flujo evolucionara hacia un resultado inspirado en triage con indicaciones de urgencia y proximos pasos.',
  },
] as const;

export function StepByStepGuideScreen() {
  const { colors } = useAppTheme();
  const [scrollY] = useState(() => new Animated.Value(0));

  const handleBack = async () => {
    await triggerActionHaptics();
    router.back();
  };

  return (
    <AppContainer style={styles.screen}>
      <Animated.ScrollView
        contentContainerStyle={styles.content}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <AppButton label="Volver" variant="outline" size="compact" onPress={handleBack} />
        </View>

        <AppHeader
          title="Guia paso a paso"
          subtitle="Un recorrido visual pensado para acompanar al usuario durante su proceso de orientacion sanitaria."
          iconLabel="GP"
          iconTone="secondary"
        />

        <Animated.View
          style={[
            styles.heroCard,
            {
              opacity: scrollY.interpolate({ inputRange: [0, 140], outputRange: [1, 0.92], extrapolate: 'clamp' }),
              transform: [
                {
                  translateY: scrollY.interpolate({
                    inputRange: [0, 180],
                    outputRange: [0, -10],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          ]}>
          <AppCard elevated style={[styles.heroInnerCard, { shadowColor: colors.shadow }]}> 
            <View style={styles.progressHeader}>
              <AppText variant="label" color="primary">
                EXPERIENCIA FUTURA
              </AppText>
              <View style={styles.progressDotsRow}>
                {[colors.error, colors.warning, colors.success].map((color, index) => (
                  <View key={index} style={[styles.progressDot, { backgroundColor: color }]} />
                ))}
              </View>
            </View>

            <AppText variant="heading">Recorrido guiado y contextual</AppText>
            <AppText variant="body" color="textSecondary">
              Esta pantalla anticipa una experiencia interactiva que ayudara a comprender sintomas, seguir un orden claro y recibir orientacion sanitaria paso a paso.
            </AppText>

            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { backgroundColor: colors.primary }]} />
            </View>
          </AppCard>
        </Animated.View>

        <View style={styles.sectionHeader}>
          <AppText variant="subheading">Etapas orientativas</AppText>
          <AppText variant="caption" color="textSecondary">
            Placeholder visual preparado para storytelling, progresion y soporte contextual.
          </AppText>
        </View>

        {guideSteps.map((step, index) => {
          const inputRange = [index * 180, index * 180 + 220];

          return (
            <Animated.View
              key={step.id}
              style={{
                opacity: scrollY.interpolate({
                  inputRange,
                  outputRange: [0.5, 1],
                  extrapolate: 'clamp',
                }),
                transform: [
                  {
                    translateY: scrollY.interpolate({
                      inputRange,
                      outputRange: [26, 0],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              }}>
              <AppCard elevated style={[styles.stepCard, { shadowColor: colors.shadow }]}> 
                <View style={styles.stepTopRow}>
                  <View style={styles.stepBadge}>
                    <View
                      style={[
                        StyleSheet.absoluteFill,
                        styles.stepBadgeBackground,
                        { backgroundColor: colors.primarySoft, borderColor: colors.border },
                      ]}
                    />
                    <AppText variant="label" color="primary">
                      {step.step}
                    </AppText>
                  </View>
                  <View style={styles.stepIndicatorRail}>
                    <View style={[styles.stepIndicatorFill, { backgroundColor: index === 0 ? colors.primary : colors.secondary }]} />
                  </View>
                </View>

                <View style={styles.stepCopy}>
                  <AppText variant="subheading">{step.title}</AppText>
                  <AppText variant="body" color="textSecondary">
                    {step.description}
                  </AppText>
                </View>
              </AppCard>
            </Animated.View>
          );
        })}

        <AppCard tone="muted" elevated style={[styles.outroCard, { shadowColor: colors.shadow }]}> 
          <AppText variant="subheading">Preparado para crecer</AppText>
          <AppText variant="body" color="textSecondary">
            Esta base permitira incorporar preguntas clinicas, clasificacion por gravedad, centros cercanos, farmacias y recomendaciones contextuales sin rehacer la experiencia visual.
          </AppText>
        </AppCard>
      </Animated.ScrollView>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.xl,
  },
  topBar: {
    alignItems: 'flex-start',
  },
  heroCard: {
    gap: spacing.md,
  },
  heroInnerCard: {
    gap: spacing.lg,
    borderRadius: radii.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  progressDotsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: radii.pill,
  },
  progressTrack: {
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(127, 127, 127, 0.16)',
    overflow: 'hidden',
  },
  progressFill: {
    width: '52%',
    height: '100%',
    borderRadius: radii.pill,
  },
  sectionHeader: {
    gap: spacing.xs,
  },
  stepCard: {
    gap: spacing.md,
    borderRadius: radii.lg,
  },
  stepTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stepBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  stepBadgeBackground: {
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  stepIndicatorRail: {
    flex: 1,
    height: 4,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(127, 127, 127, 0.12)',
    overflow: 'hidden',
  },
  stepIndicatorFill: {
    width: '64%',
    height: '100%',
    borderRadius: radii.pill,
  },
  stepCopy: {
    gap: spacing.sm,
  },
  outroCard: {
    gap: spacing.md,
    borderRadius: radii.lg,
  },
});

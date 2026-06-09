import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppButton, AppCard, AppContainer, AppHeader, AppText } from '@/components/base';
import { symptomOptions } from '@/constants/symptoms';
import { triggerActionHaptics, triggerSelectionHaptics } from '@/services/haptics';
import { radii, shadows, spacing, useAppTheme } from '@/theme';

export function SymptomsAssessmentScreen() {
  const { colors } = useAppTheme();

  const handleBack = async () => {
    await triggerActionHaptics();
    router.back();
  };

  const handleSymptomPress = async () => {
    await triggerSelectionHaptics();
  };

  return (
    <AppContainer scrollable contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <AppButton label="Volver" variant="outline" onPress={handleBack} />
      </View>

      <AppHeader
        title="Evaluacion de sintomas"
        subtitle="Selecciona el sintoma que mejor represente tu situacion."
        iconLabel="EV"
        iconTone="secondary"
      />

      <AppCard elevated style={[styles.introCard, { shadowColor: colors.shadow }]}> 
        <AppText variant="subheading">Comienza tu evaluacion</AppText>
        <AppText variant="body" color="textSecondary">
          Esta estructura esta preparada para evolucionar hacia un triage guiado, clasificacion por gravedad y recomendaciones de atencion cercanas.
        </AppText>
      </AppCard>

      <View style={styles.sectionHeader}>
        <AppText variant="subheading">Sintomas frecuentes</AppText>
        <AppText variant="caption" color="textSecondary">
          Placeholder inicial para el flujo principal del producto.
        </AppText>
      </View>

      <View style={styles.symptomsList}>
        {symptomOptions.map((symptom, index) => (
          <Pressable
            key={symptom}
            accessibilityRole="button"
            accessibilityLabel={`Seleccionar ${symptom}`}
            onPress={handleSymptomPress}
            style={({ pressed }) => [pressed && styles.pressed]}>
            <AppCard style={[styles.symptomCard, { shadowColor: colors.shadow }]}> 
              <View style={styles.symptomRow}>
                <View style={styles.symptomIndex}>
                  <View
                    style={[
                      StyleSheet.absoluteFill,
                      styles.symptomIndexBackground,
                      { backgroundColor: colors.primarySoft, borderColor: colors.border },
                    ]}
                  />
                  <AppText variant="caption" color="primary">
                    {String(index + 1).padStart(2, '0')}
                  </AppText>
                </View>

                <View style={styles.symptomCopy}>
                  <AppText variant="bodyStrong">{symptom}</AppText>
                  <AppText variant="caption" color="textSecondary">
                    Placeholder preparado para preguntas guiadas y criterios clinicos.
                  </AppText>
                </View>
              </View>
            </AppCard>
          </Pressable>
        ))}
      </View>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
  },
  topBar: {
    alignItems: 'flex-start',
  },
  introCard: {
    gap: spacing.md,
    borderRadius: radii.lg,
  },
  sectionHeader: {
    gap: spacing.xs,
  },
  symptomsList: {
    gap: spacing.md,
  },
  symptomCard: {
    ...shadows.sm,
  },
  symptomRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  symptomIndex: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  symptomIndexBackground: {
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  symptomCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  pressed: {
    opacity: 0.92,
  },
});

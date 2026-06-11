import { router } from 'expo-router';
import { useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, View } from 'react-native';
import * as Linking from 'expo-linking';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { AlertTriangle } from 'lucide-react-native';

import { AppButton, AppCard, AppContainer, AppHeader, AppIcon, AppText } from '@/components/base';
import { EstablishmentsPreview } from '@/components/establishments/establishments-preview';
import {
  answerCurrentQuestion,
  createInitialSession,
  getQuestionById,
  restartSession,
  selectGroup,
  triageGroups,
  type TriageGroup,
} from '@/features/triage';
import { triggerActionHaptics } from '@/services/haptics';
import { radii, shadows, spacing, useAppTheme } from '@/theme';
import type { EstablishmentCategory } from '@/types/establishments';

type FormValues = {
  answerId: string;
};

const groupIcons = {
  travel_digestive: 'DI',
  travel_fever: 'FI',
  travel_cold: 'GR',
  travel_head: 'CA',
  travel_skin: 'PI',
  travel_heat: 'SO',
  travel_eyes_ears: 'OO',
  travel_injury: 'LE',
  travel_mind_sleep: 'AN',
  travel_meds: 'ME',
  travel_unsure: 'NS',
  respiratory: 'RE',
  circulation: 'CC',
  digestive: 'DI',
  neurologic: 'CN',
  eyes: 'OJ',
  ears: 'OI',
  skin: 'PI',
  musculoskeletal: 'HA',
  pregnancy: 'EM',
  general: 'EG',
  other: 'OT',
} as const;

const emergencyPhoneNumber = '107';

const resourceCategoryByResult = {
  pharmacy: 'pharmacies',
  center: 'centers',
  hospital: 'hospitals',
  none: null,
} as const satisfies Record<string, EstablishmentCategory | null>;

const resultGuidance = {
  emergency: {
    label: 'ATENCION URGENTE',
    now: ['Buscar una guardia o emergencias', 'No manejar si me siento mal', 'Avisar a alguien cercano', 'Contactar seguro si no retrasa la atencion'],
    medication: ['No intentar resolverlo con medicacion de venta libre si aparecio una senal de alarma'],
    followUp: 'Ir ahora. Si estoy solo o empeoro, llamar a emergencias.',
  },
  urgent: {
    label: 'CONSULTA MEDICA',
    now: ['Hidratarme y descansar', 'Evitar alcohol, esfuerzos y comidas irritantes', 'Controlar fiebre, dolor o nuevos sintomas', 'Contactar seguro medico de viaje si tengo'],
    medication: ['Puedo consultar farmacia por opciones seguras de venta libre', 'No tomar antibioticos, corticoides, sedantes ni medicacion con receta sin evaluacion'],
    followUp: 'Consultar hoy o en las proximas 24-48 horas segun intensidad, antes si empeoro.',
  },
  non_urgent: {
    label: 'AUTOCUIDADO',
    now: ['Tomar agua segura o sales de rehidratacion si aplica', 'Descansar y comer liviano', 'Evitar alcohol, sol fuerte o comida irritante', 'Observar la evolucion sin seguir exigiendome'],
    medication: ['Puedo considerar medicacion de venta libre solo si aplica al sintoma', 'Antes de tomar algo, revisar alergias, embarazo, edad, enfermedades previas e interacciones', 'Confirmar nombre local y disponibilidad con una farmacia o profesional'],
    followUp: 'Reevaluar en 12-24 horas o antes si aparece un sintoma nuevo.',
  },
} as const;

export function SymptomsAssessmentScreen() {
  const { colors } = useAppTheme();
  const [session, setSession] = useState(createInitialSession);
  const form = useForm<FormValues>({
    defaultValues: {
      answerId: '',
    },
  });
  const { field: answerField } = useController({
    control: form.control,
    name: 'answerId',
  });

  const currentQuestion = getQuestionById(session.currentQuestionId);
  const selectedGroup = triageGroups.find((group) => group.id === session.selectedGroupId) ?? null;
  const currentSectionTitle = selectedGroup?.title ?? 'Evaluacion de sintomas';
  const resultMapCategory = session.result ? resourceCategoryByResult[session.result.recommendedResource] : null;

  const handleBack = async () => {
    await triggerActionHaptics();
    router.back();
  };

  const handleSelectGroup = async (group: TriageGroup) => {
    await triggerActionHaptics();
    setSession((currentSession) => selectGroup(currentSession, group.id));
    form.reset({ answerId: '' });
  };

  const handleContinue = form.handleSubmit(async ({ answerId }) => {
    await triggerActionHaptics();
    setSession((currentSession) => answerCurrentQuestion(currentSession, answerId));
    form.reset({ answerId: '' });
  });

  const handleRestart = async () => {
    await triggerActionHaptics();
    setSession(restartSession());
    form.reset({ answerId: '' });
  };

  const handleEmergencyCall = async () => {
    await triggerActionHaptics();
    await Linking.openURL(`tel:${emergencyPhoneNumber}`);
  };

  const progressLabel = currentQuestion ? `Paso ${session.answers.length + 1}` : 'Inicio';

  return (
    <AppContainer scrollable contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <AppButton label="Volver" variant="outline" onPress={handleBack} />
      </View>

      <AppHeader
        title="Que me esta pasando?"
        subtitle="Una pregunta por pantalla para entender si puedo cuidarme, consultar o buscar atencion urgente."
        iconLabel="EV"
        iconTone="secondary"
      />

      <AppCard elevated style={[styles.introCard, { shadowColor: colors.shadow }]}> 
        <View style={styles.introHeader}>
          <AlertTriangle color={colors.warning} size={22} strokeWidth={2.2} />
          <AppText variant="subheading">Comienzo mi evaluacion</AppText>
        </View>
        <AppText variant="body" color="textSecondary">
          Empiezo por lo que siento principalmente. Si aparece una senal importante dentro de ese cuadro, la app me va a indicar consultar o buscar urgencias.
        </AppText>
      </AppCard>

      {session.result ? (
        <Animated.View entering={FadeInDown.duration(220)} exiting={FadeOutUp.duration(180)} style={styles.stack}>
          <AppCard elevated style={[styles.resultCard, { shadowColor: colors.shadow }]}> 
            <View style={styles.resultHeader}>
              <View
                style={[
                  styles.resultBadge,
                  {
                    backgroundColor:
                      session.result.severity === 'emergency'
                        ? colors.error
                        : session.result.severity === 'urgent'
                          ? colors.warning
                          : colors.success,
                  },
                ]}
              >
                <AppText variant="label" color="textOnPrimary">
                  {resultGuidance[session.result.severity].label}
                </AppText>
              </View>
              <AppText variant="caption" color="textSecondary">
                {session.result.terminatedEarly ? 'Finalizacion anticipada por criterio claro' : 'Clasificacion por evidencia acumulada'}
              </AppText>
            </View>

            <View style={styles.stackSm}>
              <AppText variant="subheading">{session.result.title}</AppText>
              <AppText variant="body" color="textSecondary">
                {session.result.summary}
              </AppText>
              <AppText variant="bodyStrong">{session.result.action}</AppText>
              <AppText variant="caption" color="textSecondary">
                Motivo: {session.result.reason}
              </AppText>
            </View>

            <View style={styles.guidanceGrid}>
              <AppCard tone="muted" style={styles.guidanceCard}>
                <AppText variant="bodyStrong">Que hago ahora</AppText>
                {resultGuidance[session.result.severity].now.map((item) => (
                  <AppText key={item} variant="caption" color="textSecondary">
                    {item}
                  </AppText>
                ))}
              </AppCard>

              <AppCard tone="muted" style={styles.guidanceCard}>
                <AppText variant="bodyStrong">Medicacion posible</AppText>
                {resultGuidance[session.result.severity].medication.map((item) => (
                  <AppText key={item} variant="caption" color="textSecondary">
                    {item}
                  </AppText>
                ))}
              </AppCard>

              <AppCard tone="muted" style={styles.guidanceCard}>
                <AppText variant="bodyStrong">Seguimiento</AppText>
                <AppText variant="caption" color="textSecondary">
                  {resultGuidance[session.result.severity].followUp}
                </AppText>
              </AppCard>
            </View>

            {session.result.severity === 'emergency' ? (
              <AppCard tone="muted" style={styles.emergencyCallout}>
                <AppText variant="bodyStrong">Necesito moverme hacia una guardia y tambien puedo llamar a emergencias.</AppText>
                <AppText variant="caption" color="textSecondary">
                  Numero rapido configurado por ahora: {emergencyPhoneNumber}
                </AppText>
                <AppButton label={`Llamar al ${emergencyPhoneNumber}`} variant="primary" onPress={handleEmergencyCall} />
              </AppCard>
            ) : null}

            <View style={styles.watchoutWrap}>
              {session.result.watchouts.map((item) => (
                <View key={item} style={[styles.watchoutChip, { backgroundColor: colors.surfaceMuted }]}> 
                  <AppText variant="caption" color="textSecondary">
                    {item}
                  </AppText>
                </View>
              ))}
            </View>

            <View style={styles.resultActions}>
              <AppButton label="Empezar de nuevo" variant="primary" onPress={handleRestart} />
              <AppButton label="Cambiar grupo" variant="outline" onPress={handleRestart} />
            </View>
          </AppCard>

          <AppCard tone="muted" style={styles.guidanceCard}>
            <AppText variant="bodyStrong">Donde consultar</AppText>
            <AppText variant="caption" color="textSecondary">
              {session.result.recommendedResource === 'hospital'
                ? 'Guardia, urgencias o servicio de emergencias.'
                : session.result.recommendedResource === 'center'
                  ? 'Consulta medica, teleconsulta, centro asistencial o cobertura de salud.'
                  : session.result.recommendedResource === 'pharmacy'
                    ? 'Farmacia o profesional de salud si necesito ayuda con opciones de venta libre.'
                    : 'Profesional de salud si tengo dudas o el cuadro cambia.'}
            </AppText>
          </AppCard>

          {resultMapCategory ? (
            <EstablishmentsPreview
              category={resultMapCategory}
              compact
              title={
                session.result.recommendedResource === 'hospital'
                  ? 'Guardias sugeridas cerca mio'
                  : session.result.recommendedResource === 'center'
                    ? 'Centros sugeridos cerca mio'
                    : 'Farmacias sugeridas cerca mio'
              }
              subtitle={
                session.result.recommendedResource === 'hospital'
                  ? 'Para una urgencia, uso el mapa como referencia visual mientras busco atencion inmediata.'
                  : session.result.recommendedResource === 'center'
                    ? 'Para consultar, el mapa muestra opciones demo alrededor de mi ubicacion real.'
                    : 'Si la recomendacion incluye autocuidado o ayuda farmacologica, veo farmacias demo alrededor de mi ubicacion real.'
              }
            />
          ) : null}
        </Animated.View>
      ) : selectedGroup && currentQuestion ? (
        <Animated.View entering={FadeInDown.duration(220)} exiting={FadeOutUp.duration(180)} style={styles.stack}>
          <View style={styles.sectionHeader}>
            <AppText variant="caption" color="primary">
              {progressLabel}
            </AppText>
            <AppText variant="subheading">{selectedGroup.title}</AppText>
            <AppText variant="body" color="textSecondary">
              {currentQuestion.helperText}
            </AppText>
          </View>

          <AppCard elevated style={[styles.questionCard, { shadowColor: colors.shadow }]}> 
            <View style={styles.stackSm}>
              <AppText variant="heading">{currentQuestion.title}</AppText>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(100, (session.answers.length + 1) * 25)}%`,
                      backgroundColor: colors.primary,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.optionsList}>
              {currentQuestion.options.map((option) => {
                const active = answerField.value === option.id;

                return (
                  <Pressable
                    key={option.id}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: active }}
                    onPress={() => answerField.onChange(option.id)}
                    style={({ pressed }) => [pressed && styles.pressed]}>
                    <AppCard
                      style={[
                        styles.optionCard,
                        { shadowColor: colors.shadow },
                        active && {
                          borderColor: colors.primary,
                          backgroundColor: colors.primarySoft,
                        },
                      ]}>
                      <View style={styles.optionRow}>
                        <View
                          style={[
                            styles.optionBullet,
                            { borderColor: active ? colors.primary : colors.border },
                            active && { backgroundColor: colors.primary },
                          ]}
                        />
                        <View style={styles.optionCopy}>
                          <AppText variant="bodyStrong">{option.label}</AppText>
                          {option.description ? (
                            <AppText variant="caption" color="textSecondary">
                              {option.description}
                            </AppText>
                          ) : null}
                        </View>
                      </View>
                    </AppCard>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.resultActions}>
              <AppButton
                label="Continuar"
                variant="primary"
                onPress={handleContinue}
                disabled={!answerField.value}
              />
              <AppButton label="Cambiar grupo" variant="outline" onPress={handleRestart} />
            </View>
          </AppCard>
        </Animated.View>
      ) : currentQuestion ? (
        <Animated.View entering={FadeInDown.duration(220)} exiting={FadeOutUp.duration(180)} style={styles.stack}>
          <View style={styles.sectionHeader}>
            <AppText variant="caption" color="primary">
              {progressLabel}
            </AppText>
            <AppText variant="subheading">{currentSectionTitle}</AppText>
            <AppText variant="body" color="textSecondary">
              {currentQuestion.helperText}
            </AppText>
          </View>

          <AppCard elevated style={[styles.questionCard, { shadowColor: colors.shadow }]}> 
            <View style={styles.stackSm}>
              <AppText variant="heading">{currentQuestion.title}</AppText>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(100, (session.answers.length + 1) * 14)}%`,
                      backgroundColor: colors.primary,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.optionsList}>
              {currentQuestion.options.map((option) => {
                const active = answerField.value === option.id;

                return (
                  <Pressable
                    key={option.id}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: active }}
                    onPress={() => answerField.onChange(option.id)}
                    style={({ pressed }) => [pressed && styles.pressed]}>
                    <AppCard
                      style={[
                        styles.optionCard,
                        { shadowColor: colors.shadow },
                        active && {
                          borderColor: colors.primary,
                          backgroundColor: colors.primarySoft,
                        },
                      ]}>
                      <View style={styles.optionRow}>
                        <View
                          style={[
                            styles.optionBullet,
                            { borderColor: active ? colors.primary : colors.border },
                            active && { backgroundColor: colors.primary },
                          ]}
                        />
                        <View style={styles.optionCopy}>
                          <AppText variant="bodyStrong">{option.label}</AppText>
                          {option.description ? (
                            <AppText variant="caption" color="textSecondary">
                              {option.description}
                            </AppText>
                          ) : null}
                        </View>
                      </View>
                    </AppCard>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.resultActions}>
              <AppButton
                label="Continuar"
                variant="primary"
                onPress={handleContinue}
                disabled={!answerField.value}
              />
            </View>
          </AppCard>
        </Animated.View>
      ) : (
        <Animated.View entering={FadeInDown.duration(220)} exiting={FadeOutUp.duration(180)} style={styles.stack}>
          <View style={styles.sectionHeader}>
            <AppText variant="subheading">Que me molesta mas?</AppText>
            <AppText variant="body" color="textSecondary">
              Elijo el problema principal. Despues respondo pocas preguntas para decidir el siguiente paso.
            </AppText>
          </View>

          <View style={styles.groupGrid}>
            {triageGroups.map((group) => {
              const iconLabel = groupIcons[group.id];

              return (
                <Pressable
                  key={group.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Elegir ${group.title}`}
                  onPress={() => handleSelectGroup(group)}
                  style={({ pressed }) => [pressed && styles.pressed]}>
                  <AppCard elevated style={[styles.groupCard, { shadowColor: colors.shadow }]}> 
                    <View style={[styles.groupIcon, { backgroundColor: colors.primarySoft }]}> 
                      <AppIcon label={iconLabel} tone="secondary" />
                    </View>
                    <View style={styles.groupCopy}>
                      <AppText variant="bodyStrong">{group.title}</AppText>
                      <AppText variant="caption" color="textSecondary">
                        {group.description}
                      </AppText>
                    </View>
                  </AppCard>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      )}
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
  },
  stack: {
    gap: spacing.lg,
  },
  stackSm: {
    gap: spacing.sm,
  },
  topBar: {
    alignItems: 'flex-start',
  },
  introCard: {
    gap: spacing.md,
    borderRadius: radii.lg,
  },
  introHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionHeader: {
    gap: spacing.sm,
  },
  groupGrid: {
    gap: spacing.md,
  },
  groupCard: {
    ...shadows.sm,
    flexDirection: 'row',
    gap: spacing.md,
    borderRadius: radii.lg,
  },
  groupIcon: {
    width: 52,
    height: 52,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  questionCard: {
    gap: spacing.lg,
    borderRadius: radii.lg,
  },
  progressTrack: {
    height: 8,
    borderRadius: radii.pill,
    overflow: 'hidden',
    backgroundColor: '#DCE4EF',
  },
  progressFill: {
    height: '100%',
    borderRadius: radii.pill,
  },
  optionsList: {
    gap: spacing.md,
  },
  optionCard: {
    borderRadius: radii.lg,
    ...shadows.sm,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  optionBullet: {
    width: 18,
    height: 18,
    marginTop: 3,
    borderRadius: radii.pill,
    borderWidth: 2,
  },
  optionCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  resultCard: {
    gap: spacing.lg,
    borderRadius: radii.lg,
  },
  resultHeader: {
    gap: spacing.sm,
  },
  resultBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
  },
  watchoutWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  watchoutChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
  },
  resultActions: {
    gap: spacing.sm,
  },
  emergencyCallout: {
    gap: spacing.sm,
    borderRadius: radii.lg,
  },
  guidanceGrid: {
    gap: spacing.sm,
  },
  guidanceCard: {
    gap: spacing.xs,
    borderRadius: radii.md,
  },
  pressed: {
    opacity: 0.92,
  },
});

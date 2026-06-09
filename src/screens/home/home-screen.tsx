import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { AppButton, AppCard, AppContainer, AppHeader, AppIcon, AppText } from '@/components/base';
import { triggerActionHaptics } from '@/services/haptics';
import { radii, shadows, spacing, useAppTheme } from '@/theme';

const triageSignals = [
  { label: 'Urgente', colorKey: 'error' as const },
  { label: 'Prioritaria', colorKey: 'warning' as const },
  { label: 'Baja urgencia', colorKey: 'success' as const },
] as const;

const featureCards = [
  {
    title: 'Centros de atencion',
    description: 'Consulta opciones de atencion medica y puntos de ayuda cercanos.',
    icon: 'CA',
    tone: 'secondary' as const,
    href: '/centers' as const,
  },
  {
    title: 'Farmacias cercanas',
    description: 'Visualiza recursos utiles para encontrar apoyo rapido y seguro.',
    icon: 'FC',
    tone: 'neutral' as const,
    href: '/pharmacies' as const,
  },
  {
    title: 'Emergencias',
    description: 'Accesos rapidos para situaciones urgentes y decisiones criticas.',
    icon: 'EM',
    tone: 'primary' as const,
    href: null,
  },
] as const;

export function HomeScreen() {
  const { colors } = useAppTheme();

  const handleFeaturePress = async (
    href: '/centers' | '/pharmacies' | '/symptoms-assessment' | '/history' | '/step-by-step-guide' | null,
  ) => {
    await triggerActionHaptics();

    if (href) {
      router.push(href);
    }
  };

  return (
    <AppContainer scrollable contentContainerStyle={styles.content}>
      <AppHeader title="Guia Salud" subtitle="Asistencia sanitaria confiable para usuarios y viajeros" />

      <View style={styles.heroSection}>
        <View style={styles.badge}>
          <View style={[StyleSheet.absoluteFill, styles.badgeBackground, { backgroundColor: colors.primarySoft }]} />
          <AppText variant="caption" color="primary">
            Salud, orientacion y apoyo
          </AppText>
        </View>
        <AppText variant="display">Tu guia de salud estes donde estes</AppText>
        <AppText variant="body" color="textSecondary">
          Orientacion sanitaria rapida y segura cuando mas la necesites.
        </AppText>

        <AppCard elevated style={[styles.primaryCtaCard, { shadowColor: colors.shadow }]}> 
          <View style={styles.triageSignalRow}>
            {triageSignals.map((signal) => (
              <View key={signal.label} style={styles.triageSignalItem}>
                <View
                  style={[
                    styles.triageSignalDot,
                    { backgroundColor: colors[signal.colorKey] },
                  ]}
                />
                <AppText variant="label" color="textSecondary">
                  {signal.label}
                </AppText>
              </View>
            ))}
          </View>

          <View style={styles.primaryCtaTopRow}>
            <View style={styles.primaryIconWrap}>
              <View
                style={[
                  StyleSheet.absoluteFill,
                  styles.primaryIconGlow,
                  { backgroundColor: colors.primarySoft },
                ]}
              />
              <AppIcon label="EV" size="lg" tone="secondary" />
            </View>
            <View style={styles.primaryCtaCopy}>
              <AppText variant="label" color="primary">
                FUNCION PRINCIPAL
              </AppText>
              <AppText variant="heading">Evaluacion de sintomas</AppText>
              <AppText variant="body" color="textSecondary">
                Inicia una evaluacion orientativa inspirada en triage medico y entiende rapidamente el nivel de urgencia de tu situacion.
              </AppText>
            </View>
          </View>

          <View style={styles.primaryCtaHighlights}>
            <AppButton
              label="Guia paso a paso"
              variant="outline"
              size="compact"
              onPress={() => handleFeaturePress('/step-by-step-guide')}
              style={styles.secondaryActionButton}
            />
            <AppButton
              label="Historial"
              variant="outline"
              size="compact"
              onPress={() => handleFeaturePress('/history')}
              style={styles.secondaryActionButton}
            />
          </View>

          <AppButton
            label="Evaluar mis sintomas"
            variant="primary"
            size="large"
            onPress={() => handleFeaturePress('/symptoms-assessment')}
            style={[styles.primaryCtaButton, { shadowColor: colors.shadow }]}
          />
        </AppCard>
      </View>

      <View style={styles.sectionHeader}>
        <AppText variant="subheading">Accesos complementarios</AppText>
        <AppText variant="body" color="textSecondary">
          Recursos de apoyo que complementaran la evaluacion principal con orientacion contextual.
        </AppText>
      </View>

      <View style={styles.featureGrid}>
        {featureCards.map((feature) => (
          <Pressable
            key={feature.title}
            accessibilityRole={feature.href ? 'button' : undefined}
            accessibilityLabel={feature.href ? `Abrir ${feature.title}` : feature.title}
            disabled={!feature.href}
            onPress={() => handleFeaturePress(feature.href)}
            style={({ pressed }) => [pressed && feature.href && styles.pressed]}>
            <AppCard
              tone="default"
              style={[
                styles.featureCard,
                { shadowColor: colors.shadow },
                feature.href && { borderColor: colors.primarySoft },
              ]}>
              <AppIcon label={feature.icon} tone={feature.tone} />
              <View style={styles.featureText}>
                <AppText variant="bodyStrong">{feature.title}</AppText>
                <AppText variant="caption" color="textSecondary">
                  {feature.description}
                </AppText>
                {feature.href ? (
                  <AppText variant="caption" color="primary">
                    Toca para ver el mapa placeholder y establecimientos cercanos
                  </AppText>
                ) : null}
              </View>
            </AppCard>
          </Pressable>
        ))}
      </View>

      <AppCard tone="muted" elevated style={[styles.disclaimerCard, { shadowColor: colors.shadow }]}> 
        <View style={styles.disclaimerHeader}>
          <AppIcon label="IN" tone="neutral" />
          <View style={styles.disclaimerCopy}>
            <AppText variant="subheading">Orientacion responsable</AppText>
            <AppText variant="body" color="textSecondary">
              Guia Salud te ayuda a ordenar sintomas y nivel de urgencia, pero no reemplaza la evaluacion, el diagnostico ni el tratamiento de profesionales de la salud.
            </AppText>
          </View>
        </View>
      </AppCard>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
  },
  heroSection: {
    gap: spacing.md,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  badgeBackground: {
    borderRadius: radii.pill,
  },
  primaryCtaCard: {
    gap: spacing.lg,
    borderRadius: radii.lg,
    paddingTop: spacing.xl,
  },
  triageSignalRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  triageSignalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  triageSignalDot: {
    width: 10,
    height: 10,
    borderRadius: radii.pill,
  },
  primaryCtaTopRow: {
    gap: spacing.md,
  },
  primaryIconWrap: {
    alignSelf: 'flex-start',
    borderRadius: 28,
    overflow: 'hidden',
  },
  primaryIconGlow: {
    borderRadius: 28,
    opacity: 0.75,
  },
  primaryCtaCopy: {
    gap: spacing.sm,
  },
  primaryCtaHighlights: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    alignItems: 'center',
  },
  primaryCtaButton: {
    minHeight: 64,
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  secondaryActionButton: {
    minHeight: 44,
  },
  sectionHeader: {
    gap: spacing.sm,
  },
  featureGrid: {
    gap: spacing.md,
  },
  featureCard: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
    ...shadows.sm,
  },
  featureText: {
    flex: 1,
    gap: spacing.xs,
  },
  disclaimerCard: {
    gap: spacing.md,
    borderRadius: radii.lg,
  },
  disclaimerHeader: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  disclaimerCopy: {
    flex: 1,
    gap: spacing.sm,
  },
  pressed: {
    opacity: 0.92,
  },
});

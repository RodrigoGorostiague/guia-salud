import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { AppButton, AppCard, AppContainer, AppHeader, AppIcon, AppText } from '@/components/base';
import { triggerActionHaptics } from '@/services/haptics';
import { radii, shadows, spacing, useAppTheme } from '@/theme';

const featureCards = [
  {
    title: 'Evaluacion de sintomas',
    description: 'Recibe orientacion inicial clara para entender mejor tu situacion.',
    icon: 'EV',
    tone: 'primary' as const,
    href: null,
  },
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

  const handleFeaturePress = async (href: '/centers' | '/pharmacies' | null) => {
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
        <AppText variant="heading">Tu guia de salud estes donde estes</AppText>
        <AppText variant="body" color="textSecondary">
          Orientacion sanitaria rapida y segura cuando mas la necesites.
        </AppText>
      </View>

      <AppCard elevated style={styles.featuredCard}>
        <View style={styles.featuredHeader}>
          <AppIcon label="+" size="lg" tone="secondary" />
          <View style={styles.featuredCopy}>
            <AppText variant="subheading">Ayuda clara en momentos clave</AppText>
            <AppText variant="body" color="textSecondary">
              Una experiencia pensada para orientarte, ayudarte a decidir y acercarte a los recursos de salud correctos.
            </AppText>
          </View>
        </View>

        <View style={styles.cardHighlights}>
          <View style={styles.highlightPill}>
            <View
              style={[StyleSheet.absoluteFill, styles.highlightPillBackground, { backgroundColor: colors.surfaceMuted }]}
            />
            <AppText variant="caption" color="primary">
              Respuesta guiada
            </AppText>
          </View>
          <View style={styles.highlightPill}>
            <View
              style={[StyleSheet.absoluteFill, styles.highlightPillBackground, { backgroundColor: colors.surfaceMuted }]}
            />
            <AppText variant="caption" color="primary">
              Recursos utiles
            </AppText>
          </View>
        </View>

        <AppButton label="Explorar opciones" variant="primary" />
      </AppCard>

      <View style={styles.sectionHeader}>
        <AppText variant="subheading">Funciones previstas</AppText>
        <AppText variant="body" color="textSecondary">
          Una base visual para futuras herramientas sanitarias, accesibles y faciles de entender.
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
  featuredCard: {
    gap: spacing.lg,
  },
  featuredHeader: {
    gap: spacing.md,
  },
  featuredCopy: {
    gap: spacing.sm,
  },
  cardHighlights: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  highlightPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  highlightPillBackground: {
    borderRadius: radii.pill,
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
  pressed: {
    opacity: 0.92,
  },
});

import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppButton, AppCard, AppContainer, AppHeader, AppText } from '@/components/base';
import { triggerActionHaptics } from '@/services/haptics';
import { radii, spacing, useAppTheme } from '@/theme';

const historyItems = [
  {
    id: '1',
    date: '12/06/2026',
    title: 'Dolor de pecho',
    severity: 'Rojo',
    colorKey: 'error' as const,
    summary: 'Resultado orientativo de alta urgencia con recomendacion de atencion inmediata.',
  },
  {
    id: '2',
    date: '09/06/2026',
    title: 'Fiebre persistente',
    severity: 'Amarillo',
    colorKey: 'warning' as const,
    summary: 'Resultado orientativo de atencion prioritaria con seguimiento cercano.',
  },
  {
    id: '3',
    date: '05/06/2026',
    title: 'Dolor de cabeza',
    severity: 'Verde',
    colorKey: 'success' as const,
    summary: 'Resultado orientativo de baja urgencia con autocuidado y observacion.',
  },
] as const;

export function HistoryScreen() {
  const { colors } = useAppTheme();

  const handleBack = async () => {
    await triggerActionHaptics();
    router.back();
  };

  return (
    <AppContainer scrollable contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <AppButton label="Volver" variant="outline" size="compact" onPress={handleBack} />
      </View>

      <AppHeader
        title="Historial"
        subtitle="Consulta ejemplos de evaluaciones previas y su clasificacion orientativa."
        iconLabel="HI"
        iconTone="neutral"
      />

      <AppCard elevated style={[styles.introCard, { shadowColor: colors.shadow }]}> 
        <AppText variant="subheading">Seguimiento de evaluaciones</AppText>
        <AppText variant="body" color="textSecondary">
          Esta vista queda preparada para mostrar resultados anteriores, patrones de sintomas y futuras recomendaciones personalizadas.
        </AppText>
      </AppCard>

      <View style={styles.list}>
        {historyItems.map((item) => (
          <AppCard key={item.id} elevated style={[styles.historyCard, { shadowColor: colors.shadow }]}> 
            <View style={styles.historyTopRow}>
              <View style={styles.dateBlock}>
                <AppText variant="label" color="textSecondary">
                  {item.date}
                </AppText>
                <AppText variant="bodyStrong">{item.title}</AppText>
              </View>

              <View style={styles.severityBadge}>
                <View
                  style={[
                    StyleSheet.absoluteFill,
                    styles.severityBackground,
                    { backgroundColor: colors[item.colorKey], opacity: 0.14 },
                  ]}
                />
                <View style={[styles.severityDot, { backgroundColor: colors[item.colorKey] }]} />
                <AppText variant="caption" color={item.colorKey}>
                  {item.severity}
                </AppText>
              </View>
            </View>

            <AppText variant="caption" color="textSecondary">
              {item.summary}
            </AppText>
          </AppCard>
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
  list: {
    gap: spacing.md,
  },
  historyCard: {
    gap: spacing.md,
    borderRadius: radii.lg,
  },
  historyTopRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  dateBlock: {
    flex: 1,
    gap: spacing.xs,
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  severityBackground: {
    borderRadius: radii.pill,
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: radii.pill,
  },
});

import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { AppButton, AppCard, AppContainer, AppIcon, AppText } from '@/components/base';
import { establishmentContent } from '@/constants/establishments';
import { triggerActionHaptics, triggerSelectionHaptics } from '@/services/haptics';
import { radii, shadows, spacing, useAppTheme } from '@/theme';
import type { EstablishmentCategory } from '@/types/establishments';

type EstablishmentsScreenProps = {
  category: EstablishmentCategory;
};

export function EstablishmentsScreen({ category }: EstablishmentsScreenProps) {
  const { colors } = useAppTheme();
  const content = establishmentContent[category];
  const [selectedId, setSelectedId] = useState(content.items[0]?.id ?? '');

  const selectedItem = useMemo(
    () => content.items.find((item) => item.id === selectedId) ?? content.items[0],
    [content.items, selectedId],
  );

  const handleSelect = async (id: string) => {
    setSelectedId(id);
    await triggerSelectionHaptics();
  };

  const handleBack = async () => {
    await triggerActionHaptics();
    router.back();
  };

  return (
    <AppContainer scrollable contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <AppButton label="Volver" variant="outline" onPress={handleBack} />
      </View>

      <View style={styles.header}>
        <AppText variant="subheading">{content.title}</AppText>
        <AppText variant="body" color="textSecondary">
          {content.subtitle}
        </AppText>
      </View>

      <AppCard elevated style={styles.mapCard}>
        <View style={styles.mapHeader}>
          <AppIcon label="MP" tone="secondary" />
          <View style={styles.mapHeaderText}>
            <AppText variant="bodyStrong">Mapa interactivo placeholder</AppText>
            <AppText variant="caption" color="textSecondary">
              {content.mapLabel}
            </AppText>
          </View>
        </View>

        <View
          accessibilityLabel={content.mapLabel}
          style={[styles.mapPlaceholder, { backgroundColor: colors.surfaceMuted, borderColor: colors.border }]}>
          <View style={[styles.mapGrid, { backgroundColor: colors.mapGrid }]} />
          <View style={[styles.mapRoute, { backgroundColor: colors.mapRoute }]} />

          {content.items.map((item) => {
            const isSelected = selectedItem?.id === item.id;

            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityLabel={`Seleccionar ${item.name}`}
                onPress={() => handleSelect(item.id)}
                style={[
                  styles.mapMarker,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderColor: colors.primary,
                    shadowColor: colors.shadow,
                  },
                  { left: item.x, top: item.y },
                ]}>
                <AppText variant="caption" color={isSelected ? 'textOnPrimary' : 'primary'}>
                  {item.markerLabel}
                </AppText>
              </Pressable>
            );
          })}

          {selectedItem ? (
            <View style={styles.mapInfoPill}>
              <View
                style={[
                  StyleSheet.absoluteFill,
                  styles.mapInfoBackground,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
              />
              <AppText variant="caption" color="textSecondary">
                {selectedItem.name} · {selectedItem.distance}
              </AppText>
            </View>
          ) : null}
        </View>

        <AppButton label={content.ctaLabel} variant="secondary" />
      </AppCard>

      <View style={styles.sectionHeader}>
        <AppText variant="subheading">Mas cercanos</AppText>
        <AppText variant="caption" color="textSecondary">
          Informacion resumida para decidir rapido sin exceso de contenido.
        </AppText>
      </View>

      <View style={styles.list}>
        {content.items.map((item) => {
          const isSelected = selectedItem?.id === item.id;

          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={`Ver detalles resumidos de ${item.name}`}
              onPress={() => handleSelect(item.id)}
              style={({ pressed }) => [pressed && styles.pressed]}>
              <AppCard
                style={[
                  styles.listCard,
                  { shadowColor: colors.shadow },
                  isSelected && { borderColor: colors.primary, backgroundColor: colors.primarySoft },
                ]}>
                <View style={styles.listTopRow}>
                  <View style={styles.listTitleBlock}>
                    <AppText variant="bodyStrong">{item.name}</AppText>
                    <AppText variant="caption" color="textSecondary">
                      {item.address}
                    </AppText>
                  </View>
                  <View style={styles.distancePill}>
                    <View
                      style={[
                        StyleSheet.absoluteFill,
                        styles.distancePillBackground,
                        { backgroundColor: colors.surface, borderColor: colors.border },
                      ]}
                    />
                    <AppText variant="caption" color="primary">
                      {item.distance}
                    </AppText>
                  </View>
                </View>

                <AppText variant="caption" color="textSecondary">
                  {item.summary}
                </AppText>

                <View style={styles.metaRow}>
                  <AppText variant="caption" color="textSecondary">
                    {item.status}
                  </AppText>
                  <AppText variant="caption" color="textSecondary">
                    ETA {item.eta}
                  </AppText>
                  <AppText variant="caption" color="textSecondary">
                    {item.rating.toFixed(1)} / 5
                  </AppText>
                </View>
              </AppCard>
            </Pressable>
          );
        })}
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
  header: {
    gap: spacing.sm,
  },
  mapCard: {
    gap: spacing.lg,
  },
  mapHeader: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  mapHeaderText: {
    flex: 1,
    gap: spacing.xs,
  },
  mapPlaceholder: {
    height: 280,
    borderRadius: radii.lg,
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative',
  },
  mapGrid: {
    ...StyleSheet.absoluteFill,
    opacity: 0.9,
  },
  mapRoute: {
    position: 'absolute',
    left: '12%',
    top: '52%',
    width: '70%',
    height: 10,
    borderRadius: radii.pill,
    transform: [{ rotate: '-18deg' }],
  },
  mapMarker: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    ...shadows.sm,
  },
  mapInfoPill: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  mapInfoBackground: {
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  sectionHeader: {
    gap: spacing.xs,
  },
  list: {
    gap: spacing.md,
  },
  listCard: {
    gap: spacing.md,
    ...shadows.sm,
  },
  listTopRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  listTitleBlock: {
    flex: 1,
    gap: spacing.xs,
  },
  distancePill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  distancePillBackground: {
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  pressed: {
    opacity: 0.9,
  },
});

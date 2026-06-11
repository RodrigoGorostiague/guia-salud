import * as Location from 'expo-location';
import * as Linking from 'expo-linking';
import { useMemo, useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, View, type LayoutChangeEvent } from 'react-native';

import { AppButton, AppCard, AppIcon, AppText } from '@/components/base';
import { establishmentContent } from '@/constants/establishments';
import { triggerSelectionHaptics } from '@/services/haptics';
import { radii, shadows, spacing, useAppTheme } from '@/theme';
import type { EstablishmentCategory, EstablishmentCoordinate } from '@/types/establishments';

type EstablishmentsPreviewProps = {
  category: EstablishmentCategory;
  title?: string;
  subtitle?: string;
  compact?: boolean;
  ctaLabel?: string;
  onCtaPress?: () => void;
};

const demoCenter: EstablishmentCoordinate = {
  latitude: -34.6037,
  longitude: -58.3816,
};

const tileSize = 256;
const tileZoom = 15;
const tileSubdomains = ['a', 'b', 'c', 'd'] as const;

function coordinateToPixel(coordinate: EstablishmentCoordinate) {
  const scale = 2 ** tileZoom * tileSize;
  const latitudeRadians = (coordinate.latitude * Math.PI) / 180;
  const sinLatitude = Math.sin(latitudeRadians);

  return {
    x: ((coordinate.longitude + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI)) * scale,
  };
}

function rebaseCoordinate(
  coordinate: EstablishmentCoordinate,
  userCoordinate: EstablishmentCoordinate | null,
): EstablishmentCoordinate {
  if (!userCoordinate) {
    return coordinate;
  }

  return {
    latitude: userCoordinate.latitude + (coordinate.latitude - demoCenter.latitude),
    longitude: userCoordinate.longitude + (coordinate.longitude - demoCenter.longitude),
  };
}

export function EstablishmentsPreview({
  category,
  title,
  subtitle,
  compact = false,
  ctaLabel,
  onCtaPress,
}: EstablishmentsPreviewProps) {
  const { colors } = useAppTheme();
  const content = establishmentContent[category];
  const [selectedId, setSelectedId] = useState(content.items[0]?.id ?? '');
  const [userCoordinate, setUserCoordinate] = useState<EstablishmentCoordinate | null>(null);
  const [locationStatus, setLocationStatus] = useState<'loading' | 'granted' | 'denied' | 'unavailable'>('loading');
  const [didRequestLocation, setDidRequestLocation] = useState(false);
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 });

  const displayedItems = useMemo(
    () =>
      content.items.map((item) => ({
        ...item,
        displayCoordinate: rebaseCoordinate(item.coordinate, userCoordinate),
      })),
    [content.items, userCoordinate],
  );

  const selectedItem = useMemo(
    () => displayedItems.find((item) => item.id === selectedId) ?? displayedItems[0],
    [displayedItems, selectedId],
  );

  const mapCenter = userCoordinate ?? demoCenter;
  const centerPixel = coordinateToPixel(mapCenter);
  const tiles = useMemo(() => {
    if (!mapSize.width || !mapSize.height) {
      return [];
    }

    const minTileX = Math.floor((centerPixel.x - mapSize.width / 2) / tileSize);
    const maxTileX = Math.floor((centerPixel.x + mapSize.width / 2) / tileSize);
    const minTileY = Math.floor((centerPixel.y - mapSize.height / 2) / tileSize);
    const maxTileY = Math.floor((centerPixel.y + mapSize.height / 2) / tileSize);
    const nextTiles: { key: string; url: string; left: number; top: number }[] = [];

    for (let x = minTileX; x <= maxTileX; x += 1) {
      for (let y = minTileY; y <= maxTileY; y += 1) {
        const subdomain = tileSubdomains[Math.abs(x + y) % tileSubdomains.length];

        nextTiles.push({
          key: `${x}-${y}`,
          url: `https://${subdomain}.basemaps.cartocdn.com/rastertiles/voyager/${tileZoom}/${x}/${y}.png`,
          left: x * tileSize - (centerPixel.x - mapSize.width / 2),
          top: y * tileSize - (centerPixel.y - mapSize.height / 2),
        });
      }
    }

    return nextTiles;
  }, [centerPixel.x, centerPixel.y, mapSize.height, mapSize.width]);
  const locationCaption =
    locationStatus === 'granted'
      ? 'Usando mi ubicacion real. Los puntos son datos demo para la version final.'
      : locationStatus === 'denied'
        ? 'Sin permiso de ubicacion: muestro puntos demo de referencia.'
        : locationStatus === 'unavailable'
          ? 'No pude obtener la ubicacion: muestro puntos demo de referencia.'
          : 'Buscando mi ubicacion para centrar el mapa.';

  const refreshLocation = async (showLoading = true) => {
    if (Platform.OS === 'web') {
      setLocationStatus('unavailable');
      return;
    }

    if (showLoading) {
      setLocationStatus('loading');
    }

    const permission = await Location.requestForegroundPermissionsAsync();

    if (permission.status !== 'granted') {
      setLocationStatus('denied');
      return;
    }

    const lastKnown = await Location.getLastKnownPositionAsync({ maxAge: 60_000 });
    const currentLocation = lastKnown ?? (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));
    const nextCoordinate = {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    };

    setUserCoordinate(nextCoordinate);
    setLocationStatus('granted');
  };

  const getPointOnMap = (coordinate: EstablishmentCoordinate) => {
    const point = coordinateToPixel(coordinate);

    return {
      left: point.x - centerPixel.x + mapSize.width / 2,
      top: point.y - centerPixel.y + mapSize.height / 2,
    };
  };

  const handleMapLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;

    setMapSize({ width, height });

    if (!didRequestLocation) {
      setDidRequestLocation(true);
      void refreshLocation(false);
    }
  };

  const handleSelect = async (id: string) => {
    const nextItem = displayedItems.find((item) => item.id === id);

    setSelectedId(id);
    await triggerSelectionHaptics();

    void nextItem;
  };

  const handleMapAction = async () => {
    await refreshLocation();
    onCtaPress?.();
  };

  const handleDirections = async (coordinate: EstablishmentCoordinate) => {
    await triggerSelectionHaptics();

    const destination = `${coordinate.latitude},${coordinate.longitude}`;
    const url =
      Platform.OS === 'ios'
        ? `http://maps.apple.com/?daddr=${destination}`
        : `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

    await Linking.openURL(url);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <AppText variant="subheading">{title ?? content.title}</AppText>
        <AppText variant="body" color="textSecondary">
          {subtitle ?? content.subtitle}
        </AppText>
      </View>

      <AppCard elevated style={[styles.mapCard, { shadowColor: colors.shadow }]}> 
        <View style={styles.mapHeader}>
          <AppIcon label="MP" tone="secondary" />
          <View style={styles.mapHeaderText}>
            <AppText variant="bodyStrong">Mapa con ubicacion real</AppText>
            <AppText variant="caption" color="textSecondary">
              {locationCaption}
            </AppText>
          </View>
        </View>

        <View
          accessibilityLabel={content.mapLabel}
          onLayout={handleMapLayout}
          style={[styles.mapShell, compact && styles.mapCompact, { backgroundColor: colors.surfaceMuted, borderColor: colors.border }]}
        >
          {tiles.map((tile) => (
            <Image
              key={tile.key}
              source={{ uri: tile.url }}
              style={[styles.mapTile, { left: tile.left, top: tile.top }]}
            />
          ))}

          {locationStatus === 'granted' ? (
            <View
              style={[
                styles.userMarker,
                {
                  left: getPointOnMap(mapCenter).left - 9,
                  top: getPointOnMap(mapCenter).top - 9,
                  backgroundColor: colors.primary,
                  borderColor: colors.surface,
                },
              ]}
            />
          ) : null}

          {displayedItems.map((item) => {
            const point = getPointOnMap(item.displayCoordinate);
            const isSelected = selectedItem?.id === item.id;

            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityLabel={`Seleccionar ${item.name}`}
                onPress={() => setSelectedId(item.id)}
                style={[
                  styles.mapMarker,
                  {
                    left: point.left - 17,
                    top: point.top - 34,
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderColor: colors.primary,
                    shadowColor: colors.shadow,
                  },
                ]}
              >
                <AppText variant="caption" color={isSelected ? 'textOnPrimary' : 'primary'}>
                  {item.markerLabel}
                </AppText>
              </Pressable>
            );
          })}

          <View style={styles.mapAttribution}>
            <View
              style={[
                StyleSheet.absoluteFill,
                styles.mapInfoBackground,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            />
            <AppText variant="caption" color="textSecondary">
              OpenStreetMap · CARTO
            </AppText>
          </View>

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

        <AppText variant="caption" color="textSecondary">
          Mapa de referencia para demo: la ubicacion del usuario es real; los establecimientos se reemplazaran por datos reales en la version final.
        </AppText>
        <AppButton label={ctaLabel ?? content.ctaLabel} variant="secondary" onPress={handleMapAction} />
      </AppCard>

      <View style={styles.sectionHeader}>
        <AppText variant="subheading">Sugerencias cercanas</AppText>
        <AppText variant="caption" color="textSecondary">
          Puntos demo ordenados para validar la experiencia visual del mapa.
        </AppText>
      </View>

      <View style={styles.list}>
        {displayedItems.map((item) => {
          const isSelected = selectedItem?.id === item.id;

          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={`Ver detalles de ${item.name}`}
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

                <AppButton label="Como llegar" variant="secondary" onPress={() => handleDirections(item.displayCoordinate)} />
              </AppCard>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.lg,
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
  mapShell: {
    height: 280,
    borderRadius: radii.lg,
    overflow: 'hidden',
    borderWidth: 1,
  },
  mapCompact: {
    height: 220,
  },
  mapTile: {
    position: 'absolute',
    width: tileSize,
    height: tileSize,
  },
  mapMarker: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    ...shadows.sm,
  },
  userMarker: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: radii.pill,
    borderWidth: 3,
  },
  mapAttribution: {
    position: 'absolute',
    right: spacing.sm,
    top: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.pill,
    overflow: 'hidden',
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

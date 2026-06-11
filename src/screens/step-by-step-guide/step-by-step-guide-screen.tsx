import { router } from 'expo-router';
import { useState } from 'react';
import { Animated, StyleSheet, View, useWindowDimensions, type ListRenderItemInfo } from 'react-native';

import { AppButton, AppCard, AppContainer, AppIcon, AppText } from '@/components/base';
import { triggerActionHaptics } from '@/services/haptics';
import { radii, shadows, spacing, useAppTheme } from '@/theme';

type GuidePage = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  chips: string[];
  icon: string;
  tone: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
};

const guidePages: readonly GuidePage[] = [
  {
    id: 'hero',
    eyebrow: 'FLOW STORY',
    title: 'De una duda puntual a una decision clara',
    body:
      'Esta guia ahora se recorre como un carrusel vertical. Cada pantalla ocupa el foco completo y me muestra una sola idea potente del flujo de triage.',
    chips: ['pantallas completas', 'movimiento fuerte', 'lectura mas entretenida'],
    icon: 'GS',
    tone: 'primary',
  },
  {
    id: 'entry',
    eyebrow: 'ENTRADA',
    title: 'Primero elijo la parte del cuerpo que me preocupa',
    body:
      'Empiezo con una decision simple y visual. Elijo respiracion, digestion, cabeza y sistema nervioso, piel u otro grupo para entrar por la ruta correcta desde el primer toque.',
    chips: ['tarjetas grandes', 'iconos claros', 'una sola decision'],
    icon: '01',
    tone: 'secondary',
  },
  {
    id: 'danger',
    eyebrow: 'ALARMA',
    title: 'Si aparece una senal de peligro real, el flujo se corta enseguida',
    body:
      'Antes de seguir, el sistema comprueba si no respondo, me cuesta mucho respirar, convulsiono o tengo dolor fuerte en el pecho. Si aparece algo asi, no pierde tiempo con preguntas extra.',
    chips: ['corte temprano', 'menos demora', 'mas seguridad'],
    icon: '!!',
    tone: 'error',
  },
  {
    id: 'adaptive',
    eyebrow: 'ADAPTATIVO',
    title: 'Despues solo respondo lo que importa para mi caso',
    body:
      'Cada sistema abre su propio arbol. Si elegi respiracion, me pregunta por falta de aire, si puedo hablar y si tengo tos o fiebre. Si elegi digestion, cambia por dolor, vomitos, diarrea o sangre.',
    chips: ['menos preguntas', 'mas contexto', 'lenguaje cotidiano'],
    icon: '02',
    tone: 'primary',
  },
  {
    id: 'scoring',
    eyebrow: 'MOTOR',
    title: 'La prioridad se construye con reglas y evidencia acumulada',
    body:
      'Los signos de peligro vital mandan primero. Si no aparecen, el sistema suma intensidad, sintomas asociados y progresion para decidir si termino en verde, amarillo o rojo.',
    chips: ['reglas duras', 'scoring dinamico', 'reclasificacion'],
    icon: '03',
    tone: 'warning',
  },
  {
    id: 'resolution',
    eyebrow: 'SALIDA',
    title: 'El final no solo clasifica: tambien me orienta a donde ir',
    body:
      'Si termino en verde y el caso se resuelve con apoyo farmacoterapeutico, veo farmacias. Si termino en amarillo, veo centros asistenciales. Si termino en rojo, aparecen hospitales con guardia y llamada directa a emergencias.',
    chips: ['mapa placeholder', 'listas cercanas', 'accion inmediata'],
    icon: '04',
    tone: 'success',
  },
  {
    id: 'outcomes',
    eyebrow: '3 FINALES',
    title: 'Verde, amarillo y rojo ya salen conectados con el siguiente paso',
    body:
      'Verde: autocuidado o farmacia. Amarillo: consulta prioritaria y centros cercanos. Rojo: hospitales con guardia y contacto de emergencia. El flujo termina con una accion concreta, no con una duda.',
    chips: ['verde', 'amarillo', 'rojo'],
    icon: 'OK',
    tone: 'secondary',
  },
];

function getToneColor(
  colors: ReturnType<typeof useAppTheme>['colors'],
  tone: GuidePage['tone'],
) {
  return colors[tone];
}

function getToneSurface(
  colors: ReturnType<typeof useAppTheme>['colors'],
  tone: GuidePage['tone'],
) {
  if (tone === 'secondary') {
    return colors.secondarySoft;
  }

  if (tone === 'success') {
    return colors.surfaceMuted;
  }

  return colors.primarySoft;
}

type GuideSlideProps = {
  item: GuidePage;
  index: number;
  pageHeight: number;
  scrollY: Animated.Value;
};

function GuideSlide({ item, index, pageHeight, scrollY }: GuideSlideProps) {
  const { colors } = useAppTheme();
  const inputRange = [(index - 1) * pageHeight, index * pageHeight, (index + 1) * pageHeight];
  const accentColor = getToneColor(colors, item.tone);
  const accentSurface = getToneSurface(colors, item.tone);

  const translateY = scrollY.interpolate({
    inputRange,
    outputRange: [140, 0, -140],
    extrapolate: 'clamp',
  });

  const scale = scrollY.interpolate({
    inputRange,
    outputRange: [0.84, 1, 0.84],
    extrapolate: 'clamp',
  });

  const opacity = scrollY.interpolate({
    inputRange,
    outputRange: [0.18, 1, 0.18],
    extrapolate: 'clamp',
  });

  const rotate = scrollY.interpolate({
    inputRange,
    outputRange: ['-5deg', '0deg', '5deg'],
    extrapolate: 'clamp',
  });

  const glowScale = scrollY.interpolate({
    inputRange,
    outputRange: [0.8, 1.18, 0.8],
    extrapolate: 'clamp',
  });

  const glowOpacity = scrollY.interpolate({
    inputRange,
    outputRange: [0.02, 0.22, 0.02],
    extrapolate: 'clamp',
  });

  const chipsTranslateY = scrollY.interpolate({
    inputRange,
    outputRange: [40, 0, -20],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.slide, { height: pageHeight }]}> 
      <Animated.View
        pointerEvents="none"
        style={[
          styles.slideGlow,
          {
            backgroundColor: accentColor,
            opacity: glowOpacity,
            transform: [{ scale: glowScale }],
          },
        ]}
      />

      <Animated.View
        style={{
          opacity,
          transform: [{ translateY }, { scale }, { rotate }],
        }}>
        <AppCard elevated style={[styles.slideCard, { shadowColor: colors.shadow }]}> 
          <View style={styles.slideTopRow}>
            <View style={[styles.eyebrowPill, { backgroundColor: accentSurface, borderColor: colors.border }]}> 
              <AppText variant="label" color="primary">
                {item.eyebrow}
              </AppText>
            </View>
            <AppIcon label={item.icon} tone="secondary" size="sm" />
          </View>

          <View style={styles.slideCopy}>
            <AppText variant="heading">{item.title}</AppText>
            <AppText variant="body" color="textSecondary">
              {item.body}
            </AppText>
          </View>

          <Animated.View
            style={[
              styles.chipsRow,
              {
                transform: [{ translateY: chipsTranslateY }],
                opacity,
              },
            ]}>
            {item.chips.map((chip) => (
              <View key={chip} style={[styles.chip, { backgroundColor: colors.surfaceMuted, borderColor: colors.border }]}> 
                <AppText variant="caption" color="textSecondary">
                  {chip}
                </AppText>
              </View>
            ))}
          </Animated.View>

          <View style={styles.footerLine}>
            <View style={[styles.footerTrack, { backgroundColor: colors.border }]}> 
              <View style={[styles.footerFill, { backgroundColor: accentColor, width: `${18 + index * 11}%` }]} />
            </View>
            <AppText variant="caption" color="textSecondary">
              {String(index + 1).padStart(2, '0')} / {String(guidePages.length).padStart(2, '0')}
            </AppText>
          </View>
        </AppCard>
      </Animated.View>
    </View>
  );
}

export function StepByStepGuideScreen() {
  const { colors } = useAppTheme();
  const { height } = useWindowDimensions();
  const [scrollY] = useState(() => new Animated.Value(0));
  const [activeIndex, setActiveIndex] = useState(0);

  const pageHeight = height - 24;

  const handleBack = async () => {
    await triggerActionHaptics();
    router.back();
  };

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, pageHeight],
    outputRange: [0, -10],
    extrapolate: 'clamp',
  });

  const orbLeftStyle = {
    transform: [
      {
        translateY: scrollY.interpolate({
          inputRange: [0, pageHeight * guidePages.length],
          outputRange: [0, -260],
          extrapolate: 'clamp',
        }),
      },
      {
        translateX: scrollY.interpolate({
          inputRange: [0, pageHeight * guidePages.length],
          outputRange: [0, 60],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  const orbRightStyle = {
    transform: [
      {
        translateY: scrollY.interpolate({
          inputRange: [0, pageHeight * guidePages.length],
          outputRange: [0, -200],
          extrapolate: 'clamp',
        }),
      },
      {
        translateX: scrollY.interpolate({
          inputRange: [0, pageHeight * guidePages.length],
          outputRange: [0, -48],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  const renderItem = ({ item, index }: ListRenderItemInfo<GuidePage>) => (
    <GuideSlide item={item} index={index} pageHeight={pageHeight} scrollY={scrollY} />
  );

  return (
    <AppContainer style={styles.screen}>
      <View pointerEvents="none" style={styles.backgroundLayer}>
        <Animated.View style={[styles.orb, styles.orbLeft, { backgroundColor: colors.primarySoft }, orbLeftStyle]} />
        <Animated.View style={[styles.orb, styles.orbRight, { backgroundColor: colors.secondarySoft }, orbRightStyle]} />
      </View>

      <Animated.View style={[styles.overlayHeader, { transform: [{ translateY: headerTranslateY }] }]}> 
        <View style={styles.topBar}>
          <AppButton label="Volver" variant="outline" size="compact" onPress={handleBack} />
        </View>

        <View style={styles.overlayTitleRow}>
          <AppIcon label="GP" tone="secondary" size="sm" />
          <View style={styles.overlayCopy}>
            <AppText variant="subheading">Guia paso a paso</AppText>
            <AppText variant="caption" color="textSecondary">
              Deslizo por pantallas completas y veo una idea fuerte por vez.
            </AppText>
          </View>
        </View>
      </Animated.View>

      <Animated.FlatList
        data={guidePages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        pagingEnabled
        bounces={false}
        decelerationRate="fast"
        snapToInterval={pageHeight}
        snapToAlignment="start"
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        onMomentumScrollEnd={(event) => {
          const nextIndex = Math.round(event.nativeEvent.contentOffset.y / pageHeight);
          setActiveIndex(nextIndex);
        }}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.paginationWrap}>
        {guidePages.map((page, index) => {
          const active = index === activeIndex;

          return (
            <View
              key={page.id}
              style={[
                styles.paginationDot,
                {
                  backgroundColor: active ? colors.primary : colors.border,
                  width: active ? 28 : 8,
                },
              ]}
            />
          );
        })}
      </View>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 999,
    opacity: 0.95,
  },
  orbLeft: {
    top: 40,
    left: -110,
  },
  orbRight: {
    top: 340,
    right: -100,
  },
  overlayHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  topBar: {
    alignItems: 'flex-start',
  },
  overlayTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  overlayCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  listContent: {
    paddingTop: 124,
  },
  slide: {
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  slideGlow: {
    position: 'absolute',
    top: '19%',
    left: 28,
    right: 28,
    bottom: '19%',
    borderRadius: radii.lg,
  },
  slideCard: {
    gap: spacing.lg,
    borderRadius: radii.lg,
    minHeight: 420,
    justifyContent: 'space-between',
    ...shadows.md,
  },
  slideTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  eyebrowPill: {
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  slideCopy: {
    gap: spacing.md,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  footerLine: {
    gap: spacing.sm,
  },
  footerTrack: {
    height: 8,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  footerFill: {
    height: '100%',
    borderRadius: radii.pill,
  },
  paginationWrap: {
    position: 'absolute',
    right: spacing.lg,
    top: '42%',
    gap: spacing.sm,
    alignItems: 'flex-end',
  },
  paginationDot: {
    height: 8,
    borderRadius: radii.pill,
  },
});

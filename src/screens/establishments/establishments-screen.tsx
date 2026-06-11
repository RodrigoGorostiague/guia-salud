import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { AppButton, AppContainer } from '@/components/base';
import { EstablishmentsPreview } from '@/components/establishments/establishments-preview';
import { triggerActionHaptics } from '@/services/haptics';
import { spacing } from '@/theme';
import type { EstablishmentCategory } from '@/types/establishments';

type EstablishmentsScreenProps = {
  category: EstablishmentCategory;
};

export function EstablishmentsScreen({ category }: EstablishmentsScreenProps) {
  const handleBack = async () => {
    await triggerActionHaptics();
    router.back();
  };

  return (
    <AppContainer scrollable contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <AppButton label="Volver" variant="outline" onPress={handleBack} />
      </View>

      <EstablishmentsPreview category={category} />
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
});

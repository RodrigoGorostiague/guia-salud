import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export async function triggerSelectionHaptics() {
  try {
    if (Platform.OS === 'android') {
      await Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Segment_Tick);
      return;
    }

    await Haptics.selectionAsync();
  } catch {
    // Haptics are progressive enhancement. Ignore unsupported environments.
  }
}

export async function triggerActionHaptics() {
  try {
    if (Platform.OS === 'android') {
      await Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm);
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // Haptics are progressive enhancement. Ignore unsupported environments.
  }
}

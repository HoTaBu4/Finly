import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { TABLET_BREAKPOINT } from '../constants/layout';

type StickyAddBarProps = {
  onAddPress?: () => void;
  onMicPress?: () => void;
};

export function StickyAddBar({
  onAddPress,
  onMicPress,
}: StickyAddBarProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isTablet = width >= TABLET_BREAKPOINT;
  const buttonSize = isTablet ? 60 : 48;
  const iconSize = isTablet ? 26 : 20;

  return (
    <View
      style={[
        styles.container,
        { bottom: Math.max(insets.bottom - 16, 4), right: isTablet ? 32 : 16 },
      ]}
    >
      <View style={styles.panelWrapper}>
        <View style={styles.panel}>
          <Pressable
            style={[styles.button, { width: buttonSize, height: buttonSize, borderRadius: buttonSize / 2 }]}
            onPress={onAddPress}
          >
            <Ionicons name="add" size={iconSize} color={colors.cardBackground} />
          </Pressable>
          {/* TODO: Restore mic button after voice input is ready
          <Pressable style={styles.micButton} onPress={onMicPress}>
            <Ionicons name="mic" size={34} color={colors.textPrimary} />
          </Pressable>
          */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    alignItems: 'flex-end',
    pointerEvents: 'box-none',
  },
  panelWrapper: {
    position: 'relative',
    borderRadius: 30,
    overflow: 'visible',
  },
  panel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: 'transparent',
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentPrimary,
    shadowColor: colors.accentPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.42,
    shadowRadius: 18,
    elevation: 11,
  },
  micButton: {
    width: 67,
    height: 67,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentPrimarySoft,
    shadowColor: colors.accentPrimary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.32,
    shadowRadius: 20,
    elevation: 12,
  },
});

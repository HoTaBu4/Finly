import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { colors } from '../theme/colors';
import { TABLET_BREAKPOINT } from '../constants/layout';

const PHONE_MAX_WIDTH = 500;
const TABLET_MAX_WIDTH = 900;

type TabletContainerProps = {
  children: React.ReactNode;
};

/**
 * Wraps content with a responsive max width.
 * - On phones: no visual effect (screen is narrower than maxWidth).
 * - On tablets: limits content width and centers it for readability.
 *   Uses a wider maxWidth on tablets to take advantage of the bigger screen
 *   without stretching controls to absurd widths.
 */
export function TabletContainer({ children }: TabletContainerProps) {
  const { width } = useWindowDimensions();
  const isTablet = Math.min(width) >= TABLET_BREAKPOINT;
  const maxWidth = isTablet ? TABLET_MAX_WIDTH : PHONE_MAX_WIDTH;

  return (
    <View style={styles.outer}>
      <View style={[styles.inner, { maxWidth }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: colors.appBackground,
    alignItems: 'center',
  },
  inner: {
    flex: 1,
    width: '100%',
  },
});

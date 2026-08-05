import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

const MAX_CONTENT_WIDTH = 500;

type TabletContainerProps = {
  children: React.ReactNode;
};

/**
 * Wraps content with a max width for tablet/iPad layouts.
 * On phones — no effect (screen is narrower than maxWidth).
 * On tablets — centers content and limits width for better readability.
 * Outer view fills the screen with appBackground color.
 */
export function TabletContainer({ children }: TabletContainerProps) {
  return (
    <View style={styles.outer}>
      <View style={styles.inner}>{children}</View>
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
    maxWidth: MAX_CONTENT_WIDTH,
  },
});

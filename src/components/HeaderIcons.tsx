import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

export function HeaderIcons() {
  return (
    <View style={styles.container}>
      <View style={styles.menuIcon}>
        <View style={styles.menuLine} />
        <View style={styles.menuLine} />
        <View style={styles.menuLine} />
      </View>
      <View style={styles.bellWrap}>
        <View style={styles.bellBody} />
        <View style={styles.bellClapper} />
        <View style={styles.dot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuIcon: {
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  menuLine: {
    height: 2,
    width: 24,
    borderRadius: 99,
    backgroundColor: colors.textPrimary,
  },
  bellWrap: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellBody: {
    width: 16,
    height: 14,
    borderWidth: 1.7,
    borderColor: colors.textPrimary,
    borderBottomWidth: 2,
    borderRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: 'transparent',
  },
  bellClapper: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 1,
    backgroundColor: colors.textPrimary,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    top: -1,
    right: -3,
    backgroundColor: colors.accentPrimary,
    borderWidth: 2,
    borderColor: colors.panelBackground,
  },
});

import { ScrollView, StyleSheet, View } from 'react-native';
import { TopBalanceSection } from '../components/TopBalanceSection';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export function HomeScreen() {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TopBalanceSection />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  content: {
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: spacing.lg,
  },
});

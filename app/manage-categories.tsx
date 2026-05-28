import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ManageCategoriesScreen } from '../src/screens/ManageCategoriesScreen';
import { colors } from '../src/theme/colors';

export default function ManageCategoriesPage() {
  return (
    <SafeAreaView style={styles.container}>
      <ManageCategoriesScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
});

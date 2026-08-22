import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ManageCategoriesScreen } from '../src/screens/ManageCategoriesScreen';
import { TabletContainer } from '../src/components/TabletContainer';
import { colors } from '../src/theme/colors';

export default function ManageCategoriesPage() {
  return (
    <SafeAreaView style={styles.container}>
      <TabletContainer>
        <ManageCategoriesScreen />
      </TabletContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
});

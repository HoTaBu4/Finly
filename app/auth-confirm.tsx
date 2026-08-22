import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthConfirmScreen } from '../src/screens/AuthConfirmScreen';
import { TabletContainer } from '../src/components/TabletContainer';
import { colors } from '../src/theme/colors';

export default function AuthConfirmPage() {
  return (
    <SafeAreaView style={styles.container}>
      <TabletContainer>
        <AuthConfirmScreen />
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

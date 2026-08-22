import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ResetPasswordScreen } from '../src/screens/ResetPasswordScreen';
import { TabletContainer } from '../src/components/TabletContainer';
import { colors } from '../src/theme/colors';

export default function ResetPasswordPage() {
  return (
    <SafeAreaView style={styles.container}>
      <TabletContainer>
        <ResetPasswordScreen />
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

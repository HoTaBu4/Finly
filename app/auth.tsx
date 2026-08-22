import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthScreen } from '../src/screens/AuthScreen';
import { TabletContainer } from '../src/components/TabletContainer';
import { colors } from '../src/theme/colors';

export default function AuthPage() {
  return (
    <SafeAreaView style={styles.container}>
      <TabletContainer>
        <AuthScreen />
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

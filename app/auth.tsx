import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthScreen } from '../src/screens/AuthScreen';
import { colors } from '../src/theme/colors';

export default function AuthPage() {
  return (
    <SafeAreaView style={styles.container}>
      <AuthScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
});

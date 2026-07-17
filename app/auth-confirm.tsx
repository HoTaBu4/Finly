import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthConfirmScreen } from '../src/screens/AuthConfirmScreen';
import { colors } from '../src/theme/colors';

export default function AuthConfirmPage() {
  return (
    <SafeAreaView style={styles.container}>
      <AuthConfirmScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
});

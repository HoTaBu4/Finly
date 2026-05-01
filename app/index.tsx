import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeScreen } from '../src/screens/HomeScreen';

export default function MainPage() {
  return (
    <SafeAreaView style={styles.container}>
      <HomeScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4fa',
  },
});

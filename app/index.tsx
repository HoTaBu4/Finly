import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeScreen } from '../src/screens/HomeScreen';
import { TabletContainer } from '../src/components/TabletContainer';
import { colors } from '../src/theme/colors';

export default function MainPage() {
  return (
    <SafeAreaView style={styles.container}>
      <TabletContainer>
        <HomeScreen />
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

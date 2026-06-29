import { useFonts } from 'expo-font';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [fontsLoaded] = useFonts({
    CormorantRegular: require('./src/assets/fonts/CormorantGaramond-Regular.ttf'),
    CormorantSemiBold: require('./src/assets/fonts/CormorantGaramond-SemiBold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return <AppNavigator />;
}
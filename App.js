import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { initializeDatabase, isCocktailTableEmpty } from './db/Database';
import { useEffect, useState, useContext } from 'react';
import Navigation from './Navigation';
import { colors } from './Colors';
import ErrorOverlay from './components/ErrorOverlay';
import { useLoad } from './context/LoadContext';
import { LoadProvider } from './context/LoadContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function AppContent() {
  const [dbInitialized, setDbInitialized] = useState(false);
  const [initError, setInitError] = useState(null);
  const { loadCocktails } = useLoad();

  if (!__DEV__) {
  console.log = () => {};
  console.debug = () => {};
  console.info = () => {};
}

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
      try {
        await initializeDatabase();
         setDbInitialized(true);
      } catch (error) {
        setInitError('Failed to initialize database');
      }

      loadCocktails();
  
      setDbInitialized(true);
  };

  

  if (initError) {
    return <ErrorOverlay message={initError} onRetry={() => {
      setInitError(null);
      initialize();
    }} />;
  } 

  return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Navigation style={styles.container} />
      </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.container,
  },
});

export default function App() {
  return (
    <LoadProvider>
      <AppContent />
    </LoadProvider>
  );
}

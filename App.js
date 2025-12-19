import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { getAllCocktails, getCocktailsByFirstLetter } from './api/CocktailApi';
import { initializeDatabase, isCocktailTableEmpty } from './db/Database';
import { useEffect, useState } from 'react';
import Navigation from './Navigation';
import LoadingOverlay from './components/LoadingOverlay';
import {colors} from './Colors';
import ErrorOverlay from './components/ErrorOverlay';

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeDB();
  }, []);

  const initializeDB = async () => {
      try {
        await initializeDatabase();

        if (isCocktailTableEmpty()) {
          await getAllCocktails();
        }

        setDbInitialized(true);
        

      } catch (error) {
        console.error('Database initialization failed:', error);
        setError('Failed to initialize database');
      }
    };

  console.log('DB Initialized:', dbInitialized);
  if (error) {
    return <ErrorOverlay message={error} onRetry={() => {
      setError(null);
      initializeDB();
    }} />;
  } else if (!dbInitialized) {
    return <LoadingOverlay text="Fetching recipes..." />;
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

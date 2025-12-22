import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { getAllCocktails, getAndStorePopularCocktails } from './api/CocktailApi';
import { initializeDatabase, isCocktailTableEmpty } from './db/Database';
import { useEffect, useState, useContext } from 'react';
import Navigation from './Navigation';
import LoadingOverlay from './components/LoadingOverlay';
import { colors } from './Colors';
import ErrorOverlay from './components/ErrorOverlay';

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [loadingText, setLoadingText] = useState("Fetching recipes, this may take up to a minute...");
  const [updateCount, setUpdateCount] = useState(0);


  useEffect(() => {
    initializeDB();
  }, []);

  const initializeDB = async () => {
    try {
      try {
        await initializeDatabase();
      } catch (error) {
        setError('Failed to initialize database');
      }

      if (isCocktailTableEmpty()) {
        await  getAllCocktails();
        setDbInitialized(true);
      }

      setDbInitialized(true);
    } catch (error) {
    }
  };

  useEffect(() => {
    if (updateCount < 3) {
      const timer = setTimeout(() => {
        setUpdateCount(prev => prev + 1);
        
        switch (updateCount + 1) {
          case 1:
            setLoadingText("Still working on it, almost there...");
            break;
          case 2:
            setLoadingText("Just a few more seconds...");
            break;
          case 3:
            setLoadingText("Finalizing your recipes...");
            break;
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [updateCount, dbInitialized]);


  if (error) {
    return <ErrorOverlay message={error} onRetry={() => {
      setError(null);
      initializeDB();
    }} />;
  } else if (!dbInitialized) {
    return <LoadingOverlay text={loadingText} />;
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

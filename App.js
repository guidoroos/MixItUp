import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { getAllCocktails } from './api/CocktailApi';
import { initializeDatabase, insertCocktail, isCocktailTableEmpty } from './db/Database';
import { useEffect, useState } from 'react';
import Navigation from './Navigation';

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    const initializeDB = async () => {
      try {
        await initializeDatabase();
        
        if (isCocktailTableEmpty()) {
          const cocktails = await getAllCocktails();
          cocktails.forEach(cocktail => {
            insertCocktail(cocktail);
          });
        }
        setDbInitialized(true);
      } catch (error) {
        console.error('Database initialization failed:', error);
      }
    };

    initializeDB();
  }, []);

  console.log('DB Initialized:', dbInitialized);
  if (!dbInitialized) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Navigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

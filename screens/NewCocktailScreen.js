import { View, StyleSheet } from 'react-native';
import CocktailForm from '../components/CocktailForm';
import { colors } from '../Colors';
import { upsertUserGenerated } from '../db/Database';
import Cocktail from '../model/Cocktail';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getCocktailDetails } from '../api/CocktailApi';


function NewCocktailScreen({ navigation, route }) {

  const [details, setDetails] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const fetchDetails = async () => {
        if (route.params?.cocktail) {
          let details = await getCocktailDetails(route.params.cocktail);
          console.log("Fetched details for new cocktail:", details);
          setDetails(details);
        }
      };

      fetchDetails();
    }, [route.params?.cocktail])
  );

  const handleSave = async (cocktail) => {
    try {
      cocktail.isUserGenerated = true;
      let id = await upsertUserGenerated(cocktail);

      let baseCocktail = new Cocktail(
        cocktail.name,
        cocktail.imageUrl,
        id,
        true,
        false
      );
      navigation.reset({
        index: 1,
        routes: [
          { name: 'Cocktails', params: { savedCocktail: baseCocktail } },
          { name: 'CocktailDetail', params: { cocktail: baseCocktail } }
        ],
      });
    } catch (error) {
      navigation.navigate('Cocktails');
    }
  };

  return (
    <View style={styles.container}>
      <CocktailForm cocktailToEdit={route.params?.cocktail} detailsToEdit={details} onSave={handleSave} />
    </View>
  );
}

export default NewCocktailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
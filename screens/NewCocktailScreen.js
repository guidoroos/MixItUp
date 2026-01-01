import { View, StyleSheet } from 'react-native';
import CocktailForm from '../components/CocktailForm';
import { colors } from '../Colors';
import { upsertUserGenerated } from '../db/Database';
import { FavoritesContext } from '../context/FavoritesContext';
import { useContext } from 'react';
import Cocktail from '../model/Cocktail';


function NewCocktailScreen({ navigation, route }) {


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

      navigation.navigate('CocktailDetail', { cocktail: baseCocktail });
    } catch (error) {
      navigation.navigate('Cocktails');
    }
  };

  return (
    <View style={styles.container}>
      <CocktailForm cocktailToEdit={route.params?.cocktail} onSave={handleSave} />
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
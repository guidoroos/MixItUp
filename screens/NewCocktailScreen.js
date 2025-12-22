import { View, StyleSheet } from 'react-native';
import CocktailForm from '../components/CocktailForm';
import { colors } from '../Colors';
import { upsertCocktail } from '../db/Database';
import { FavoritesContext } from '../context/FavoritesContext';
import { useContext } from 'react';


function NewCocktailScreen({ navigation, route }) {

  const favoriteContext = useContext(FavoritesContext);

  const handleSave = async (cocktail) => {
    try {
         await upsertCocktail(cocktail);
    } catch (error) {
      navigation.navigate('Cocktails');
      return;
    }

    navigation.replace('CocktailDetail', { cocktail: cocktail });
  };

  return (
    <View style={styles.container}>
      <CocktailForm cocktailToEdit={route.params?.cocktail} onSave={handleSave} 
      setFavorite={(id, isFavorite) => favoriteContext.setFavorite(id, isFavorite)} />
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
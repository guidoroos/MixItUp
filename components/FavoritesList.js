import { View, StyleSheet, FlatList, Text } from 'react-native';
import CocktailFavoritesItem from './CocktailFavoritesItem';
import { colors } from '../Colors';
import { useCallback } from 'react';

function FavoritesList({ cocktails, onPressCocktail, onRemoveFavorite }) {
  const renderItem = useCallback(({ item }) => (
  <CocktailFavoritesItem
    cocktail={item}
    onPress={onPressCocktail}
    removeFavorite={onRemoveFavorite}
  />
), [onPressCocktail, onRemoveFavorite]);

  return (
    <View style={styles.container}>
      <FlatList
        data={cocktails}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          renderItem({ item })
        )}
      />
    </View>
  );
}

export default FavoritesList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-around'
  }
});
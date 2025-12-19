import { View, StyleSheet, FlatList } from 'react-native';
import CocktailItem from './CocktailItem';
import { colors } from '../Colors';
import { useMemo } from 'react';

function CocktailList({ cocktails, onPressCocktail }) {

  const filteredCocktails = useMemo(() => {
    return cocktails.filter(cocktail => cocktail != null);
  }, [cocktails]);

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredCocktails}
        key="categories-grid"
        numColumns={2}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CocktailItem cocktail={item} onPress={onPressCocktail} />}
      />
    </View>
  );
}

export default CocktailList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  }

});
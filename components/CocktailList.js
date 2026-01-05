import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import CocktailItem from './CocktailItem';
import { colors } from '../Colors';
import { useMemo } from 'react';
import { getColumnCount } from '../DeviceUtil';
import { useEffect, useState } from 'react';

function CocktailList({ cocktails, onPressCocktail }) {
   const [numColumns, setNumColumns] = useState(getColumnCount());
   const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));

   useEffect(() => {
     const subscription = Dimensions.addEventListener('change', ({ window }) => {
       setScreenDimensions(window);
     });

     return () => {
       subscription?.remove();
     };
   }, []);

   useEffect(() => {
     const newNumColumns = getColumnCount();
     if (newNumColumns !== numColumns) {
       setNumColumns(newNumColumns);
     }
   }, [screenDimensions]);

  const filteredCocktails = useMemo(() => {
    return cocktails.filter(cocktail => cocktail != null);
  }, [cocktails]);


  return (
    <View style={styles.container}>
      <FlatList
        data={filteredCocktails}
        key={`${numColumns}-${screenDimensions.width}-${screenDimensions.height}`}
        numColumns={numColumns}
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
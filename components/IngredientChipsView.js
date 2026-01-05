import { View, StyleSheet } from 'react-native';
import IngredientChip from './IngredientChip';
import { IconTextButton } from './IconTextButton';

function IngredientChipsView({ ingredients, onAdd, onRemove }) {
  const displayedIngredients = ingredients.slice(0, 5);
  const canAddMore = ingredients.length < 5;

  return (
    <View style={styles.container}>
      <View style={styles.chipsContainer}>
        {displayedIngredients.map((ingredient, index) => (
          <IngredientChip
            key={index}
            label={ingredient}
            onRemove={() => onRemove(ingredient)}
          />
        ))}
      </View>
      {canAddMore && (
        <IconTextButton
          icon="add"
          text="Ingredient"
          onPress={onAdd}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
    marginHorizontal: 4,
  },
  chipsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginRight: 8,
  },
});

export default IngredientChipsView;
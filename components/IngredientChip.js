import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../Colors';

function IngredientChip({ label, onRemove }) {
function capitalizeWords(str) {
  return str.replace(/\b\w/g, l => l.toUpperCase());
}

  return (
     <TouchableOpacity onPress={onRemove}>
    <View style={styles.container}>
      <Text style={styles.label}>{capitalizeWords(label)}</Text>
     
        <Text style={styles.closeIcon}>×</Text>
     
    </View>
     </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 6,
    margin: 4,
    alignItems: 'center',
  },
  label: {
    marginRight: 8,
    fontSize: 16,
    color: colors.onPrimary,
  },
  closeIcon: {
    fontSize: 20,
    color: colors.onPrimary,
  },
});

export default IngredientChip;
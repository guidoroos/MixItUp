import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../Colors';
import { isTablet } from '../DeviceUtil';

function IngredientChip({ label, onRemove }) {
   const isTabletScreen = isTablet();

function capitalizeWords(str) {
  return str.replace(/\b\w/g, l => l.toUpperCase());
}

  return (
     <TouchableOpacity onPress={onRemove}>
    <View style={styles.container}>
      <Text style={{ ...styles.label, fontSize: isTabletScreen ? 22 : 16 }}>{capitalizeWords(label)}</Text>

        <Text style={{ ...styles.closeIcon, fontSize: isTabletScreen ? 24 : 18 }}>×</Text>

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
    color: colors.onPrimary,
  },
});

export default IngredientChip;
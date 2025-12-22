
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../Colors';

const CategoryBadge = ({ category, style }) => {
  if (!category) return null;
  
  return (
    <View style={[styles.categoryBadge, style]}>
      <Text style={styles.categoryText}>{category}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: '600',
  }
});

export default CategoryBadge;
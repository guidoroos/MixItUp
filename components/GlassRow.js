
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GlassRow = ({ glass, style }) => {
  return (
    <View style={[styles.glassRow, style]}>
      <Ionicons name="wine" size={20} color="black" />
      <Text style={styles.glassText}>{glass}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  glassRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  glassText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  }
});

export default GlassRow;
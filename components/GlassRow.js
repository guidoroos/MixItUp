
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../Colors';
import { isTablet } from '../DeviceUtil';

const GlassRow = ({ glass, style }) => {
  const isTabletScreen = isTablet();

  return (
    <View style={[styles.glassRow, style]}>
      <Ionicons name="wine" size={isTabletScreen ? 36 : 24} color={colors.onBackgroundSecondary} />
      <Text style={{ ...styles.glassText, fontSize: isTabletScreen ? 24 : 18 }}>{glass ?? ""}</Text>
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
    fontSize: 18,
    fontWeight: '500',
    color: colors.onBackgroundSecondary,
  }
});

export default GlassRow;
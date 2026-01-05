import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../Colors';
import { isTablet } from '../DeviceUtil';

export function IconTextButton({ icon, text, onPress }) {

    const isTabletScreen = isTablet();

  return (
    <TouchableOpacity style={styles.iconTextButton} onPress={onPress}>
      <Ionicons name={icon} size={isTabletScreen ? 28 : 24} color={colors.primaryTint} />
      <Text style={{ ...styles.iconTextButtonText, fontSize: isTabletScreen ? 22 : 16 }}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconTextButton: {
    flexDirection: 'row',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 8,
    margin: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconTextButtonText: {
    marginLeft: 6,
    color: colors.onBackground,
  },
});
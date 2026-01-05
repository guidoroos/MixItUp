import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../Colors';

export function IconTextButton({ icon, text, onPress }) {
  return (
    <TouchableOpacity style={styles.iconTextButton} onPress={onPress}>
      <Ionicons name={icon} size={20} color={colors.onBackground} />
      <Text style={styles.iconTextButtonText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconTextButton: {
    flexDirection: 'row',
    backgroundColor: colors.contentPrimary,
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
    fontSize: 16,
  },
});
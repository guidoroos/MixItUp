import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FilterSelector from './FilterSelector';
import { colors } from '../Colors';

const FilterModal = ({ 
  visible, 
  onClose, 
  onFilterSelect, 
  selectedFilter 
}) => {
  const insets = useSafeAreaInsets();
  
  const handleFilterSelect = (filter) => {
    onFilterSelect(filter);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Filter</Text>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Close filter"
          >
            <Ionicons name="close" size={28} color={colors.onToolbar} />
          </TouchableOpacity>
        </View>
        
        <FilterSelector 
          onSelectionChange={handleFilterSelect}
          selectedSpirit={selectedFilter}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.onToolbar,
  },
  closeButton: {
    padding: 4,
    borderRadius: 20,
  },
});

export default FilterModal;
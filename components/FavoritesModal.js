import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FavoritesList from './FavoritesList';
import { colors } from '../Colors';

const FavoritesModal = ({ 
  visible, 
  onClose, 
  cocktails, 
  onPressCocktail, 
  onRemoveFavorite 
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Favorites</Text>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Close favorites"
          >
            <Ionicons name="close" size={28} color={colors.onToolbar} />
          </TouchableOpacity>
        </View>
        
        <FavoritesList
          cocktails={cocktails}
          onPressCocktail={onPressCocktail}
          onRemoveFavorite={onRemoveFavorite}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primaryTint,
  },
  closeButton: {
    padding: 4,
    borderRadius: 20,
  },
});

export default FavoritesModal;
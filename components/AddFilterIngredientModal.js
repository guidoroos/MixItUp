import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';

const AddFilterIngredientModal = ({ 
  visible, 
  onClose, 
  ingredient,
  onSubmit
}) => {
  const insets = useSafeAreaInsets();
  const [ingredientText, setIngredientText] = useState(ingredient);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={
        () => {
          setIngredientText('');
          onClose();
        }
      }
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Ingredient</Text>
          <TouchableOpacity
            onPress={() => {
              setIngredientText('');
              onClose();
            }}
            style={styles.closeButton}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Close add ingredient"
          >
            <Ionicons name="close" size={28} color={colors.onToolbar} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          <TextInput
            style={styles.input}
            value={ingredientText}
            onChangeText={setIngredientText}
            placeholder="Enter ingredient name"
            placeholderTextColor={colors.onBackgroundSecondary}
            autoFocus
          />
          
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
                setIngredientText('');
                if (ingredientText.trim() !== '') {
                    onSubmit(ingredientText);
                }
            }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Add ingredient"
          >
            <Text style={styles.submitButtonText}>Add Ingredient</Text>
          </TouchableOpacity>
        </View>
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
  content: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.onBackground,
    backgroundColor: colors.surface,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: colors.primaryTint,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddFilterIngredientModal;
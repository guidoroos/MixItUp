import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../Colors';
import { useState } from 'react';

const AddFilterIngredientDialog = ({ 
  visible, 
  onClose, 
  ingredient,
  onSubmit
}) => {
  const [ingredientText, setIngredientText] = useState(ingredient);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity 
        style={styles.backdrop} 
        activeOpacity={1}
        onPress={() => {
          setIngredientText('');
          onClose();
        }}
      />
      
      <View style={styles.dialog}>
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
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setIngredientText('');
                onClose();
              }}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
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
              <Text style={styles.submitButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dialog: {
    backgroundColor: colors.background,
    borderRadius: 12,
    minWidth: 320,
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primaryTint,
  },
  closeButton: {
    padding: 4,
    borderRadius: 20,
  },
  content: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.onBackground,
    backgroundColor: colors.surface,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    color: colors.onBackground,
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: colors.primaryTint,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  submitButtonText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddFilterIngredientDialog;

import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Pressable, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../Colors';
import { useCallback } from 'react';

function CocktailForm({ cocktailToEdit, onSave}) {
    const [cocktail, setCocktail] = useState({
        id: cocktailToEdit?.id || null,
        name: cocktailToEdit?.name || '',
        category: cocktailToEdit?.category || '',
        instructions: cocktailToEdit?.instructions || '',
        imageUrl: cocktailToEdit?.imageUrl || '',
        glass: cocktailToEdit?.glass || '',
        ingredientList: cocktailToEdit?.ingredientList || [],
        isFavorite: cocktailToEdit?.isFavorite || false
    });

    const updateField = (field, value) => {
        setCocktail(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const updateIngredientMeasure = useCallback((index, value) => {
        const newIngredients = [...cocktail.ingredientList];
        newIngredients[index].measure = value;
        updateField('ingredientList', newIngredients);
    }, [cocktail.ingredientList]);

    const updateIngredientName = useCallback((index, value) => {
        const newIngredients = [...cocktail.ingredientList];
        newIngredients[index].name = value;
        updateField('ingredientList', newIngredients);
    }, [cocktail.ingredientList]);

    const removeIngredient = useCallback((index) => {
        const newIngredients = [...cocktail.ingredientList];
        newIngredients.splice(index, 1);
        updateField('ingredientList', newIngredients);
    }, [cocktail.ingredientList]);

    return (
        <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        enabled={Platform.OS === 'ios'} 
        accessible={false}
    >
            <ScrollView 
                style={styles.scrollView} 
                showsVerticalScrollIndicator={false}
                accessible={false}
            >
                <View style={styles.form}>
                    <Text 
                        style={styles.title}
                        accessible={true}
                        accessibilityRole="header"
                        accessibilityLevel={1}
                    >
                        {cocktailToEdit ? 'Edit Cocktail' : 'Add Cocktail'}
                    </Text>

                    <View style={styles.fieldContainer} accessible={false}>
                        <Text 
                            style={styles.label}
                            accessible={true}
                            accessibilityRole="text"
                        >
                            Name (Required)
                        </Text>
                        <TextInput
                            style={styles.input}
                            value={cocktail.name}
                            onChangeText={(value) => updateField('name', value)}
                            placeholder="Enter cocktail name"
                             placeholderTextColor={colors.onBackgroundSecondary}
                            accessible={true}
                            accessibilityLabel="Cocktail name"
                            accessibilityHint="Enter the name of your cocktail"
                            returnKeyType="next"
                        />
                    </View>

                    <View style={styles.rowContainer} accessible={false}>
                        <View style={styles.halfFieldContainer} accessible={false}>
                            <Text 
                                style={styles.label}
                                accessible={true}
                                accessibilityRole="text"
                            >
                                Category
                            </Text>
                            <TextInput
                                style={styles.input}
                                value={cocktail.category}
                                onChangeText={(value) => updateField('category', value)}
                                placeholder="e.g., Ordinary Drink"
                                 placeholderTextColor={colors.onBackgroundSecondary}
                                accessible={true}
                                accessibilityLabel="Cocktail category"
                                accessibilityHint="Enter the category type of the cocktail"
                                returnKeyType="next"
                            />
                        </View>

                        <View style={styles.halfFieldContainer} accessible={false}>
                            <Text 
                                style={styles.label}
                                accessible={true}
                                accessibilityRole="text"
                            >
                                Glass Type
                            </Text>
                            <TextInput
                                style={styles.input}
                                value={cocktail.glass}
                                onChangeText={(value) => updateField('glass', value)}
                                placeholder="e.g., Old-fashioned"
                                 placeholderTextColor={colors.onBackgroundSecondary}
                                accessible={true}
                                accessibilityLabel="Glass type"
                                accessibilityHint="Enter the recommended glass for this cocktail"
                                returnKeyType="next"
                            />
                        </View>
                    </View>

                    <View style={styles.fieldContainer} accessible={false}>
                        <Text 
                            style={styles.label}
                            accessible={true}
                            accessibilityRole="text"
                        >
                            Image URL
                        </Text>
                        <TextInput
                            style={styles.input}
                            value={cocktail.imageUrl}
                            onChangeText={(value) => updateField('imageUrl', value)}
                            placeholder="https://example.com/image.jpg"
                             placeholderTextColor={colors.onBackgroundSecondary}
                            keyboardType="url"
                            autoCapitalize="none"
                            accessible={true}
                            accessibilityLabel="Image URL"
                            accessibilityHint="Enter a web address for the cocktail image"
                            returnKeyType="next"
                        />
                    </View>

                    <View style={styles.fieldContainer} accessible={false}>
                        <Text 
                            style={styles.label}
                            accessible={true}
                            accessibilityRole="text"
                        >
                            Ingredients ({cocktail.ingredientList.length})
                        </Text>
                        {cocktail.ingredientList.map((ingredient, index) => (
                            <View 
                                key={index} 
                                style={styles.ingredientRow}
                                accessible={false}
                            >
                                <TextInput
                                    style={[styles.input, styles.ingredientInput]}
                                    value={ingredient.measure}
                                    onChangeText={(value) => updateIngredientMeasure(index, value)}
                                    placeholder={`Measure ${index + 1}`}
                                    accessible={true}
                                    accessibilityLabel={`Ingredient ${index + 1} measure`}
                                    accessibilityHint="Enter the amount or measurement for this ingredient"
                                    returnKeyType="next"
                                />

                                <TextInput
                                    style={[styles.input, styles.ingredientInput]}
                                    value={ingredient.name}
                                    onChangeText={(value) => updateIngredientName(index, value)}
                                    placeholder={`Ingredient ${index + 1}`}
                                    accessible={true}
                                    accessibilityLabel={`Ingredient ${index + 1} name`}
                                    accessibilityHint="Enter the name of this ingredient"
                                    returnKeyType="next"
                                />

                                <Pressable 
                                    onPress={() => removeIngredient(index)}
                                    style={styles.removeButton}
                                    accessible={true}
                                    accessibilityRole="button"
                                    accessibilityLabel={`Remove ingredient ${index + 1}`}
                                    accessibilityHint="Double tap to remove this ingredient from the list"
                                    hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                >
                                    <Ionicons name="close" size={20} color="#666" />
                                </Pressable>
                            </View>
                        ))}

                        <View style={styles.addButtonContainer}>
                            <Button 
                                title="Add Ingredient" 
                                {...(Platform.OS === 'android' && { color: '#1a3a52' })} 
                                onPress={() => {
                                    updateField('ingredientList', [...cocktail.ingredientList, { name: '', measure: '' }]);
                                }}
                                accessible={true}
                                accessibilityLabel="Add ingredient"
                                accessibilityHint="Double tap to add a new ingredient to the list"
                            />
                        </View>
                    </View>

                    <View style={styles.fieldContainer} accessible={false}>
                        <Text 
                            style={styles.label}
                            accessible={true}
                            accessibilityRole="text"
                        >
                            Instructions (Required)
                        </Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={cocktail.instructions}
                            onChangeText={(value) => updateField('instructions', value)}
                            placeholder="Enter preparation instructions..."
                            placeholderTextColor={colors.onBackgroundSecondary}
                            multiline={true}
                            numberOfLines={4}
                            textAlignVertical="top"
                            accessible={true}
                            accessibilityLabel="Cocktail instructions"
                            accessibilityHint="Enter detailed instructions for preparing this cocktail"
                        />
                    </View>
                </View>
            </ScrollView>

            <View style={styles.divider} />
            <View style={styles.saveButtonContainer}>
                <Button 
                    title="Save Cocktail" 
                    style={styles.submitButton} 
                    {...(Platform.OS === 'android' && { color: colors.primary })} 
                    onPress={() => onSave(cocktail)}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Save cocktail"
                    accessibilityHint="Double tap to save this cocktail to your collection"
                />
            </View>
        </KeyboardAvoidingView>
    );
}

export default CocktailForm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        marginBottom: 40,
        backgroundColor: colors.background,
    },
    scrollView: {
        flex: 1,
    },
    form: {
        padding: 20,
        paddingBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.onToolbar,
        marginBottom: 16,
        textAlign: 'center',
    },
    fieldContainer: {
        marginBottom: 20,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        gap: 10,
    },
    halfFieldContainer: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.onBackground,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: colors.container,
        color: colors.onContainer,
    },
    textArea: {
        minHeight: 100,
        paddingTop: 12,
    },
    ingredientRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    ingredientInput: {
        flex: 1,
    },
    removeButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButtonContainer: {
        alignItems: 'flex-start',
        paddingStart: 8,
    },
    saveButtonContainer: {
        paddingHorizontal: 10,
    },
    submitButton: {
        borderRadius: 12,
        alignItems: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: '#c1c7cd',
        marginBottom: 20,
    },
    switch: {
        alignSelf: 'flex-start',
    },
});
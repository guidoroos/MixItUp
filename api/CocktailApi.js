
import axios from 'axios'
import CocktailDetails from '../model/CocktailDetails'
import { getDetailsForUserGenerated, cacheDetails } from '../db/Database';
import Constants from 'expo-constants';
import Cocktail from '../model/Cocktail';

const apiSecret = Constants.expoConfig?.extra?.apiSecret;
const baseUrl = `https://www.thecocktaildb.com/api/json/v2/${apiSecret}/`;

/**
 * Get all alcoholic cocktails as thumbnail objects
 * @returns {Promise<Cocktail[]>} List of cocktail thumbs
 */
export async function getAllCocktails() {
  try {
    // Use native fetch API instead of axios (more efficient on Android)
    const response = await fetch(`${baseUrl}filter.php?a=Alcoholic`);
    const data = await response.json();
    
    if (!data.drinks) return [];
    
    // Use direct array construction instead of map (faster on Android)
    const cocktails = new Array(data.drinks.length);
    for (let i = 0; i < data.drinks.length; i++) {
      const drink = data.drinks[i];
      cocktails[i] = new Cocktail(
        drink.strDrink, 
        drink.strDrinkThumb,
        drink.idDrink,
        false,
        false
      );
    }
    
    return cocktails;
  } catch (error) {
    console.log('Failed to fetch cocktails:', error);
    return [];
  }
}

/**
 * Get detailed cocktail information by ID
 * @param {string} id The cocktail ID
 * @returns {Promise<CocktailDetails|null>} Detailed cocktail object or null
 */
export async function getCocktailById(id) {
  try {
    const response = await fetch(`${baseUrl}lookup.php?i=${id}`);
    const data = await response.json();
    console.log("Fetched cocktail data by ID:", data);

    return data.drinks && data.drinks.length > 0
      ? new CocktailDetails(data.drinks[0], true)
      : null;
  } catch (error) {
    console.log(`Failed to fetch cocktail with ID ${id}:`, error);
    return null;
  }
}

export async function getCocktailDetails(cocktail) {
    let details;
    console.log ("Fetching details for cocktail:", cocktail);

    if (cocktail.isUserGenerated) {
        // Fetch from local database for user-generated cocktails
        details = await getDetailsForUserGenerated(cocktail.id);
        console.log("Fetched user-generated cocktail details:", details);
    } else {
        // Fetch from API for standard cocktails
        details = await getCocktailById(cocktail.id);
        cacheDetails(cocktail.id, details);
    }

    return details;
}

export async function getCocktailIdsByCategory(category) {
  try {
    const response = await fetch(`${baseUrl}filter.php?c=${encodeURIComponent(category)}`);
    const data = await response.json();
    
    if (!data.drinks) return [];
    
    // Direct extraction of IDs only, avoiding object creation
    const ids = new Array(data.drinks.length);
    for (let i = 0; i < data.drinks.length; i++) {
      ids[i] = data.drinks[i].idDrink;
    }
    
    return ids;
  } catch (error) {
    console.log(`Failed to fetch cocktails by category ${category}:`, error);
    return [];
  }
}

/**
 * Get cocktail IDs by ingredient
 * @param {string} ingredient The ingredient name (e.g., 'Gin', 'Vodka')
 * @returns {Promise<string[]>} Array of cocktail IDs
 */
export async function getCocktailIdsByIngredient(ingredient) {
  try {
    const response = await fetch(`${baseUrl}filter.php?i=${encodeURIComponent(ingredient)}`);
    const data = await response.json();
    
    if (!data.drinks) return [];
    
    // Direct extraction of IDs only
    const ids = new Array(data.drinks.length);
    for (let i = 0; i < data.drinks.length; i++) {
      ids[i] = data.drinks[i].idDrink;
    }
    
    return ids;
  } catch (error) {
    console.log(`Failed to fetch cocktails by ingredient ${ingredient}:`, error);
    return [];
  }
}

/**
 * Get cocktail IDs by multiple ingredients
 * @param {string[]} ingredients Array of ingredient names (e.g., ['Gin', 'Dry Vermouth', 'Anis'])
 * @returns {Promise<string[]>} Array of cocktail IDs
 */
export async function getCocktailIdsByMultiIngredient(ingredients) {
  try {
    const formattedIngredients = ingredients.map(ingredient => ingredient.toLowerCase().replace(/\s+/g, '_'));
    const ingredientString = formattedIngredients.join(',');
    const response = await fetch(`${baseUrl}filter.php?i=${encodeURIComponent(ingredientString)}`);
    const data = await response.json();
    
    if (!data.drinks) return [];
    
    // Direct extraction of IDs only
    const ids = new Array(data.drinks.length);
    for (let i = 0; i < data.drinks.length; i++) {
      ids[i] = data.drinks[i].idDrink;
    }
    
    return ids;
  } catch (error) {
    console.log(`Failed to fetch cocktails by ingredients ${ingredients.join(', ')}:`, error);
    return [];
  }
}


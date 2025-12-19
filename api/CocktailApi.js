
import axios from 'axios'
import Cocktail from '../model/Cocktail'
import { upsertCocktail } from '../db/Database';
import Constants from 'expo-constants';

const apiSecret = Constants.expoConfig?.extra?.apiSecret;
const baseUrl = `https://www.thecocktaildb.com/api/json/v2/${apiSecret}/`;

export async function getCocktailsByFirstLetter(letter) {
    try {
        const response = await axios.get(`${baseUrl}search.php?f=${letter}`);
        return response.data.drinks ? response.data.drinks
            .filter(drink => drink && drink.idDrink)
            .map(drink => new Cocktail(drink, true)) : [];
    } catch (error) {
        console.error(`error fetching cocktails for letter ${letter}:`, error);
        return [];
    }
}

export async function getAllCocktails() {
    //no api for full list, so we fetch by letter
    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    console.log('Fetching cocktails from API...');

    const letterPromises = letters.map(async letter => {
        const drinks = await getCocktailsByFirstLetter(letter);
        if (drinks && drinks.length > 0) {
            await Promise.all(drinks.map(cocktail => upsertCocktail(cocktail)));
        }
        return { letter, count: drinks?.length || 0 };
    });

    await Promise.all(letterPromises);
}



import * as SQLite from 'expo-sqlite';
import Cocktail from '../model/Cocktail';

const db = SQLite.openDatabaseSync('cocktails.db');

export async function initializeDatabase() {
    try {
         await db.execAsync(`
            CREATE TABLE IF NOT EXISTS cocktails (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                category TEXT,
                instructions TEXT,
                imageUrl TEXT,
                glass TEXT,
                dateAdded TEXT DEFAULT CURRENT_TIMESTAMP,
                isFavorite INTEGER DEFAULT 0
            )
        `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS ingredients (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL
            )
        `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS cocktail_ingredients (
                cocktailId INTEGER NOT NULL,
                ingredientId INTEGER NOT NULL,
                measure TEXT,
                FOREIGN KEY (cocktailId) REFERENCES cocktails (id) ON DELETE CASCADE,
                FOREIGN KEY (ingredientId) REFERENCES ingredients (id) ON DELETE CASCADE,
                UNIQUE(cocktailId, ingredientId)
            )
        `);
    } catch (error) {
    };
}

export async function upsertCocktail(cocktail) {
        let cocktailId;
        const isFavoriteValue = cocktail.isFavorite === true ? 1 : 0;

        if (cocktail.id != null) {
            // UPDATE existing
            await db.runAsync(`
                UPDATE cocktails
                SET name = ?, category = ?, instructions = ?, imageUrl = ?, glass = ?, isFavorite = ?
                WHERE id = ?
            `, [cocktail.name, cocktail.category, cocktail.instructions, cocktail.imageUrl, cocktail.glass, isFavoriteValue, cocktail.id]);
            cocktailId = cocktail.id;
        } else {
            // INSERT new
            const result = await db.runAsync(`
                INSERT INTO cocktails (name, category, instructions, imageUrl, glass, isFavorite)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [cocktail.name, cocktail.category, cocktail.instructions, cocktail.imageUrl, cocktail.glass, isFavoriteValue]);
            cocktailId = result.lastInsertRowId;
        }


        // Clear existing ingredients for this cocktail
        await db.runAsync(`DELETE FROM cocktail_ingredients WHERE cocktailId = ?`, [cocktailId]);


        // Insert all ingredients at once
        for (const ing of cocktail.ingredientList) {
            await db.runAsync(`INSERT OR IGNORE INTO ingredients (name) VALUES (?)`, [ing.name]);
        }

        // Then batch the cocktail_ingredients
        for (const ing of cocktail.ingredientList) {
            const ingredientResult = db.getFirstSync(`SELECT id FROM ingredients WHERE name = ?`, [ing.name]);
            await db.runAsync(`INSERT OR IGNORE INTO cocktail_ingredients VALUES (?, ?, ?)`,
                [cocktailId, ingredientResult.id, ing.measure]);
        }
}

export async function getAllCocktailsFromDB() {

    const results = db.getAllSync(`
        SELECT 
            c.id,
            c.name,
            c.category,
            c.instructions,
            c.imageUrl,
            c.glass,
            c.isFavorite,
            GROUP_CONCAT(i.name || '|' || COALESCE(ci.measure, ''), '; ') as ingredients
        FROM cocktails c
        LEFT JOIN cocktail_ingredients ci ON c.id = ci.cocktailId
        LEFT JOIN ingredients i ON ci.ingredientId = i.id
        GROUP BY c.id
        ORDER BY c.name
    `);

    return results.map(row => {
        const ingredientList = row.ingredients ? row.ingredients.split('; ').map(item => {
            const [name, measure] = item.split('|');
            return { name, measure };
        }) : [];

        return new Cocktail({
            idDrink: row.id,
            strDrink: row.name,
            strCategory: row.category,
            strInstructions: row.instructions,
            strDrinkThumb: row.imageUrl,
            strGlass: row.glass,
            isFavorite: row.isFavorite,
            ingredientList: ingredientList,
        });
    });
}

export async function deleteCocktail(cocktailId) {
    await db.runAsync(`
        DELETE FROM cocktails WHERE id = ?
    `, [cocktailId]);
}

export function getCocktailById(cocktailId) {
    const cocktail = db.getFirstSync(`
        SELECT * FROM cocktails WHERE id = ?
    `, [cocktailId]);

    const ingredients = db.getAllSync(`
        SELECT i.name as ingredient, ci.measure
        FROM cocktail_ingredients ci
        JOIN ingredients i ON ci.ingredientId = i.id
        WHERE ci.cocktailId = ?
    `, [cocktailId]);

    return {
        ...cocktail,
        ingredientList: ingredients
    };
}


export function isCocktailTableEmpty() {
    const result = db.getFirstSync(`
        SELECT COUNT(*) as count FROM cocktails
    `);
    return Number(result.count) === 0;
}

export async function setAsFavorite(cocktailId, isFavorite) {
    await db.runAsync(`
        UPDATE cocktails
        SET isFavorite = ?
        WHERE id = ?
    `, [isFavorite, cocktailId]);
}

export async function getFavoriteCocktails() {
    const results = db.getAllSync(`
        SELECT  * FROM cocktails WHERE isFavorite = 1
    `);
    return results;
}
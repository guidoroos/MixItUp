import * as SQLite from 'expo-sqlite';
import Cocktail from '../model/Cocktail';
import CocktailDetails from '../model/CocktailDetails';

const db = SQLite.openDatabaseSync('cocktails.db');

export async function initializeDatabase() {
    try {
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS cocktails (
                id TEXT PRIMARY KEY,
                name TEXT,
                imageUrl TEXT,
                isUserGenerated INTEGER DEFAULT 0,
                isFavorite INTEGER DEFAULT 0
            )
        `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS cocktail_details (
                id TEXT PRIMARY KEY,
                category TEXT,
                instructions TEXT,
                glass TEXT,
                FOREIGN KEY (id) REFERENCES cocktails (id) ON DELETE CASCADE
            )
        `);

        // Ingredients table
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS ingredients (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL
            )
        `);

        // Join table for cocktails and ingredients
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS cocktail_ingredients (
                cocktailId TEXT NOT NULL,
                ingredientId INTEGER NOT NULL,
                measure TEXT,
                FOREIGN KEY (cocktailId) REFERENCES cocktails (idDrink) ON DELETE CASCADE,
                FOREIGN KEY (ingredientId) REFERENCES ingredients (id) ON DELETE CASCADE,
                UNIQUE(cocktailId, ingredientId)
            )
        `);
    } catch (error) {
        console.log("Database initialization error:", error);
    }
}

export async function upsertCocktail(cocktail) {
    const isFavoriteValue = cocktail.isFavorite === true ? 1 : 0;
    const isUserGeneratedValue = cocktail.isUserGenerated === true ? 1 : 0;

    try {
        // Check if cocktail exists
        const existing = await db.getFirstAsync(`
            SELECT id FROM cocktails WHERE id = ?
        `, [cocktail.id]);

        if (existing) {
            // UPDATE existing
            await db.runAsync(`
                UPDATE cocktails
                SET name = ?, imageUrl = ?, isFavorite = ?, isUserGenerated = ?
                WHERE id = ?
            `, [cocktail.name, cocktail.imageUrl, isFavoriteValue, isUserGeneratedValue, cocktail.id]);
        } else {
            // INSERT new
            await db.runAsync(`
                INSERT INTO cocktails (id, name, imageUrl, isFavorite, isUserGenerated)
                VALUES (?, ?, ?, ?, ?)
            `, [cocktail.id, cocktail.name, cocktail.imageUrl, isFavoriteValue, isUserGeneratedValue]);
        }
    } catch (error) {
        console.log("Error upserting cocktail:", error);
    }
}

export async function getAllCocktailsFromDB() {
    try {

        const results = db.getAllSync(`
            SELECT id, name, imageUrl, isUserGenerated, isFavorite FROM cocktails
            ORDER BY name
        `);


        return results.map(row =>
            new Cocktail(
                row.name,
                row.imageUrl,
                row.id,
                row.isUserGenerated === 1,
                row.isFavorite === 1
            ));
    } catch (error) {
        console.log("Error getting all cocktails:", error);
        return [];
    }
}

export async function deleteCocktail(cocktailId) {
    try {
        await db.runAsync(`
            DELETE FROM cocktails WHERE id = ?
        `, [cocktailId]);
    } catch (error) {
        console.log("Error deleting cocktail:", error);
    }
}

export function getCocktailById(cocktailId) {
    try {
        const cocktail = db.getFirstSync(`
            SELECT id, name, imageUrl, isUserGenerated, isFavorite FROM cocktails WHERE id = ?
        `, [cocktailId]);

        if (!cocktail) return null;

        return new Cocktail(
            cocktail.name,
            cocktail.imageUrl,
            cocktail.id,
            cocktail.isUserGenerated === 1,
            cocktail.isFavorite === 1
        );
    } catch (error) {
        console.log("Error getting cocktail by ID:", error);
        return null;
    }
}

export function isCocktailTableEmpty() {
    try {
        const result = db.getFirstSync(`
            SELECT COUNT(*) as count FROM cocktails
        `);
        return Number(result.count) === 0;
    } catch (error) {
        console.log("Error checking if table is empty:", error);
        return true;
    }
}

async function setAsFavorite(cocktailId, isFavorite) {
    try {
        const isFavoriteValue = isFavorite ? 1 : 0;
        await db.runAsync(`
            UPDATE cocktails
            SET isFavorite = ?
            WHERE id = ?
        `, [isFavoriteValue, cocktailId]);
    } catch (error) {
        console.log("Error setting favorite status:", error);
    }
}

export async function getFavoriteCocktails() {
    try {
        const results = db.getAllSync(`
            SELECT id, name, imageUrl, isUserGenerated, isFavorite FROM cocktails WHERE isFavorite = 1
        `);

        return results.map(row => new Cocktail(
            row.name,
            row.imageUrl,
            row.id,
            row.isUserGenerated === 1,
            row.isFavorite === 1
        ));
    } catch (error) {
        console.log("Error getting favorite cocktails:", error);
        return [];
    }
}

/**
 * Caches cocktail details and optionally marks as user-generated
 * @param {string} cocktailId - The ID of the cocktail
 * @param {Object} cocktail - The cocktail details object
 * @param {boolean} isUserGenerated - Whether to mark as user-generated
 */
export async function cacheDetails(cocktailId, cocktail, isUserGenerated = false) {
    try {
        // Set isUserGenerated flag if needed
        if (isUserGenerated) {
            await db.runAsync(
                `UPDATE cocktails SET isUserGenerated = 1 WHERE id = ?`,
                [cocktailId]
            );
        }
        
        // Reuse the existing saveCocktailDetails function
        await saveCocktailDetails(cocktailId, cocktail);
        
        return cocktailId;
    } catch (error) {
        console.log("Error caching cocktail details:", error);
        throw error;
    }
}

/**
 * Saves cocktail details (category, instructions, glass, ingredients) to the database
 * @param {string} cocktailId - The ID of the cocktail
 * @param {Object} cocktail - The cocktail details object containing category, instructions, glass, and ingredientList
 */
export async function saveCocktailDetails(cocktailId, cocktail) {
    try {
        console.log("Saving cocktail details for ID:", cocktailId);
        
        // Save details
        await db.runAsync(`INSERT OR IGNORE INTO cocktail_details (id, category, instructions, glass) VALUES (?, ?, ?, ?)`,
            [cocktailId, cocktail.category, cocktail.instructions, cocktail.glass]);
            
        // Clear existing ingredients
        await db.runAsync(`DELETE FROM cocktail_ingredients WHERE cocktailId = ?`, [cocktailId]);

        // Insert all ingredients
        for (const ing of cocktail.ingredientList) {
            await db.runAsync(`INSERT OR IGNORE INTO ingredients (name) VALUES (?)`, [ing.name]);
        }

        // Link ingredients to cocktail
        for (const ing of cocktail.ingredientList) {
            const ingredientResult = db.getFirstSync(`SELECT id FROM ingredients WHERE name = ?`, [ing.name]);
            await db.runAsync(`INSERT OR IGNORE INTO cocktail_ingredients VALUES (?, ?, ?)`,
                [cocktailId, ingredientResult.id, ing.measure]);
        }
    } catch (error) {
        console.log("Error saving cocktail details:", error);
        throw error;
    }
}



export async function upsertUserGenerated(cocktail) {
    try {
        let cocktailId = cocktail.id;
        const isNew = !cocktailId;

        // If this is a new cocktail, generate an ID
        if (isNew) {
            // Create a unique ID for user-generated cocktails
            // Prefix with 'user-' to distinguish from API cocktails
            cocktailId = `user-${Date.now()}`;
        }

        // Create the cocktail object
        const cocktailBase = new Cocktail(
            cocktail.name,
            cocktail.imageUrl,
            cocktailId,
            true,
            cocktail.isFavorite,
        );

        upsertCocktail(cocktailBase);

        console.log("Upserting user-generated cocktail details for ID:", cocktail);
        await saveCocktailDetails(cocktailId, cocktail);

        return cocktailId;
    } catch (error) {
        console.log("Error saving user-generated cocktail:", error);
        throw error;
    }
}
/**
 * Get complete details for a user-generated cocktail
 * @param {string} cocktailId The ID of the cocktail
 * @returns {Object} Combined cocktail with thumbnail and detail info
 */
export async function getDetailsForUserGenerated(cocktailId) {
    try {
        // Get basic info
        const thumb = getCocktailById(cocktailId);
        console.log("User-generated cocktail thumb:", thumb);
        if (!thumb) return null;

        // Get details
        const details = await db.getFirstAsync(`
            SELECT category, instructions, glass
            FROM cocktail_details
            WHERE id = ?
        `, [cocktailId]);

        console.log("User-generated cocktail details:", details);
        if (!details) return null;

        // Get ingredients
        const ingredients = await db.getAllAsync(`
            SELECT i.name, ci.measure
            FROM cocktail_ingredients ci
            JOIN ingredients i ON ci.ingredientId = i.id
            WHERE ci.cocktailId = ?
        `, [cocktailId]);

        // Combine all data into a complete cocktail object
        return new CocktailDetails({
            id: cocktailId,
            name: thumb.name,
            imageUrl: thumb.imageUrl,
            isUserGenerated: true,
            isFavorite: thumb.isFavorite,
            category: details.category,
            instructions: details.instructions,
            glass: details.glass,
            ingredientList: ingredients.map(i => ({
                name: i.name,
                measure: i.measure
            }))
        });
    } catch (error) {
        console.log("Error getting user-generated cocktail:", error);
        return null;
    }
}

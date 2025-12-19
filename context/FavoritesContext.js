

import { createContext, useState, useEffect  } from "react";
import { setAsFavorite } from "../db/Database";
import { getFavoriteCocktails } from "../db/Database";

export const FavoritesContext = createContext({
    favoriteIds: [],
    setFavorite: (id, isFavorite) => { }
})

export function FavoritesContextProvider({ children }) {
    const [ids, setIds] = useState([])

    useEffect(() => {
        const fetchFavorites = async () => {
            const favoriteCocktails = await getFavoriteCocktails();
            const favoriteIds = favoriteCocktails.map(cocktail => cocktail.id);
            setIds(favoriteIds);
        };

        fetchFavorites();
    }, []);

    async function add(id) {
        try {
            await setAsFavorite(id, 1);
            setIds((currentIds) => [...currentIds, id]);
        } catch (error) {
            console.error("Error adding favorite:", error);
        }
    }

    async function remove(id) {
        try {
            await setAsFavorite(id, 0);
            setIds((currentIds) => currentIds.filter((currentId) => currentId !== id));
        } catch (error) {
            console.error("Error removing favorite:", error);
        }
    }

    const value = {
        favoriteIds: ids,
        setFavorite: async (id, isFavorite) => {
            if (isFavorite) {
                await add(id);
            } else {
                await remove(id);
            }
        },
    }
    return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}
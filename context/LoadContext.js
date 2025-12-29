// context/LoadContext.js
import { createContext, useState, useContext, useCallback } from 'react';
import { getAllCocktails } from '../api/CocktailApi';
import { upsertCocktail, isCocktailTableEmpty, getAllCocktailsFromDB } from '../db/Database';
import Cocktail from '../model/Cocktail';

// Create the context
const LoadContext = createContext();

// Provider component
export function LoadProvider({ children }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cocktails, setCocktails] = useState([]);

const handleSave = (savedCocktail) => {
    const index = cocktails.findIndex(c => c.id === savedCocktail.id);
    let updatedCocktails = [...cocktails];

    if (index !== -1) {
      // Update existing cocktail
      updatedCocktails[index] = new Cocktail(
        savedCocktail.name,
        savedCocktail.imageUrl,
        savedCocktail.id,
        savedCocktail.isUserGenerated,
        savedCocktail.isFavorite
      );
    } else {
      // Add new cocktail
      updatedCocktails.push(new Cocktail(
        savedCocktail.name,
        savedCocktail.imageUrl,
        savedCocktail.id,
        savedCocktail.isUserGenerated,
        savedCocktail.isFavorite
      ));
    }

    setCocktails(updatedCocktails);
  };

  const handleDelete = (deletedId) => {
    setCocktails(prevCocktails => prevCocktails.filter(c => c.id !== deletedId));
  }

    const loadCocktails = useCallback(async () => {
        console.log('Loading cocktails...');
        setLoading(true);
        setError(null);

        try {
            let loadedCocktails;
            const isEmpty = isCocktailTableEmpty(); 
            
            if (isEmpty) {
                loadedCocktails = await getAllCocktails();
                console.log('Cocktails fetched from API:', loadedCocktails.length);
                await Promise.all(loadedCocktails.map(cocktail => upsertCocktail(cocktail)));
            } else {
                loadedCocktails = await getAllCocktailsFromDB();
                console.log('Cocktails loaded from local database:', loadedCocktails.length);
            }
            
            setCocktails(loadedCocktails);
        } catch (err) {
            setError(`Failed to load cocktails: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, []);


    // Values to be provided to consumers
    const value = {
        loading,
        error,
        loadCocktails,
        cocktails,
        handleDelete,
        handleSave,
    };

    return (
        <LoadContext.Provider value={value}>
            {children}
        </LoadContext.Provider>
    );
}

// Custom hook for consuming the context
export function useLoad() {
    const context = useContext(LoadContext);
    if (context === undefined) {
        throw new Error('useLoad must be used within a LoadProvider');
    }
    return context;
}
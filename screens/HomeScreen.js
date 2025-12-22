import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useEffect, useState, useLayoutEffect, useCallback, useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { getAllCocktailsFromDB } from '../db/Database';
import CocktailList from '../components/CocktailList';
import FilterModal from '../components/FilterModal';
import FavoritesModal from '../components/FavoritesModal';
import { colors } from '../Colors';
import { FavoritesContext } from '../context/FavoritesContext';
import { useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';


function HomeScreen({ navigation, route }) {
  const [cocktails, setCocktails] = useState([]);
  const [filteredCocktails, setFilteredCocktails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isFavoritesModalVisible, setIsFavoritesModalVisible] = useState(false);
  const favoriteContext = useContext(FavoritesContext);

  const favoriteCocktails = useMemo(() =>
    cocktails.filter(cocktail => favoriteContext.favoriteIds?.includes(cocktail.id)),
    [cocktails, favoriteContext.favoriteIds]
  );

  useFocusEffect(
    useCallback(() => {
      // Always check on focus
      const checkAndReload = async () => {
        if (cocktails.length === 0) {
          const allCocktails = await getAllCocktailsFromDB();
          setCocktails(allCocktails);
        }
      };

      checkAndReload();

      // Handle params
      if (route.params?.savedCocktail) {
        handleCocktailSaved(route.params.savedCocktail);
        navigation.setParams({ savedCocktail: undefined });
      }
      if (route.params?.deletedId) {
        const deletedId = route.params.deletedId;
        handleDeleteCocktail(deletedId);
        navigation.setParams({ deletedId: undefined });
      }
    }, [cocktails.length, route.params])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.iconList}>
          <TouchableOpacity
            onPress={() => handleFilterPress()}
            style={{ position: 'relative' }}
          >
            <Ionicons name="funnel-outline" size={28} color={colors.onToolbar} />
            {selectedFilter !== null && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'red',
                }}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('UpsertCocktail')}
            style={{ position: 'relative' }}
          >
            <Ionicons name="add" size={36} color={colors.onToolbar} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsFavoritesModalVisible(true)}
            style={{ position: 'relative' }}
          >
            <Ionicons name="star-outline" size={30} color={colors.onToolbar} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, selectedFilter]);


  useEffect(() => {
    const loadCocktails = async () => {

      const allCocktails = await getAllCocktailsFromDB();
      setCocktails(allCocktails);

    };

    loadCocktails();
  }, []);

  useEffect(() => {
    if (cocktails.length === 0) return;

    const filterCocktails = () => {
      let filtered = cocktails.filter(cocktail =>
        cocktail.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (selectedFilter) {
        if (selectedFilter.spirit) {
          filtered = filtered.filter(cocktail =>
            cocktail.ingredientList.some(ing => ing.name === selectedFilter.spirit)
          );
        }
        if (selectedFilter.type) {
          filtered = filtered.filter(cocktail =>
            cocktail.category === selectedFilter.type
          );
        }
      }

      setFilteredCocktails(filtered);
    };

    filterCocktails();
  }, [searchTerm, selectedFilter, cocktails]);

  const handleFilterPress = useCallback(() => {
    if (selectedFilter !== null) {
      setSelectedFilter(null);
    } else {
      setIsFilterModalVisible(true);
    }
  }, [selectedFilter]);

  const handleFilterSelect = (spirit) => {
    setIsFilterModalVisible(false);
    setSelectedFilter(spirit);
  };

  const handleCocktailSaved = (savedCocktail) => {
    const index = cocktails.findIndex(c => c.id === savedCocktail.id);
    let updatedCocktails = [...cocktails];

    if (index !== -1) {
      // Update existing cocktail
      updatedCocktails[index] = savedCocktail;
    } else {
      // Add new cocktail
      updatedCocktails.push(savedCocktail);
    }

    setCocktails(updatedCocktails);
  };

  const handleDeleteCocktail = (deletedId) => {
    setCocktails(prevCocktails => prevCocktails.filter(c => c.id !== deletedId));
  }

  return (
    <View style={styles.container}>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search cocktails..."
          placeholderTextColor={"#999"}
          color={colors.content}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSearchTerm('')}
          >
            <Ionicons name="close-circle" size={28} color="#999" />
          </TouchableOpacity>
        )}
      </View>
      <CocktailList
        style={styles.cocktailList}
        cocktails={filteredCocktails}
        onPressCocktail={cocktail => navigation.navigate('CocktailDetail', { cocktail })}
        onSetFavorite={(cocktail, isFavorite) => {
          favoriteContext.setFavorite(cocktail.id, isFavorite);
        }}
      />

      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        onFilterSelect={handleFilterSelect}
        selectedFilter={selectedFilter}
      />

      <FavoritesModal
        visible={isFavoritesModalVisible}
        onClose={() => setIsFavoritesModalVisible(false)}
        cocktails={favoriteCocktails}
        onPressCocktail={cocktail => {
          setIsFavoritesModalVisible(false);
          navigation.navigate('CocktailDetail', { cocktail });
        }}
        onRemoveFavorite={(id) => {
          favoriteContext.setFavorite(id, false);
        }}
      />
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.background,
  },
  searchInput: {
    fontSize: 18,
    height: 52,
    borderColor: 'gray',
    backgroundColor: colors.container,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    margin: 16,
    flex: 1,

  },
  cocktailList: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    position: 'absolute',
    right: 24,
  },
  iconList: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginRight: 8,
  },
});
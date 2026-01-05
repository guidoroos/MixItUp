import { View, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import { useEffect, useState, useLayoutEffect, useCallback, useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import CocktailList from '../components/CocktailList';
import FilterModal from '../components/FilterModal';
import FavoritesModal from '../components/FavoritesModal';
import { colors } from '../Colors';
import { FavoritesContext } from '../context/FavoritesContext';
import { useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useLoad } from '../context/LoadContext';
import { getCocktailIdsByCategory } from '../api/CocktailApi';
import { getCocktailIdsByIngredient } from '../api/CocktailApi';
import { getCocktailIdsByMultiIngredient } from '../api/CocktailApi';
import IngredientChipsView from '../components/IngredientChipsView';
import AddFilterIngredientModal from '../components/AddFilterIngredientModal';


function HomeScreen({ navigation, route }) {
  const [filteredCocktails, setFilteredCocktails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isFavoritesModalVisible, setIsFavoritesModalVisible] = useState(false);
  const [isFilterIngredientModalVisible, setIsFilterIngredientModalVisible] = useState(false);
  const favoriteContext = useContext(FavoritesContext);
  const { loading, error, cocktails, handleDelete, handleSave } = useLoad();
  const [filterIngredients, setFilterIngredients] = useState([]);

  const favoriteCocktails = useMemo(() =>
    cocktails.filter(cocktail => favoriteContext.favoriteIds?.includes(cocktail.id)),
    [cocktails, favoriteContext.favoriteIds]
  );

  useFocusEffect(
    useCallback(() => {
      if (route.params?.savedCocktail) {
        handleSave(route.params.savedCocktail);
        navigation.setParams({ savedCocktail: null });
      }
      if (route.params?.deletedId) {
        const deletedId = route.params.deletedId;
        handleDelete(deletedId);
        navigation.setParams({ deletedId: null });
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
                  top: -2,
                  right: -2,
                  width: 10,
                  height: 10,
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
    if (cocktails.length === 0) return;

    const filterCocktails = async () => {
      let filtered = cocktails.filter(cocktail => {
        const name = cocktail.name.toLowerCase();
        const term = searchTerm.toLowerCase();

        if (name.startsWith(term)) {
          return true;
        }

        const words = name.split(' ');
        return words.some(word => word.startsWith(term));
      });

      if (filterIngredients.length > 0) {
        const ids = await getCocktailIdsByMultiIngredient(filterIngredients);
        filtered = filtered.filter(cocktail => ids.includes(cocktail.id));
      }

      if (selectedFilter) {
        if (selectedFilter.spirit) {
          const ids = await getCocktailIdsByIngredient(selectedFilter.spirit);

          filtered = filtered.filter(cocktail =>
            ids.includes(cocktail.id)
          );
        }
        if (selectedFilter.type) {
          const ids = await getCocktailIdsByCategory(selectedFilter.type);

          filtered = filtered.filter(cocktail => {
            return ids.includes(cocktail.id);
          });
        }
      }

      setFilteredCocktails(filtered);
    };

    filterCocktails();
  }, [searchTerm, selectedFilter, cocktails, filterIngredients]);

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

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search cocktails..."
          placeholderTextColor={colors.onBackgroundSecondary}
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

      <IngredientChipsView
        ingredients={filterIngredients}
        onAdd={() => setIsFilterIngredientModalVisible(true)}
        onRemove={item => setFilterIngredients(filterIngredients.filter(ing => ing !== item))}
        style ={styles.ingredientChips}
      />

      <CocktailList
        style={styles.cocktailList}
        cocktails={filteredCocktails}
        onPressCocktail={async cocktail => {
          navigation.navigate('CocktailDetail', { cocktail: cocktail })
        }}
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
        onPressCocktail={async cocktail => {
          navigation.navigate('CocktailDetail', { cocktail: cocktail });
          setIsFavoritesModalVisible(false);
        }}
        onRemoveFavorite={(id) => {
          favoriteContext.setFavorite(id, false);
        }}
      />

      <AddFilterIngredientModal
        visible={isFilterIngredientModalVisible}
        onClose={() => setIsFilterIngredientModalVisible(false)}
        ingredient={filterIngredients[0]}
        onChangeIngredient={text => setFilterIngredients([text])}
        onSubmit={text => {
          setFilterIngredients([...filterIngredients, text]);
          setIsFilterIngredientModalVisible(false);
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
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: colors.onBackground,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  loadingContainer: {
    zIndex: 1000,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  ingredientChips: {
    marginHorizontal: 16,
  },
});
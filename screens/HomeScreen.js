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
import { useLoad } from '../context/LoadContext';
import { ActivityIndicator, Text } from 'react-native';
import { getCocktailDetails } from '../api/CocktailApi';
import { getCocktailIdsByCategory } from '../api/CocktailApi';
import { getCocktailIdsByIngredient } from '../api/CocktailApi';


function HomeScreen({ navigation, route }) {
  const [filteredCocktails, setFilteredCocktails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isFavoritesModalVisible, setIsFavoritesModalVisible] = useState(false);
  const favoriteContext = useContext(FavoritesContext);
  const { loading, error, cocktails, handleDelete, handleSave } = useLoad();

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
      let filtered = cocktails.filter(cocktail =>
        cocktail.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

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
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
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
        onPressCocktail={async cocktail => {
          let details = await getCocktailDetails(cocktail);
          console.log("details:", details);
          navigation.navigate('CocktailDetail', { cocktail: details })
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
      
           let details = await getCocktailDetails(cocktail);
          navigation.navigate('CocktailDetail', { cocktail: details });
            setIsFavoritesModalVisible(false);
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
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: colors.onBackground,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});
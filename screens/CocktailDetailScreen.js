import { View, StyleSheet, Text, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { deleteCocktail } from '../db/Database'; 
import { getCocktailDetails } from '../api/CocktailApi';
import { useLayoutEffect, useState, useEffect, useContext } from 'react'; 
import { TouchableOpacity } from 'react-native';
import GlassRow from '../components/GlassRow';
import CategoryBadge from '../components/CategoryBadge';
import { FavoritesContext } from '../context/FavoritesContext';
import { Alert } from 'react-native';
import { colors } from '../Colors';
import ShareButton from '../components/ShareButton';

function CocktailDetailScreen({ route, navigation }) {
  const { cocktail } = route.params;
  console.log("cocktail:", cocktail);
  const [imageError, setImageError] = useState(false);

  const favoriteContext = useContext(FavoritesContext);

  const isFavorite = favoriteContext.favoriteIds.includes(cocktail.id);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [details, setDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoadingDetails(true);
      console.log("Fetching details for cocktail:", cocktail);
      const data = await getCocktailDetails(cocktail);
      console.log("Fetched details:", data);
      setDetails(data);
      setLoadingDetails(false);
    };
    fetchDetails();
  }, [cocktail]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.iconList}>
          <TouchableOpacity
            onPress={() => navigation.navigate('UpsertCocktail', { cocktail: details })}
            style={{ position: 'relative' }}
          >
            <Ionicons name="pencil" size={32} color={colors.onToolbar} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDeleteCocktail(cocktail.id)}
            style={{ position: 'relative' }}
          >
            <Ionicons name="trash" size={32} color={colors.onToolbar} />
          </TouchableOpacity>

          <ShareButton cocktail={details} />
        </View>
      ),
    });
  }, [navigation, cocktail.id]);

  const handleDeleteCocktail = (id) => {
    Alert.alert(
      'Delete Cocktail',
      `Are you sure you want to delete "${cocktail.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCocktail(id);
              navigation.navigate('Cocktails', { deletedId: id });
            } catch (error) {
              Alert.alert('Error', 'Failed to delete cocktail');
            }
          }
        }
      ]
    );
  };

  if (loadingDetails) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style ={styles.scrollview}>
    <View style={styles.container}>
      <View style={styles.innerContainer}>
         <TouchableOpacity onPress={() => setIsFullScreen(!isFullScreen)}>
        <View style={isFullScreen ? styles.fullScreenImageContainer : styles.imageContainer}>
          <Image
            source={
              imageError || !cocktail.imageUrl
                ? require('../assets/placeholder.png')
                : { uri: cocktail.imageUrl }
            }
            style={styles.image}
            onError={() => setImageError(true)}
            />
          
          <Pressable
            style={styles.heartIconContainer}
            onPress={() => favoriteContext.setFavorite(cocktail.id, !isFavorite)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={isFullScreen ? 45 : 30}
              color={isFavorite ? "#ff4444" : "#ffffff"}
              style={styles.heartIcon}
              accessible={false}
            />
          </Pressable>
        </View>
        </TouchableOpacity>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{cocktail.name}</Text>

          {cocktail.category && (
            <CategoryBadge style={styles.categoryBadge} category={details.category} />
          )}
        </View>
        <GlassRow glass={details.glass} style={styles.glassRow} />

        <Text style={styles.subTitle}>Ingredients</Text>
        {details.ingredientList.map((ingredient, index) => (
          <Text key={index} style={styles.ingredientText}>
            - {ingredient.measure} {ingredient.name}
          </Text>
        ))}

        <Text style={styles.subTitle}>Instructions</Text>
        <Text style={styles.instructionText}>{details.instructions}</Text>
      </View>
    </View>
    </ScrollView>
  );
}

export default CocktailDetailScreen;

const styles = StyleSheet.create({
  scrollview: {
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  innerContainer: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden'
  },
  imageContainer: {
    width: '100%',
    height: 200,
  },
  fullScreenImageContainer: {
    width: '100%',
    height: 400,
  },
  image: {
    width: '100%',
    height: '100%',
    contentFit: 'cover',
  },
  titleRow: {
    padding: 12,
    backgroundColor: colors.background ,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1, 
    marginRight: 16,
    color: colors.primaryTint,
  },
  categoryText: {
    fontSize: 18,
    color: colors.onBackground,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  glassRow: {
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: 18,
  },
  glassText: {
    fontSize: 16,
    marginLeft: 8,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 12,
    marginTop: 12,
    color: colors.onBackground,
  },
  ingredientText: {
    fontSize: 16,
    marginHorizontal: 12,
    marginTop: 4,
    color: colors.onBackground,
  },
  instructionText: {
    fontSize: 16,
    marginHorizontal: 12,
    marginTop: 4,
    marginBottom: 12,
    color: colors.onBackground,
  },
  iconList: {
    flexDirection: 'row',
    gap: 16,
    marginRight: 8,
  },
  heartIconContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
    zIndex: 10,
  },
    loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});
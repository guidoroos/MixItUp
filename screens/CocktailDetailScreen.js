import { View, StyleSheet, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { deleteCocktail } from '../db/Database';
import { useLayoutEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import GlassRow from '../components/GlassRow';
import CategoryBadge from '../components/CategoryBadge';
import { FavoritesContext } from '../context/FavoritesContext';
import { useContext } from 'react';
import { Alert } from 'react-native';
import { colors } from '../Colors';


function CocktailDetailScreen({ route, navigation }) {
  const { cocktail } = route.params;
  const [imageError, setImageError] = useState(false);

  const favoriteContext = useContext(FavoritesContext);
  const isFavorite = favoriteContext.favoriteIds.includes(cocktail.id);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.iconList}>
          <TouchableOpacity
            onPress={() => navigation.navigate('UpsertCocktail', { cocktail: cocktail })}
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

  return (
    <View style={styles.container}>
      <View style={[styles.innerContainer]}>
        <View style={styles.imageContainer}>
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
              size={30}
              color={isFavorite ? "#ff4444" : "#ffffff"}
              style={styles.heartIcon}
              accessible={false}
            />
          </Pressable>
        </View>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{cocktail.name}</Text>

          {cocktail.category && (
            <CategoryBadge style={styles.categoryBadge} category={cocktail.category} />
          )}
        </View>
        <GlassRow glass={cocktail.glass} style={styles.glassRow} />

        <Text style={styles.subTitle}>Ingredients</Text>
        {cocktail.ingredientList.map((ingredient, index) => (
          <Text key={index} style={styles.ingredientText}>
            - {ingredient.measure} {ingredient.name}
          </Text>
        ))}

        <Text style={styles.subTitle}>Instructions</Text>
        <Text style={styles.instructionText}>{cocktail.instructions}</Text>
      </View>
    </View>
  );
}

export default CocktailDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  innerContainer: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 200,
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
    color: colors.onBackground,
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
});
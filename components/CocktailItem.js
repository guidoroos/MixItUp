import { Pressable, View, Text, StyleSheet, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { FavoritesContext } from '../context/FavoritesContext';
import { useContext } from 'react';
import colors from '../Colors';
import isTablet from '../DeviceUtil';

function CocktailItem({ cocktail, onPress }) {
  const favoriteContext = useContext(FavoritesContext);
  const isFavorite = favoriteContext.favoriteIds.includes(cocktail.id);

  return (
    <View style={styles.gridItem}>
      <Pressable
        android_ripple={{ color: '#ccc' }}
        onPress={() => onPress(cocktail)}
        style={({ pressed }) => [
          styles.button,
          pressed ? styles.buttonPressed : null,
        ]}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`${cocktail.name} cocktail`}
        accessibilityHint="View cocktail details"
      >
        <View style={[styles.innerContainer]}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: cocktail.imageUrl }}
              style={styles.image}
              placeholder={require('../assets/placeholder.png')}
              contentFit="cover"
              cachePolicy="memory-disk"
              accessible={true}
              accessibilityRole="image"
              accessibilityLabel={`${cocktail.name} image`}
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
                size={isTablet ? 32 : 28}
                color={isFavorite ? "#ff4444" : "#ffffff"}
                style={styles.heartIcon}
                accessible={false}
              />
            </Pressable>
          </View>
          <Text 
            style={styles.title}
            accessible={true}
            accessibilityRole="text"
          >
            {cocktail.name}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

export default CocktailItem;

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    elevation: 2,
    backgroundColor: colors.container,
    shadowColor: colors.shadow,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
  },
  button: {
    flex: 1,
  },
  buttonPressed: {
    opacity: 0.5,
  },
  imageContainer: {
    width: 150,
    height: 150,
    marginBottom: 8,
    position: 'relative'
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  innerContainer: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    color: colors.onContainer,
  },
  heartIconContainer: {
    zIndex: 10,
    position: 'absolute',
    top: 6,
    right: 6,
    padding: 4,
  },
  heartIcon: {
    shadowColor: colors.onContainer,
    shadowOpacity: 0.75,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
    elevation: 5,
  },
});
import { Pressable, View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import CategoryBadge from './CategoryBadge';
import GlassRow from './GlassRow';
import { colors } from '../Colors';

function CocktailFavoritesItem({ cocktail, onPress, removeFavorite }) {
  return (
    <View style={styles.gridItem}>
      <Pressable
        android_ripple={{ color: '#ccc' }}
        onPress={() => onPress(cocktail)}
        style={({ pressed }) => [
          styles.button,
          pressed ? styles.buttonPressed : null,
        ]}
      >
        <View style={[styles.innerContainer]}>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeFavorite(cocktail.id)}
            activeOpacity={0.7}
          >
            <Ionicons name="trash" size={26} color={colors.content} />
          </TouchableOpacity>

          <View style={styles.imageContainer}>
            <Image source={{ uri: cocktail.imageUrl }} style={styles.image} placeholder={require('../assets/placeholder.png')} />
            <Ionicons
              name={"heart"}
              size={24}
              color={"#ff4444"}
              style={styles.heartIcon}
            />
          </View>
          <View style={styles.details}>
            <Text style={[styles.title, { paddingBottom: 12 }]}>{cocktail.name}</Text>
            <CategoryBadge category={cocktail.category} />
            <GlassRow glass={cocktail.glass} />
          </View>
        </View>
      </Pressable>
    </View>
  );
}

export default CocktailFavoritesItem;

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    elevation: 2,
    backgroundColor: 'white',
    shadowColor: 'black',
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
    marginBottom: 8
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
    flexDirection: 'row',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,

  },
  heartIcon: {
    position: 'absolute',
    top: 6,
    right: 6,
    shadowColor: 'black',
    shadowOpacity: 0.75,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
    elevation: 5,
  },
  details: {
    marginLeft: 12,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  item: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    zIndex: 10,
    borderRadius: 12,
    padding: 4,
  },
});
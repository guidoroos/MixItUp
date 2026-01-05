import { Pressable, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { shareCocktail } from '../ShareCocktailUtil';
import { colors } from '../Colors';
import { isTablet } from '../DeviceUtil';

const ShareButton = ({ cocktail }) => {
  const isTabletScreen = isTablet();

  const handleShare = async () => {
    try {
      await shareCocktail(cocktail);
    } catch (error) {
      console.log('Error sharing cocktail:', error);
    }
  };

  return (
    <Pressable 
      onPress={handleShare} 
      style={({ pressed }) => [
        styles.shareButton,
        { opacity: pressed ? 0.7 : 1 }
      ]}
      accessibilityLabel="Share this cocktail"
    >
      <Ionicons name="share-social" size={isTabletScreen ? 36 : 28} color={colors.onToolbar} />
    </Pressable>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  }
});

export default ShareButton;
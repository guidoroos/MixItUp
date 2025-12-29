import { Share } from 'react-native';


const formatCocktailForSharing = (cocktail) => {


  const cocktailInfo = {
    name: cocktail.name,
    imageUrl: cocktail.imageUrl,
    category: cocktail.category || 'N/A',
    glass: cocktail.glass || 'N/A',
    instructions: cocktail.instructions || 'N/A',
    ingredients: cocktail.ingredientList || []
  };

  let shareText = `🍹 ${cocktailInfo.name}\n\n`;
  shareText += `Category: ${cocktailInfo.category}\n`;
  shareText += `Glass: ${cocktailInfo.glass}\n\n`;
  
  shareText += 'Ingredients:\n';
  cocktailInfo.ingredients.forEach(ingredient => {
    shareText += `• ${ingredient.measure || ''} ${ingredient.name}\n`;
  });
  
  if (cocktailInfo.instructions && cocktailInfo.instructions !== 'N/A') {
    shareText += '\nInstructions:\n';
    shareText += `${cocktailInfo.instructions}`;
  }
  
  shareText += '\n\nShared from Mix it Up\n\n 🍸 A free no ads cocktail app found on Google Play and Apple App Store!';
  
  return shareText;
};

export const shareCocktail = async (cocktail) => {
  const shareText = formatCocktailForSharing(cocktail);

  try {
    await Share.share({
      message: shareText,
    });
  } catch (error) {
    console.error('Error sharing cocktail:', error);
  }
}
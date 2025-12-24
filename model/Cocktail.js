class Cocktail {
  constructor(
    strDrink,
     strDrinkThumb, 
     idDrink,
     isUserGenerated,
    isFavorite
    ) {
    this.name = strDrink;
    this.imageUrl = strDrinkThumb;
    this.id = idDrink;
    this.isUserGenerated = isUserGenerated;
    this.isFavorite = isFavorite;
  }
}

export default Cocktail;


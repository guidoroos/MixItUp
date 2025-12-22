
class Cocktail {
  constructor(data, fromApi = false) {
    if (data == null || data.idDrink == null) {
      return null;
    }

    if (fromApi) {
      this.name = data.strDrink;
      this.category = data.strCategory;
      this.instructions = data.strInstructions;
      this.imageUrl = data.strDrinkThumb;
      this.glass = data.strGlass;
      this.isFavorite = false;
      this.ingredientList = this.buildIngredientList(data);
      this.id = null; // ID will be assigned when saved to the database
    } else {
      this.id = data.idDrink;
      this.name = data.strDrink;
      this.category = data.strCategory;
      this.instructions = data.strInstructions;
      this.imageUrl = data.strDrinkThumb;
      this.glass = data.strGlass;
      this.isFavorite = data.isFavorite === 1;
      this.ingredientList = data.ingredientList || [];
    }
  }

  buildIngredientList(apiData) {
    const ingredients = [];

    for (let i = 1; i <= 15; i++) {
      const name = apiData[`strIngredient${i}`];
      const measure = apiData[`strMeasure${i}`];


      if (name == null && measure == null) {
        return ingredients;

      }

      if (name && name.trim() !== '') {
        ingredients.push({
          name: name.trim(),
          measure: measure ? measure.trim() : ''
        });
      }
    }

    return ingredients;
  }
}

export default Cocktail;


class CocktailDetails {
  constructor(data, fromApi = false) {
      console.log("Constructing CocktailDetails with data:", data, "fromApi:", fromApi);
    if (data == null) {
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
      this.id = data.idDrink
    } else {
      this.id = data.id;
      this.name = data.name;
      this.category = data.category;
      this.instructions = data.instructions;
      this.imageUrl = data.imageUrl;
      this.glass = data.glass;
      this.isFavorite = data.isFavorite === 1;
      this.ingredientList = data.ingredientList || [];
    }
  }

  buildIngredientList(apiData) {
    const ingredients = [];

    for (let i = 1; i <= 15; i++) {
      const name = apiData[`strIngredient${i}`];
      const measure = apiData[`strMeasure${i}`];

      console.log(`Ingredient ${i}:`, name, measure);


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

export default CocktailDetails;

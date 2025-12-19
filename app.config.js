import 'dotenv/config';

export default {
  expo: {
    name: "CocktailApp",
    extra: {
      apiSecret: process.env.API_SECRET,
    }
  }
};
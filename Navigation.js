import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import CocktailDetailScreen from './screens/CocktailDetailScreen';
import NewCocktailScreen from './screens/NewCocktailScreen';
import {colors} from './Colors';
import { FavoritesContextProvider } from './context/FavoritesContext';
import { Text } from 'react-native';


export default function Navigation() {
  const Stack = createNativeStackNavigator();
  return (
    <FavoritesContextProvider>
    <NavigationContainer>
      <Stack.Navigator
      screenOptions={{
      
        headerStyle: {
          backgroundColor: colors.toolbar,
        },
        headerTintColor: colors.onToolbar,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
        <Stack.Screen name="Cocktails" component={HomeScreen} options = {{ headerTitle: "",
          headerLeft: () => (
            <Text style={{ 
                fontSize: 24, 
                fontWeight: 'bold', 
                marginLeft: 8,
                color: colors.primaryTint
            }}>
                Mix it up
            </Text>
        ),
        }}  />
        <Stack.Screen name="CocktailDetail" component={CocktailDetailScreen} options={{ headerTitle: ""}} />
        <Stack.Screen name="UpsertCocktail" component={NewCocktailScreen} options={{ headerTitle: ""}}/>
      </Stack.Navigator>
    </NavigationContainer>
    </FavoritesContextProvider>
  );
}
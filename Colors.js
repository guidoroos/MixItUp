import { Appearance } from 'react-native';

const baseColors = {
  background: '#F8F9FA',
  onBackground: '#212529',
  border: '#CED4DA',
  content: '#212529',
  contentSecondary: '#6C757D',
  container: '#FFFFFF',
  onContainer: '#000000',
  primary: '#2E7D32',
  primaryTint: '#0A3E0E',
  secondary: '#6C757D',
  success: '#28A745',
  toolbar: '#FFFFFF',
  onToolbar: '#000000',
  shadow: '#000000',
};

const darkColors = {
  ...baseColors,
  background: '#121212',
  onBackground: '#E0E0E0',
  border: '#E0E0E0',
  content: '#212529',
  contentSecondary: '#6C757D',
  container: '#DAE0E2',
  onContainer: '#000000',
  primary: '#2E7D32',
  primaryTint: '#4CAF50',
  secondary: '#6C757D',
  success: '#28A745',  
  toolbar: '#1F1F1F',
  onToolbar: '#FFFFFF',
  shadow: '#9AA0A6',
};

const getColors = () => {
  try {
    const colorScheme = Appearance.getColorScheme();
    return colorScheme === 'light' ? darkColors : baseColors;
  } catch (error) {
    return baseColors;
  }
};

// Always export a valid colors object
const colors = getColors();
export { colors };
export default colors;
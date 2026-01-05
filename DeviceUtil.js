import { Dimensions } from 'react-native';

export function isTablet() {
  const { width, height } = Dimensions.get('window');
  return Math.min(width, height) >= 600;
}

export function getColumnCount() {
  const { width, height } = Dimensions.get('window');
  const isTablet = width >= 768; 
  const isLandscape = width > height;
  const isLargeTablet = width >= 1024; 
  
  if (!isTablet) {
    return 2; 
  }
  
  if (isLandscape) {
    return isLargeTablet ? 5 : 4; 
  }
  
  return 3; 
}

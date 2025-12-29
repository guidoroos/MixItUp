import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { colors } from '../Colors';

function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const onboardingData = [
    {
      id: '1',
      title: 'Welcome to Mix it up!',
      description: 'Discover and create amazing cocktails with our easy to use application',
      image: require('../assets/appIcon.png'),
      icon: 'wine'
    },
    {
      id: '2',
      title: 'Save Your Favorites',
      description: 'Keep track of your favorite cocktails for quick access anytime',
      image: require('../assets/appIcon.png'),
      icon: 'heart'
    },
    {
      id: '3',
      title: 'Create Your Own',
      description: 'Add custom recipes and share them with friends and family',
      image: require('../assets/appIcon.png'),
      icon: 'create'
    }
  ];

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.replace('Cocktails');
    }
  };

  const currentData = onboardingData[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={currentData.image} style={styles.appIcon} />
        
        <View style={styles.featureIconContainer}>
          <Ionicons name={currentData.icon} size={40} color="#ffffff" />
        </View>
        
        <Text style={styles.title}>{currentData.title}</Text>
        <Text style={styles.description}>{currentData.description}</Text>
        
        <View style={styles.indicatorContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentIndex && styles.activeIndicator
              ]}
            />
          ))}
        </View>
      </View>
      
      <Pressable style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextText}>
          {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
        </Text>
        <Ionicons 
          name={currentIndex === onboardingData.length - 1 ? "checkmark" : "arrow-forward"} 
          size={20} 
          color="#ffffff" 
          style={{ marginLeft: 8 }}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
    padding: 24,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 40,  
  },
  appIcon: {
    width: 200,
    height: 200,
    contentFit: 'cover',
    marginBottom: 32,
  },
  featureIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.onBackground,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 20,
    color: colors.onBackground,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    width: '90%',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#cccccc',
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: colors.primary,
    width: 20,
  },
  nextButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    elevation: 3,
  },
  nextText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default OnboardingScreen;
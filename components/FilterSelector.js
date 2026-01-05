
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import spirits from '../model/Spirits';
import drinkTypes from '../model/DrinkType';
import { colors } from '../Colors';
import {isTablet } from '../DeviceUtil';

const FilterSelector = ({ onSelectionChange }) => {
  const isTabletScreen = isTablet();
  return (
    <View style={styles.container}>
      <Text style={{ ...styles.title, fontSize: isTabletScreen ? 20 : 18 }}>Select Spirit</Text>
      <View style={styles.buttonContainer}>
        {spirits.map((spirit) => (
          <TouchableOpacity
            key={spirit}
            style={styles.spiritButton}
            onPress={() => onSelectionChange({ spirit, type: null })}
          >
            <Text style={{ ...styles.buttonText, fontSize: isTabletScreen ? 18 : 14 }}>
              {spirit}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.title, { paddingTop: 20 }, isTabletScreen && { fontSize: 20 } ]}>Select Drink Type</Text>
      <View style={styles.buttonContainer}>
        {drinkTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={styles.spiritButton}
            onPress={() => onSelectionChange({ spirit: null, type })}
          >
            <Text style={{ ...styles.buttonText, fontSize: isTabletScreen ? 18 : 14 }}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: colors.primaryTint,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  spiritButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#ffffff',
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});

export default FilterSelector;
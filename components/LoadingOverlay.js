import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

function LoadingOverlay({ text }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="white" />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  text: {
    fontSize: 16,
    color: 'white',
    marginTop: 15,
    textAlign: 'center',
  },
});

export default LoadingOverlay;

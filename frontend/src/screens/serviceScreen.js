import React from 'react';
import { View, StyleSheet, Linking, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const App = () => {
  const navigation = useNavigation();

  const handlePoliceStationPress = () => {
    const url = "https://police-map-test.vercel.app/";
    Linking.openURL(url).catch((err) => {
      console.error("Failed to open URL:", err);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Emergency Services</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("cont")}
          >
            <Text style={styles.buttonText}>Control Room</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handlePoliceStationPress}
          >
            <Text style={styles.buttonText}>Police Station</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray', // A solid color instead of a gradient
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  buttonContainer: {
    marginVertical: 10,
    width: '100%',
  },
  button: {
    backgroundColor: '#FF5A5F',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
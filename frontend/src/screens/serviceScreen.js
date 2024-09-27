import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import the hook

const App = () => {
  const navigation = useNavigation(); // Access navigation

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Control Room" onPress={() => navigation.navigate("cont")} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Police Station" onPress={() => alert('Police Station')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  buttonContainer: {
    marginVertical: 10,
    width: '60%',
  },
});

export default App;

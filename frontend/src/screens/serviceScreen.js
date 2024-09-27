import React from "react";
import { View, Button, StyleSheet, Linking } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import the hook

const App = () => {
  const navigation = useNavigation(); // Access navigation

  const handlePoliceStationPress = () => {
    const url = "https://police-map-test.vercel.app/"; // Replace with your desired URL
    Linking.openURL(url).catch((err) => {
      console.error("Failed to open URL:", err);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title="Control Room"
          onPress={() => navigation.navigate("cont")}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Police Station" onPress={handlePoliceStationPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  buttonContainer: {
    marginVertical: 10,
    width: "60%",
  },
});

export default App;

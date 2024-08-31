import React from "react";
import { View, Text, Image, Button, StyleSheet } from "react-native";

export default function LandingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* <Image
        source={{
          uri: "https://example.com/your-image-url.jpg",
        }}
        style={styles.image}
      /> */}
      <Button
        title="Get Started"
        onPress={() => navigation.navigate("Login")}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  button: {
    position: "absolute",
    top: 50,
    right: 20,
  },
  image: {
    width: "50%",
    height: "50%",
    resizeMode: "cover",
  },
});

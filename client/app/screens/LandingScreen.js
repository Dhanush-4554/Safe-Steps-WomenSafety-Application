// import React from "react";
// import { View, Text, Image, Button, StyleSheet } from "react-native";

// export default function LandingScreen({ navigation }) {
//   return (
//     <View style={styles.container}>
//       {/* <Image
//         source={{
//           uri: "https://example.com/your-image-url.jpg",
//         }}
//         style={styles.image}
//       /> */}
//       <Button
//         title="Get Started"
//         onPress={() => navigation.navigate("Login")}
//         style={styles.button}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fff",
//   },
//   button: {
//     position: "absolute",
//     top: 50,
//     right: 20,
//   },
//   image: {
//     width: "50%",
//     height: "50%",
//     resizeMode: "cover",
//   },
// });

import { StyleSheet, Text, Image, TouchableOpacity, View } from "react-native";
import React from "react";
import { useFonts } from "expo-font";

const Landing = ({ navigation }) => {
  // Load fonts
  const [fontsLoaded] = useFonts({
    Montserrat: require("../../assets/fonts/MontaguSlab-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.mainHeader}>SAFE STEPS</Text>
      <Text style={styles.subHeader}>
        Stay safe, stay strong, stay empowered.
      </Text>
      <Image
        source={require("../../assets/women_ico.png")}
        style={styles.image}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}> Login </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FF5A5F",
    paddingTop: 50,
    paddingBottom: 30,
  },
  buttonContainer: {
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 30,
    paddingTop: 30,
    paddingBottom: 30,
    flexDirection: "row",
  },
  buttonStyle: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    marginTop: 10,
  },
  buttonText: {
    fontFamily: "Roboto",
    fontSize: 18,
    color: "#FF5A5F",
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginBottom: 50,
  },
  mainHeader: {
    fontFamily: "Montserrat",
    fontSize: 80,
    color: "white",
  },
  subHeader: {
    fontFamily: "Roboto",
    fontSize: 22,
    color: "white",
    paddingTop: 0,
    marginTop: 0,
    marginBottom: 60,
    lineHeight: 28,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Landing;

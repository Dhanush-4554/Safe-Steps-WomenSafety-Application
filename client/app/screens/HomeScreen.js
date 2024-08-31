import React from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import SOSButton from "../components/SOSButton";
import ToggleSwitch from "../components/ToggleSwitch";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ToggleSwitch />
      <SOSButton onPress={() => console.log("SOS Button Pressed")} />

      {/* footer section */}

      <View style={styles.footer}>
        <Button title="Home" onPress={() => navigation.navigate("Home")} />
        <Button
          title="Night Support"
          onPress={() => navigation.navigate("NightSupport")}
        />
        <Button
          title="Profile"
          onPress={() => navigation.navigate("Profile")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 10,
    backgroundColor: "#f8f8f8",
  },
});

// import React from "react";
// import { View, Button, Text, StyleSheet } from "react-native";

// export default function HomeScreen({ navigation }) {
//   return (
//     <View style={styles.container}>
//       <Text>Home Screen</Text>
//       <View style={styles.footer}>
//         <Button title="Home" onPress={() => navigation.navigate("Home")} />
//         <Button
//           title="Night Support"
//           onPress={() => navigation.navigate("NightSupport")}
//         />
//         <Button
//           title="Profile"
//           onPress={() => navigation.navigate("Profile")}
//         />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// footer: {
//   flexDirection: "row",
//   justifyContent: "space-around",
//   position: "absolute",
//   bottom: 0,
//   width: "100%",
//   padding: 10,
//   backgroundColor: "#f8f8f8",
// },
// });

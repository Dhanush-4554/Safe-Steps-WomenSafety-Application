import React from "react";
import { View, StyleSheet } from "react-native";
import SOSButton from "../components/SOSButton";
import ToggleSwitch from "../components/ToggleSwitch";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ToggleSwitch />
      <SOSButton onPress={() => console.log("SOS Button Pressed")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

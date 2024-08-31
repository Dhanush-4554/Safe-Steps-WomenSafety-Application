import React, { useState } from "react";
import { View, Switch, StyleSheet, Button } from "react-native";
//import ToggleSwitch from "../components/ToggleSwitch";

export default function NightSupportScreen({ navigation }) {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <View style={styles.container}>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
        style={{ transform: [{ scaleX: 3 }, { scaleY: 3 }] }}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />

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

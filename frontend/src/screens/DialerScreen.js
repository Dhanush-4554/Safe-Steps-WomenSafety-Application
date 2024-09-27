import { StyleSheet, Text, View, Button, Linking } from "react-native";
import React from "react";

const DialerScreen = ({ navigation }) => {
  const handleEmergencyCall = () => {
    const emergencyNumber = "112";
    Linking.openURL(`tel:${emergencyNumber}`);
  };

  return (
    <View style={styles.container}>
      <Button
        title="Call Emergency (112)"
        onPress={handleEmergencyCall}
        color="#FF0000"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DialerScreen;

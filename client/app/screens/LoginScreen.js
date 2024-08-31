import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import auth from "@react-native-firebase/auth";

export default function LoginScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmResult, setConfirmResult] = useState(null);

  const signInWithPhoneNumber = async () => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirmResult(confirmation);
    } catch (error) {
      console.error("Phone number sign-in error: ", error);
    }
  };

  const confirmCode = async () => {
    try {
      await confirmResult.confirm(verificationCode);
      navigation.replace("Register");
    } catch (error) {
      console.error("Code confirmation error: ", error);
    }
  };

  return (
    <View style={styles.container}>
      {!confirmResult ? (
        <>
          <TextInput
            placeholder="Phone Number"
            onChangeText={(text) => setPhoneNumber(text)}
            keyboardType="phone-pad"
            style={styles.input}
          />
          <Button title="Send Code" onPress={signInWithPhoneNumber} />
        </>
      ) : (
        <>
          <TextInput
            placeholder="Verification Code"
            onChangeText={(text) => setVerificationCode(text)}
            keyboardType="number-pad"
            style={styles.input}
          />
          <Button title="Confirm Code" onPress={confirmCode} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
});

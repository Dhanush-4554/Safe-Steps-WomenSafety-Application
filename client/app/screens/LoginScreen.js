import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export default function LoginScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmResult, setConfirmResult] = useState(null);

  const signInWithPhoneNumber = async () => {
    try {
      if (phoneNumber === "") {
        Alert.alert("No input", "Fill the phone number", [
          {
            text: "Okay",
            style: "cancel",
          },
        ]);
      } else {
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
        setConfirmResult(confirmation);
      }
    } catch (error) {
      Alert.alert("Wrong Number", "Check the Phone number once agin", [
        {
          text: "Okay",
          style: "cancel",
        },
      ]);

      console.log("Phone number sign-in error: ", error);
    }
  };

  const confirmCode = async () => {
    try {
      const result = await confirmResult.confirm(verificationCode);

      if (result) {
        const userDoc = await firestore()
          .collection("users")
          .doc(result.user.uid)
          .get();

        if (userDoc.exists) {
          navigation.replace("Home");
        } else {
          navigation.replace("Register");
        }
      }
    } catch (error) {
      Alert.alert("Wrong Number", "Check the Phone number once agin", [
        {
          text: "Okay",
          style: "cancel",
        },
      ]);
      console.log("Code confirmation error: ", error);
    }
  };

  return (
    <View style={styles.container}>
      {!confirmResult ? (
        <>
          <TextInput
            placeholder="Phone Number"
            onChangeText={(text) => setPhoneNumber(`+91${text}`)}
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
      <View style={styles.footer}>
        <Button title="Home" onPress={() => navigation.navigate("Home")} />
        <Button
          title="register"
          onPress={() => navigation.navigate("Register")}
        />
        {/*
        <Button
          title="Profile"
          onPress={() => navigation.navigate("Profile")}
        /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
  },
});

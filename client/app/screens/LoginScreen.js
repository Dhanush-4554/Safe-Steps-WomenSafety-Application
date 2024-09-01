import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
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
      Alert.alert("Wrong Number", "Check the Phone number once again", [
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
      Alert.alert("Wrong Number", "Check the Phone number once again", [
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
          <TouchableOpacity style={styles.button} onPress={signInWithPhoneNumber}>
            <Text style={styles.buttonText}>Send Code</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            placeholder="Verification Code"
            onChangeText={(text) => setVerificationCode(text)}
            keyboardType="number-pad"
            style={styles.input}
          />
          <TouchableOpacity style={styles.button} onPress={confirmCode}>
            <Text style={styles.buttonText}>Confirm Code</Text>
          </TouchableOpacity>
        </>
      )}
      <View style={styles.footer}>
        {/* <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.footerButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate("Register")}>
          <Text style={styles.footerButtonText}>Register</Text>
        </TouchableOpacity> */}
        {/*
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate("Profile")}>
          <Text style={styles.footerButtonText}>Profile</Text>
        </TouchableOpacity> 
        */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#FF5A5F",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: "#FFFF",
    fontFamily: 'Roboto', 
    fontColor: "##FF5A5F",
  },
  button: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
   fontWeight: "bold",
  },
  buttonText: {  
    fontFamily: 'Roboto',  
    fontSize: 18,  
    color: '#FF5A5F',  
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
  },
  footerButton: {
    backgroundColor: "#6c757d",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: 100,
  },
  footerButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
});


// src/screens/RegisterScreen.js
import React, { useState } from "react";
import { View, Button, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
// import PhoneInput from "react-native-phone-input";
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Firestore functions
import Input from "../components/Input";
import { auth } from "../../configure"; // Import initialized auth
import { app } from "../../configure"; // Import initialized app

// Initialize Firestore database
const firestore = getFirestore(app);

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [trustedPerson1, setTrustedPerson1] = useState({
    name: "",
    gender: "",
    phone: "",
  });
  const [trustedPerson2, setTrustedPerson2] = useState({
    name: "",
    gender: "",
    phone: "",
  });

  const handleRegister = async () => {
    try {
      // Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save user details to Firestore
      await setDoc(doc(firestore, "users", user.uid), {
        name,
        gender,
        email,
        phone,
        trustedPersons: [
          {
            name: trustedPerson1.name,
            gender: trustedPerson1.gender,
            phone: trustedPerson1.phone,
          },
          {
            name: trustedPerson2.name,
            gender: trustedPerson2.gender,
            phone: trustedPerson2.phone,
          },
        ],
      });

      Alert.alert("Registration Successful");
      navigation.replace("Home");
      console.log("User registered");
    } catch (error) {
      Alert.alert("Registration Failed", "Check the details entered");
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* User Details */}
      <Input placeholder="Name" value={name} onChangeText={setName} />
      <Picker
        selectedValue={gender}
        onValueChange={(itemValue) => setGender(itemValue)}
      >
        <Picker.Item label="Select Gender" value="" />
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
        <Picker.Item label="Other" value="other" />
      </Picker>
      <Input placeholder="Email" value={email} onChangeText={setEmail} />
      <Input
        placeholder="Phone Number"
        keyboardType="phone-pad" // This will display the number pad
        maxLength={10}
        // Optional: limit input length
        value={phone}
        onChangeText={setPhone}
      />
      {/* Phone input */}
      <Input
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {/* Trusted Person 1 */}
      <Input
        placeholder="Trusted Person 1 Name"
        value={trustedPerson1.name}
        onChangeText={(text) =>
          setTrustedPerson1({ ...trustedPerson1, name: text })
        }
      />
      <Picker
        selectedValue={trustedPerson1.gender}
        onValueChange={(itemValue) =>
          setTrustedPerson1({ ...trustedPerson1, gender: itemValue })
        }
      >
        <Picker.Item label="Select Gender" value="" />
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
        <Picker.Item label="Other" value="other" />
      </Picker>
      <Input
        placeholder="Trusted Person 1 Phone"
        value={trustedPerson1.phone}
        keyboardType="phone-pad"
        onChangeText={(text) =>
          setTrustedPerson1({ ...trustedPerson1, phone: text })
        }
      />
      {/* Trusted Person 2 */}
      <Input
        placeholder="Trusted Person 2 Name"
        value={trustedPerson2.name}
        onChangeText={(text) =>
          setTrustedPerson2({ ...trustedPerson2, name: text })
        }
      />
      <Picker
        selectedValue={trustedPerson2.gender}
        onValueChange={(itemValue) =>
          setTrustedPerson2({ ...trustedPerson2, gender: itemValue })
        }
      >
        <Picker.Item label="Select Gender" value="" />
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
        <Picker.Item label="Other" value="other" />
      </Picker>
      <Input
        placeholder="Trusted Person 2 Phone"
        value={trustedPerson2.phone}
        keyboardType="phone-pad"
        onChangeText={(text) =>
          setTrustedPerson2({ ...trustedPerson2, phone: text })
        }
      />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
  },
});

export default RegisterScreen;

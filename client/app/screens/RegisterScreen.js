import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from "react-native";
import InputField from "../components/InputField"; 
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [trustedPerson1, setTrustedPerson1] = useState({ name: "", phone: "" });
  const [trustedPerson2, setTrustedPerson2] = useState({ name: "", phone: "" });

  const handleRegister = async () => {
    try {
      const currentUser = auth().currentUser;

      if (currentUser) {
        await firestore()
          .collection("users")
          .doc(currentUser.uid)
          .set({
            name,
            age,
            phoneNumber,
            gender,
            trustedContacts: [trustedPerson1, trustedPerson2],
          });
        navigation.replace("Home");
      }
    } catch (error) {
      console.error("Registration error: ", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <InputField
          label="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          labelStyle={styles.label} 
        />
        <InputField
          label="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          style={styles.input}
          labelStyle={styles.label}
        />
        <InputField
          label="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          style={styles.input}
          labelStyle={styles.label}
        />
        <InputField
          label="Gender"
          value={gender}
          onChangeText={setGender}
          style={styles.input}
          labelStyle={styles.label}
        />
        <InputField
          label="Trusted Person 1 Name"
          value={trustedPerson1.name}
          onChangeText={(text) => setTrustedPerson1({ ...trustedPerson1, name: text })}
          style={styles.input}
          labelStyle={styles.label}
        />
        <InputField
          label="Trusted Person 1 Phone"
          value={trustedPerson1.phone}
          onChangeText={(text) => setTrustedPerson1({ ...trustedPerson1, phone: text })}
          keyboardType="phone-pad"
          style={styles.input}
          labelStyle={styles.label}
        />
        <InputField
          label="Trusted Person 2 Name"
          value={trustedPerson2.name}
          onChangeText={(text) => setTrustedPerson2({ ...trustedPerson2, name: text })}
          style={styles.input}
          labelStyle={styles.label}
        />
        <InputField
          label="Trusted Person 2 Phone"
          value={trustedPerson2.phone}
          onChangeText={(text) => setTrustedPerson2({ ...trustedPerson2, phone: text })}
          keyboardType="phone-pad"
          style={styles.input}
          labelStyle={styles.label}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "white",
    justifyContent: "center",
    padding: 20,
  },
  formContainer: {
    flex: 1,
  },
  input: {
    marginBottom: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 18,  
    color: '#FFFFFF', 
    fontWeight: 'bold', 
  },
  button: {
    backgroundColor: "#FF5A5F",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  
  },
  buttonText: {  
    fontFamily: 'Roboto',  
    fontSize: 18,  
    color: 'white',  
  },
});

import React, { useState } from "react";
import { View, Button, StyleSheet } from "react-native";
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
    <View style={styles.container}>
      <InputField label="Name" value={name} onChangeText={setName} />
      <InputField
        label="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <InputField
        label="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <InputField label="Gender" value={gender} onChangeText={setGender} />
      <InputField
        label="Trusted Person 1 Name"
        value={trustedPerson1.name}
        onChangeText={(text) =>
          setTrustedPerson1({ ...trustedPerson1, name: text })
        }
      />
      <InputField
        label="Trusted Person 1 Phone"
        value={trustedPerson1.phone}
        onChangeText={(text) =>
          setTrustedPerson1({ ...trustedPerson1, phone: text })
        }
        keyboardType="phone-pad"
      />
      <InputField
        label="Trusted Person 2 Name"
        value={trustedPerson2.name}
        onChangeText={(text) =>
          setTrustedPerson2({ ...trustedPerson2, name: text })
        }
      />
      <InputField
        label="Trusted Person 2 Phone"
        value={trustedPerson2.phone}
        onChangeText={(text) =>
          setTrustedPerson2({ ...trustedPerson2, phone: text })
        }
        keyboardType="phone-pad"
      />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});

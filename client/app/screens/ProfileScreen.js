import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

export default function ProfileScreen({ navigation }) {
  const [userDetails, setUserDetails] = useState({});
  const [editing, setEditing] = useState(false);

  const userId = auth().currentUser.uid;

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userDoc = await firestore().collection("users").doc(userId).get();
      setUserDetails(userDoc.data());
    };
    fetchUserDetails();
  }, []);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    await firestore().collection("users").doc(userId).update(userDetails);
    setEditing(false);
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            await firestore().collection("users").doc(userId).delete();
            await auth().currentUser.delete();
            navigation.replace("Login");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {editing ? (
        <>
          <TextInput
            value={userDetails.name}
            onChangeText={(text) =>
              setUserDetails({ ...userDetails, name: text })
            }
            style={styles.input}
          />
          <TextInput
            value={userDetails.age}
            onChangeText={(text) =>
              setUserDetails({ ...userDetails, age: text })
            }
            keyboardType="number-pad"
            style={styles.input}
          />
          <TextInput
            value={userDetails.gender}
            onChangeText={(text) =>
              setUserDetails({ ...userDetails, gender: text })
            }
            style={styles.input}
          />
          <TextInput
            value={userDetails.trustedPerson1.name}
            onChangeText={(text) =>
              setUserDetails({
                ...userDetails,
                trustedPerson1: { ...userDetails.trustedPerson1, name: text },
              })
            }
            style={styles.input}
          />
          <TextInput
            value={userDetails.trustedPerson1.phoneNumber}
            onChangeText={(text) =>
              setUserDetails({
                ...userDetails,
                trustedPerson1: {
                  ...userDetails.trustedPerson1,
                  phoneNumber: text,
                },
              })
            }
            keyboardType="phone-pad"
            style={styles.input}
          />
          <TextInput
            value={userDetails.trustedPerson2.name}
            onChangeText={(text) =>
              setUserDetails({
                ...userDetails,
                trustedPerson2: { ...userDetails.trustedPerson2, name: text },
              })
            }
            style={styles.input}
          />
          <TextInput
            value={userDetails.trustedPerson2.phoneNumber}
            onChangeText={(text) =>
              setUserDetails({
                ...userDetails,
                trustedPerson2: {
                  ...userDetails.trustedPerson2,
                  phoneNumber: text,
                },
              })
            }
            keyboardType="phone-pad"
            style={styles.input}
          />
          <Button title="Save" onPress={handleSave} />
        </>
      ) : (
        <>
          <Text>Name: {userDetails.name}</Text>
          <Text>Age: {userDetails.age}</Text>
          <Text>Gender: {userDetails.gender}</Text>
          <Text>
            Trusted Person 1: {userDetails.trustedPerson1?.name},{" "}
            {userDetails.trustedPerson1?.phoneNumber}
          </Text>
          <Text>
            Trusted Person 2: {userDetails.trustedPerson2?.name},{" "}
            {userDetails.trustedPerson2?.phoneNumber}
          </Text>
          <Button title="Edit" onPress={handleEdit} />
        </>
      )}
      <Button
        title="Delete Account"
        color="red"
        onPress={handleDeleteAccount}
      />
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

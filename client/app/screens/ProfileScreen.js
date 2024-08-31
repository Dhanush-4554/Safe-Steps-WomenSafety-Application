import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Alert, FlatList } from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userId = auth().currentUser.uid;
    const unsubscribe = firestore()
      .collection("users")
      .doc(userId)
      .onSnapshot((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
      });

    return () => unsubscribe();
  }, []);

  const handleDeleteAccount = () => {
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
          style: "destructive",
          onPress: () => {
            const userId = auth().currentUser.uid;
            firestore()
              .collection("users")
              .doc(userId)
              .delete()
              .then(() => {
                auth().currentUser.delete();
                navigation.replace("Landing");
              })
              .catch((error) => {
                console.error("Error deleting user: ", error);
                Alert.alert("Error", "Could not delete account.");
              });
          },
        },
      ]
    );
  };

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name: {userData.name}</Text>
      <Text style={styles.label}>Age: {userData.age}</Text>
      <Text style={styles.label}>Gender: {userData.gender}</Text>
      <Text style={styles.label}>Phone Number: {userData.phoneNumber}</Text>
      <Text style={styles.label}>Trusted Contacts:</Text>
      <FlatList
        data={userData.trustedContacts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.trustedContact}>
            <Text>Name: {item.name}</Text>
            <Text>Phone: {item.phone}</Text>
          </View>
        )}
      />
      <Button
        title="Edit"
        onPress={() => navigation.navigate("Register", { userData })}
      />
      <Button
        title="Delete Account"
        onPress={handleDeleteAccount}
        color="red"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  trustedContact: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
  },
});

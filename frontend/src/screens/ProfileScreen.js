// src/screens/ProfileScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth } from "../../configure"; // Import auth
import { app } from "../../configure"; // Import app

const firestore = getFirestore(app);

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null); // State to store user data

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser; // Get the current logged-in user
        if (user) {
          // Fetch user data from Firestore using user.uid
          const userDocRef = doc(firestore, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setUserData(userDoc.data()); // Set the user data
          } else {
            Alert.alert("Error", "User data not found");
          }
        }
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Information</Text>
      {/* Display User's Information */}
      <Text style={styles.label}>Name: {userData.name}</Text>
      <Text style={styles.label}>Gender: {userData.gender}</Text>
      <Text style={styles.label}>Email: {userData.email}</Text>
      <Text style={styles.label}>Phone Number: {userData.phone}</Text>{" "}
      {/* Display phone number */}
      <Text style={styles.title}>Trusted Person 1</Text>
      <Text style={styles.label}>Name: {userData.trustedPersons[0].name}</Text>
      <Text style={styles.label}>
        Gender: {userData.trustedPersons[0].gender}
      </Text>
      <Text style={styles.label}>
        Phone: {userData.trustedPersons[0].phone}
      </Text>
      <Text style={styles.title}>Trusted Person 2</Text>
      <Text style={styles.label}>Name: {userData.trustedPersons[1].name}</Text>
      <Text style={styles.label}>
        Gender: {userData.trustedPersons[1].gender}
      </Text>
      <Text style={styles.label}>
        Phone: {userData.trustedPersons[1].phone}
      </Text>
      <Button
        title="Logout"
        onPress={() => {
          auth
            .signOut()
            .then(() => {
              Alert.alert("Logged Out");
              navigation.navigate("Login"); // Navigate back to the login screen
            })
            .catch((error) => {
              Alert.alert("Error", error.message);
            });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default ProfileScreen;

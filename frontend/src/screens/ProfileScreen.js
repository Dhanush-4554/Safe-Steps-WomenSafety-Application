import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, TextInput, Alert } from "react-native";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { auth } from "../../configure"; // Import auth
import { app } from "../../configure"; // Import app

const firestore = getFirestore(app);

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null); // State to store user data
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [editedData, setEditedData] = useState({}); // State for edited data

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser; // Get the current logged-in user
        if (user) {
          const userId = user.uid;
          const userDocRef = doc(firestore, "users", userId);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data); // Set the user data
            setEditedData(data); // Set the edited data initially to the current user data
          } else {
            Alert.alert("Error", "User data not found");
          }
        } else {
          Alert.alert("No user login", "User has not logged in");
        }
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveChanges = async () => {
    try {
      const userId = auth.currentUser.uid;
      const userDocRef = doc(firestore, "users", userId);

      await updateDoc(userDocRef, editedData); // Update Firestore with the edited data
      setUserData(editedData); // Update the local state
      setIsEditing(false); // Exit edit mode
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const userId = auth.currentUser.uid;

      // Delete the user document from Firestore
      const userDocRef = doc(firestore, "users", userId);
      await deleteDoc(userDocRef);

      // Delete the user's Firebase Authentication account
      await auth.currentUser.delete();

      Alert.alert("Account Deleted", "Your account has been deleted");
      navigation.navigate("Landing"); // Navigate back to the login screen
    } catch (error) {
      Alert.alert("Error", error.message);
    }
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
      <Text style={styles.title}>Profile Information</Text>

      {isEditing ? (
        // Edit Mode: Allow the user to edit profile details
        <>
          <TextInput
            style={styles.input}
            value={editedData.name}
            onChangeText={(text) =>
              setEditedData({ ...editedData, name: text })
            }
            placeholder="Name"
          />
          <TextInput
            style={styles.input}
            value={editedData.gender}
            onChangeText={(text) =>
              setEditedData({ ...editedData, gender: text })
            }
            placeholder="Gender"
          />
          <TextInput
            style={styles.input}
            value={editedData.email}
            onChangeText={(text) =>
              setEditedData({ ...editedData, email: text })
            }
            placeholder="Email"
          />
          <TextInput
            style={styles.input}
            value={editedData.phone}
            onChangeText={(text) =>
              setEditedData({ ...editedData, phone: text })
            }
            placeholder="Phone"
          />
          {/* Trusted person fields */}
          <Text style={styles.title}>Trusted Person 1</Text>
          <TextInput
            style={styles.input}
            value={editedData.trustedPersons[0].name}
            onChangeText={(text) => {
              let updatedPersons = [...editedData.trustedPersons];
              updatedPersons[0].name = text;
              setEditedData({ ...editedData, trustedPersons: updatedPersons });
            }}
            placeholder="Trusted Person 1 Name"
          />
          {/* Add fields for other trusted persons similarly */}

          <Button title="Save Changes" onPress={handleSaveChanges} />
          <Button title="Cancel" onPress={() => setIsEditing(false)} />
        </>
      ) : (
        // View Mode: Display user's profile details
        <>
          <Text style={styles.label}>Name: {userData.name}</Text>
          <Text style={styles.label}>Gender: {userData.gender}</Text>
          <Text style={styles.label}>Email: {userData.email}</Text>
          <Text style={styles.label}>Phone Number: {userData.phone}</Text>
          {/* Display trusted persons details */}
          <Text style={styles.title}>Trusted Person 1</Text>
          <Text style={styles.label}>
            Name: {userData.trustedPersons[0].name}
          </Text>
          <Text style={styles.label}>
            Gender: {userData.trustedPersons[0].gender}
          </Text>
          <Text style={styles.label}>
            Phone: {userData.trustedPersons[0].phone}
          </Text>

          <Button title="Edit Profile" onPress={() => setIsEditing(true)} />
          <Button title="Delete Account" onPress={handleDeleteAccount} />
        </>
      )}

      <Button
        title="Logout"
        onPress={() => {
          auth
            .signOut()
            .then(() => {
              Alert.alert("Logged Out");
              navigation.navigate("Landing"); // Navigate back to the login screen
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default ProfileScreen;

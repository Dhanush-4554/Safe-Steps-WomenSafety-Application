import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { auth } from "../../configure"; // Firebase auth instance
import { app } from "../../configure"; // Firebase app instance

// Initialize Firestore
const firestore = getFirestore(app);

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null); // User data from Firestore
  const [isEditing, setIsEditing] = useState(false); // Toggles edit mode
  const [editedData, setEditedData] = useState({}); // Stores editable data

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userId = user.uid;
          const userDocRef = doc(firestore, "users", userId);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data); // Set retrieved user data
            setEditedData(data); // Prepare editable data
          } else {
            Alert.alert("Error", "User data not found");
          }
        } else {
          Alert.alert(
            "No User Logged In",
            "Please log in to view your profile."
          );
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

      await updateDoc(userDocRef, editedData); // Save changes to Firestore
      setUserData(editedData); // Update displayed data
      setIsEditing(false); // Exit edit mode
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;

        // Delete user document from Firestore
        const userDocRef = doc(firestore, "users", userId);
        await deleteDoc(userDocRef);

        // Delete user from Firebase Auth
        await user.delete();

        Alert.alert("Account Deleted", "Your account has been deleted.");
        navigation.navigate("Landing"); // Navigate back to login screen
      }
    } catch (error) {
      // If the user has been logged in for a long time, reauthentication is required
      if (error.code === "auth/requires-recent-login") {
        Alert.alert("Error", "Please log in again to delete your account.");

        // Optionally: Redirect to a reauthentication screen
        // You could prompt the user to log in again, then retry the deletion
      } else {
        Alert.alert("Error", error.message);
      }
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile Information</Text>

      {isEditing ? (
        // Edit Mode: Editable fields
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

          {/* Trusted Persons */}
          <Text style={styles.subTitle}>Trusted Person 1</Text>
          <TextInput
            style={styles.input}
            value={editedData.trustedPersons[0]?.name}
            onChangeText={(text) => {
              let updatedPersons = [...editedData.trustedPersons];
              updatedPersons[0].name = text;
              setEditedData({ ...editedData, trustedPersons: updatedPersons });
            }}
            placeholder="Trusted Person 1 Name"
          />
          <TextInput
            style={styles.input}
            value={editedData.trustedPersons[0]?.gender}
            onChangeText={(text) => {
              let updatedPersons = [...editedData.trustedPersons];
              updatedPersons[0].gender = text;
              setEditedData({ ...editedData, trustedPersons: updatedPersons });
            }}
            placeholder="Trusted Person 1 Gender"
          />
          <TextInput
            style={styles.input}
            value={editedData.trustedPersons[0]?.phone}
            onChangeText={(text) => {
              let updatedPersons = [...editedData.trustedPersons];
              updatedPersons[0].phone = text;
              setEditedData({ ...editedData, trustedPersons: updatedPersons });
            }}
            placeholder="Trusted Person 1 Phone"
          />

          <Text style={styles.subTitle}>Trusted Person 2</Text>
          <TextInput
            style={styles.input}
            value={editedData.trustedPersons[1]?.name}
            onChangeText={(text) => {
              let updatedPersons = [...editedData.trustedPersons];
              updatedPersons[1].name = text;
              setEditedData({ ...editedData, trustedPersons: updatedPersons });
            }}
            placeholder="Trusted Person 2 Name"
          />
          <TextInput
            style={styles.input}
            value={editedData.trustedPersons[1]?.gender}
            onChangeText={(text) => {
              let updatedPersons = [...editedData.trustedPersons];
              updatedPersons[1].gender = text;
              setEditedData({ ...editedData, trustedPersons: updatedPersons });
            }}
            placeholder="Trusted Person 2 Gender"
          />
          <TextInput
            style={styles.input}
            value={editedData.trustedPersons[1]?.phone}
            onChangeText={(text) => {
              let updatedPersons = [...editedData.trustedPersons];
              updatedPersons[1].phone = text;
              setEditedData({ ...editedData, trustedPersons: updatedPersons });
            }}
            placeholder="Trusted Person 2 Phone"
          />

          <Button title="Save Changes" onPress={handleSaveChanges} />
          <Button title="Cancel" onPress={() => setIsEditing(false)} />
        </>
      ) : (
        // View Mode: Display profile data
        <>
          <Text style={styles.label}>Name: {userData.name}</Text>
          <Text style={styles.label}>Gender: {userData.gender}</Text>
          <Text style={styles.label}>Email: {userData.email}</Text>
          <Text style={styles.label}>Phone: {userData.phone}</Text>

          {/* Trusted Persons */}
          <Text style={styles.subTitle}>Trusted Person 1</Text>
          <Text style={styles.label}>
            Name: {userData.trustedPersons[0]?.name}
          </Text>
          <Text style={styles.label}>
            Gender: {userData.trustedPersons[0]?.gender}
          </Text>
          <Text style={styles.label}>
            Phone: {userData.trustedPersons[0]?.phone}
          </Text>

          <Text style={styles.subTitle}>Trusted Person 2</Text>
          <Text style={styles.label}>
            Name: {userData.trustedPersons[1]?.name}
          </Text>
          <Text style={styles.label}>
            Gender: {userData.trustedPersons[1]?.gender}
          </Text>
          <Text style={styles.label}>
            Phone: {userData.trustedPersons[1]?.phone}
          </Text>

          {/* <Button title="Edit Profile" onPress={() => setIsEditing(true)} />
          <Button title="Delete Account" onPress={handleDeleteAccount} /> */}
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <Button title="Edit" onPress={() => setIsEditing(true)} />
            </View>
            <View style={styles.button}>
              <Button
                title="Delete Account"
                onPress={handleDeleteAccount}
                color="red"
              />
            </View>
          </View>
        </>
      )}

      <Button
        title="Logout"
        onPress={() => {
          auth
            .signOut()
            .then(() => {
              Alert.alert("Logged Out");
              navigation.navigate("Landing");
            })
            .catch((error) => {
              Alert.alert("Error", error.message);
            });
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
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
  // Styles for the button container to place buttons side by side
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 30,
  },
  // Styles for individual buttons with margin between them
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default ProfileScreen;

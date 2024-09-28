import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
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
      if (error.code === "auth/requires-recent-login") {
        Alert.alert("Error", "Please log in again to delete your account.");
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

      {/* Placeholder Profile Picture */}
      <View style={styles.profilePicContainer}>
        <Image
          source={{
            uri: userData.profilePic || 'https://static.vecteezy.com/system/resources/thumbnails/027/729/264/small/young-woman-in-white-t-shirt-isolated-png.png', // Placeholder image
          }}
          style={styles.profilePic}
        />
      </View>

      <View style={styles.dataContainer}>
        {isEditing ? (
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

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveChanges}
            >
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsEditing(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.label}>Name: {userData.name}</Text>
            <Text style={styles.label}>Gender: {userData.gender}</Text>
            <Text style={styles.label}>Email: {userData.email}</Text>
            <Text style={styles.label}>Phone: {userData.phone}</Text>

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

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.buttonText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDeleteAccount}
              >
                <Text style={styles.buttonText}>Delete Account</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          auth
            .signOut()
            .then(() => {
              Alert.alert("Logged Out", "You have been logged out.");
              navigation.navigate("Landing"); // Navigate to login screen
            })
            .catch((error) => Alert.alert("Error", error.message));
        }}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F0F0F0",
    alignItems: "center", // Center align contents
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  profilePicContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: "#D1D1D1",

  },
  dataContainer: {
    width: "100%",
    borderRadius: 10,
    padding: 20,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#D1D1D1",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  editButton: {
    backgroundColor: "#4f99e8",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: "#FF5A5F",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  logoutButton: {
    backgroundColor: "#FF5A5F",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: "100%",
  },
  saveButton: {
    backgroundColor: "#28A745",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: "#6C757D",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default ProfileScreen;

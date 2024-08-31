import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Alert, FlatList } from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);

  // Fetch user data from Firebase Firestore when the component mounts
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

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  // Function to handle account deletion
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

  // Show loading text while data is being fetched
  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Display user details */}
      <Text style={styles.label}>Name: {userData.name}</Text>
      <Text style={styles.label}>Age: {userData.age}</Text>
      <Text style={styles.label}>Gender: {userData.gender}</Text>
      <Text style={styles.label}>Phone Number: {userData.phoneNumber}</Text>
      <Text style={styles.label}>Trusted Contacts:</Text>

      {/* Render trusted contacts using FlatList */}
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

      {/* Buttons placed directly after user details and trusted contacts */}
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button
            title="Edit"
            onPress={() => navigation.navigate("Register", { userData })}
          />
        </View>
        <View style={styles.button}>
          <Button
            title="Delete Account"
            onPress={handleDeleteAccount}
            color="red"
          />
        </View>
      </View>
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
  // Styles for the button container to place buttons side by side
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  // Styles for individual buttons with margin between them
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});

// import React, { useEffect, useState } from "react";
// import { View, Text, Button, StyleSheet, Alert, FlatList } from "react-native";
// import auth from "@react-native-firebase/auth";
// import firestore from "@react-native-firebase/firestore";

// export default function ProfileScreen({ navigation }) {
//   const [userData, setUserData] = useState(null);

//   useEffect(() => {
//     const userId = auth().currentUser.uid;
//     const unsubscribe = firestore()
//       .collection("users")
//       .doc(userId)
//       .onSnapshot((documentSnapshot) => {
//         if (documentSnapshot.exists) {
//           setUserData(documentSnapshot.data());
//         }
//       });

//     return () => unsubscribe();
//   }, []);

//   const handleDeleteAccount = () => {
//     Alert.alert(
//       "Delete Account",
//       "Are you sure you want to delete your account?",
//       [
//         {
//           text: "Cancel",
//           style: "cancel",
//         },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: () => {
//             const userId = auth().currentUser.uid;
//             firestore()
//               .collection("users")
//               .doc(userId)
//               .delete()
//               .then(() => {
//                 auth().currentUser.delete();
//                 navigation.replace("Landing");
//               })
//               .catch((error) => {
//                 console.error("Error deleting user: ", error);
//                 Alert.alert("Error", "Could not delete account.");
//               });
//           },
//         },
//       ]
//     );
//   };

//   if (!userData) {
//     return (
//       <View style={styles.container}>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>Name: {userData.name}</Text>
//       <Text style={styles.label}>Age: {userData.age}</Text>
//       <Text style={styles.label}>Gender: {userData.gender}</Text>
//       <Text style={styles.label}>Phone Number: {userData.phoneNumber}</Text>
//       <Text style={styles.label}>Trusted Contacts:</Text>
//       <FlatList
//         data={userData.trustedContacts}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.trustedContact}>
//             <Text>Name: {item.name}</Text>
//             <Text>Phone: {item.phone}</Text>
//           </View>
//         )}
//       />
//       <View style={styles.buttonContainer}>
//         <View style={styles.button}>
//           <Button
//             title="Edit"
//             onPress={() => navigation.navigate("Register", { userData })}
//           />
//         </View>
//         <View style={styles.button}>
//           <Button
//             title="Delete Account"
//             onPress={handleDeleteAccount}
//             color="red"
//           />
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   label: {
//     fontSize: 18,
//     marginBottom: 10,
//   },
//   trustedContact: {
//     padding: 10,
//     marginVertical: 5,
//     backgroundColor: "#f1f1f1",
//     borderRadius: 5,
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 20,
//   },
//   button: {
//     flex: 1,
//     marginHorizontal: 5,
//   },
// });

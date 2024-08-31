// import React from "react";
// import { createStackNavigator } from "@react-navigation/stack";
// import { NavigationContainer } from "@react-navigation/native";

// import HomeScreen from "../screens/HomeScreen";
// import RegisterScreen from "../screens/RegisterScreen";
// import LoginScreen from "../screens/LoginScreen";
// import LandingScreen from "../screens/LandingScreen";
// import ProfileScreen from "../screens/ProfileScreen";
// import NightSupportScreen from "../screens/NightSupportScreen";

// const Stack = createStackNavigator();

// export default function AppNavigator() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Landing">
//         <Stack.Screen
//           name="Landing"
//           component={LandingScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen name="Login" component={LoginScreen} />
//         <Stack.Screen name="Register" component={RegisterScreen} />
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen name="Profile" component={ProfileScreen} />
//         <Stack.Screen name="NightSupport" component={NightSupportScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { Button, Alert } from "react-native";

import auth from "@react-native-firebase/auth";
import HomeScreen from "../screens/HomeScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import LandingScreen from "../screens/LandingScreen";
import ProfileScreen from "../screens/ProfileScreen";
import NightSupportScreen from "../screens/NightSupportScreen";

const Stack = createStackNavigator();

export default function AppNavigator({ user }) {
  const handleLogout = (navigation) => {
    auth()
      .signOut()
      .then(() => {
        Alert.alert("Logged Out", "You have been logged out successfully.");
        navigation.replace("Landing");
      });
  };
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "Home" : "Landing"}>
        <Stack.Screen
          name="Landing"
          component={LandingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            title: "Home",
            headerRight: () => (
              <Button
                onPress={() => handleLogout(navigation)}
                title="Logout"
                color="blue"
              />
            ),
          })}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="NightSupport" component={NightSupportScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

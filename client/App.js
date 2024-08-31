// import React from "react";
// import AppNavigator from "./app/navigation/AppNavigator";

// export default function App() {
//   return <AppNavigator />;
// }

import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";
import AppNavigator from "./app/navigation/AppNavigator";
import { View, ActivityIndicator } from "react-native";

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing)
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );

  return (
    // <NavigationContainer>
    <AppNavigator user={user} />
    // </NavigationContainer>
  );
}

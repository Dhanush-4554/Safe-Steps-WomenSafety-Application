import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const handleLogin = async () => {
    const auth = getAuth();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("Home");
    } catch (error) {
      console.error("Login failed:", error);
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#fff"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#fff"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#ff4b5c" /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>

      <Text style={styles.promptText}>
        Don't have an account?
        <Text style={styles.registerText} onPress={handleRegister}>
          Sign up
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff5a5f",  // Background color based on theme
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",  // White text for contrast with background
    marginBottom: 40,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#fff",  // White border to match theme
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    color: "#fff",  // White text inside input
    backgroundColor: "transparent",  // Transparent to let background show through
  },
  button: {
    width: "100%",
    backgroundColor: "#fff",  // White button to stand out on red background
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginVertical: 10,
  },
  disabledButton: {
    backgroundColor: "#ffb3b9",  // Slightly muted version of white for disabled state
  },
  buttonText: {
    color: "#ff4b5c",  // Red text on white button for contrast
    fontWeight: "bold",
    fontSize: 18,
  },
  promptText: {
    color: "#fff",  // White text for the prompt
    fontSize: 16,
    marginTop: 20,
  },
  registerText: {
    color: "#fff",  // White "Sign up" text to match the rest
    fontWeight: "bold",
  },
});

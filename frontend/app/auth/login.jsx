import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React from 'react';

const Login = () => {
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.mainHeader}>Login Form</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.labels}>Enter your name</Text>
        <TextInput style={styles.inputStyle} autoCapitalize='none' autoCorrect={false} value={email} onChangeText={setEmail} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.labels}>Enter your password</Text>
        <TextInput style={styles.inputStyle} autoCapitalize='none' autoCorrect={false} secureTextEntry={true} />
      </View>
      <TouchableOpacity style={styles.buttonStyle}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Login;

const styles = StyleSheet.create({
  inputStyle: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 1,
    fontSize: 16,
  },
  mainContainer: {
    height: "100%",
    paddingHorizontal: 30,
    paddingTop: 30,
    backgroundColor: "#fff",
  },
  labels: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
    color: "#7d7d7d",
    lineHeight: 25,
  },
  mainHeader: {
    fontSize: 28,
    fontWeight: "500",
    marginBottom: 20,
    color: "#7d7d7d",
  },
  inputContainer: {
    marginTop: 20,
  },
  buttonStyle: {
    backgroundColor: "#169843",
    paddingVertical: 10,
    borderRadius: 1,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontFamily: " monospace", 
    fontSize: 18,
    color: "#fff", 
  },
});

import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.mainHeader}>Login Form</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.labels}>Enter your email</Text>
        <TextInput
          style={styles.inputStyle}
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.labels}>Enter your password</Text>
        <TextInput
          style={styles.inputStyle}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
        />
      </View>

      <TouchableOpacity style={styles.buttonStyle}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    paddingHorizontal: 30,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  mainHeader: {
    fontSize: 28,
    fontWeight: '500',
    marginBottom: 20,
    color: '#7d7d7d',
  },
  inputContainer: {
    marginTop: 20,
  },
  labels: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
    color: '#7d7d7d',
    lineHeight: 25,
  },
  inputStyle: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 1,
    fontSize: 16,
  },
  buttonStyle: {
    backgroundColor: '#169843',
    paddingVertical: 10,
    borderRadius: 1,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'monospace', 
    fontSize: 18,
    color: '#fff',
  },
});

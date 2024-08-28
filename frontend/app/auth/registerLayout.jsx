import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';

const RegisterLayout = () => {
  const [phoneNumber, setPhoneNumber] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [name, setName] = useState(''); 

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.mainHeader}>Register Form</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.labels}>Enter your name</Text>
        <TextInput
          style={styles.inputStyle}
          autoCapitalize="none"
          autoCorrect={false}
          value={name} 
          onChangeText={setName} 
          placeholder="Name"
          editable={true} 
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.labels}>Enter your phone number</Text>
        <TextInput
          style={styles.inputStyle}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="phone-pad" 
          value={phoneNumber} 
          onChangeText={setPhoneNumber} 
          placeholder="Phone Number"
          editable={true} 
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
          editable={true} 
        />
      </View>

      <TouchableOpacity style={styles.buttonStyle}>
        <Text style={styles.buttonText}>REGISTER</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterLayout;

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

import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';

const Otp = () => {
    const [otp, setotp] = useState('');
 
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.mainHeader}>OTP</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.labels}>OTP</Text>
        <TextInput
          style={styles.inputStyle}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="phone-pad" 
          value={otp} 
          onChangeText={setotp} 
          placeholder="otp"
          editable={true} 
        />
      </View>


      
      <TouchableOpacity style={styles.buttonStyle}>
        <Text style={styles.buttonText}>SUBMIT</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Otp

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
})
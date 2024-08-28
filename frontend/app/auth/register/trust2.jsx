import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';  


const Trust2 = () => {
    const [name, setName] = useState(''); 
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedValue, setSelectedValue] = useState('select'); 

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.mainHeader}>Trust2 </Text>
      
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
        <Text style={styles.labels}>Gender</Text>  
        <View style={styles.pickerContainer}>  
          <Picker  
            selectedValue={selectedValue}  
            onValueChange={(itemValue) => setSelectedValue(itemValue)}  
            style={styles.picker}  
          >  
            <Picker.Item label="Select" value="select" />  
            <Picker.Item label="Female" value="Female" />  
            <Picker.Item label="Male" value="Male" />  
            <Picker.Item label="others" value="others" />  
          </Picker>  
        </View>  
      </View>  


      <TouchableOpacity style={styles.buttonStyle}>
        <Text style={styles.buttonText}>SUBMIT</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Trust2

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

      pickerContainer: {  
    borderWidth: 1,  
    borderColor: '#ccc',  
    borderRadius: 4,  
    overflow: 'hidden',  
  },  
  picker: {  
    height: 50,  
    width: '100%',  
  },  
})
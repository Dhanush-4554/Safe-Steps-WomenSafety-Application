import { StyleSheet, Text, TouchableOpacity, View, Switch } from 'react-native';
import React, { useState } from 'react';

const Buttons = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    console.log(isEnabled ? "no" : "yes");
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>NIGHT SUPPORT</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#f4f3f4" }}
          thumbColor={isEnabled ? "#f4f3f4" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          value={isEnabled}
          onValueChange={toggleSwitch}
          style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }}
        />
      </View>

      <TouchableOpacity style={styles.buttonStyle}>
        <Text style={styles.buttonText}>SOS</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Buttons;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',     
    backgroundColor: '#fff',
  },
  switchContainer: {
    alignItems: 'center',
    marginBottom: 30, 
  },
  switchLabel: {
    fontWeight: 'bold',
    fontSize: 22,
    margin: 20,
  },
  buttonStyle: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
  },
  buttonText: {
    fontFamily: 'monospace',
    fontSize: 18,
    color: '#fff',
  },
});

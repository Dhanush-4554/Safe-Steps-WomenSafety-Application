import React, { useState } from "react";  
import { View, Switch, StyleSheet, TouchableOpacity, Text } from "react-native"; // Import Text here  
import { Ionicons } from "@expo/vector-icons";  

export default function NightSupportScreen({ navigation }) {  
  const [isEnabled, setIsEnabled] = useState(false);  

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);  

  return (  
    <View style={styles.container}>  

<Text style={styles.title}>Night Support Mode</Text>
<Text style={styles.subtitle}>Toggle to enable night mode for better night-time safety.</Text>
      
      <Switch  
        trackColor={{ false: "#767577", true: "#81b0ff" }}  
        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}  
        style={{ transform: [{ scaleX: 3 }, { scaleY: 3 }] }}  
        onValueChange={toggleSwitch}  
        value={isEnabled}  
      />  

      {/* Footer section */}  
      <View style={styles.footer}>  
        <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.button}>  
          <Ionicons name="home" size={24} color="#FF5A5F" />  
          <Text style={styles.buttonText}>Home</Text>  
        </TouchableOpacity>  
        <TouchableOpacity onPress={() => navigation.navigate("NightSupport")} style={styles.button}>  
          <Ionicons name="moon" size={24} color="#FF5A5F" />  
          <Text style={styles.buttonText}>Night Support</Text>  
        </TouchableOpacity>  
        <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={styles.button}>  
          <Ionicons name="person" size={24} color="#FF5A5F" />  
          <Text style={styles.buttonText}>Profile</Text>  
        </TouchableOpacity>  
      </View>  
    </View>  
  );  
}  

const styles = StyleSheet.create({  
  container: {  
    flex: 1,  
    justifyContent: "center",  
    alignItems: "center",
    backgroundColor:"#FF5A5F",  
  },  
  footer: {  
    flexDirection: "row",  
    justifyContent: "space-around",  
    position: "absolute",  
    bottom: 0,  
    width: "100%",  
    padding: 10,  
    backgroundColor: "#f8f8f8",  
  },  
  button: {  
    alignItems: "center",  
  },  
  buttonText: {  
    marginTop: 4,  
    color: "#FF5A5F",  
  },  
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 30,
    textAlign: "center",
    paddingHorizontal: 5,
    paddingVertical: 25,
  },
});
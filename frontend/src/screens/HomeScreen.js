import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SOSButton from "../components/SOSButton";

import io from "socket.io-client"; // Import Socket.IO client

const socket = io("http://192.168.29.34:5000"); // Replace with your Flask server IP and port

export default function HomeScreen({ navigation }) {
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //For enable and disable feature

  const [isPredicting, setIsPredicting] = useState(false);
  const [countdown, setCountdown] = useState(10); // 10 seconds countdown
  const [isCancelled, setIsCancelled] = useState(false);

  //this the function for the delay feature
  useEffect(() => {
    let countdownInterval = null;

    if (isPredicting && countdown > 0 && !isCancelled) {
      countdownInterval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    if (countdown === 0) {
      clearInterval(countdownInterval);
      if (!isCancelled) {
        // Proceed with the backend call after the countdown finishes
        triggerPrediction();
        setCountdown(10);
        setIsPredicting(false);
      }
    }

    // Clear the interval when countdown finishes or when the component unmounts
    return () => clearInterval(countdownInterval);
  }, [isPredicting, countdown, isCancelled]);

  const startPrediction = () => {
    setIsPredicting(true);
    setCountdown(10);
    setIsCancelled(false);
  };

  const triggerPrediction = async () => {
    try {
      const response = await fetch("http://192.168.29.34:5000/confirm-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify({ file: "<audio-file-data>" }), // Replace with your audio file data
      });

      const data = await response.json();
      console.log("Prediction Result:", data);
      // Reset after prediction completes
      setIsPredicting(false);
    } catch (error) {
      console.error("Error triggering prediction:", error);
      setIsPredicting(false);
    }
  };

  const cancelPrediction = async () => {
    setIsCancelled(true);
    setIsPredicting(false);

    try {
      await fetch("http://192.168.29.34:5000/cancel-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      console.log("Prediction canceled.");
    } catch (error) {
      console.error("Error canceling prediction:", error);
    }
  };

  useEffect(() => {
    // Listen for the start prediction event from the backend
    socket.on("start_prediction", (data) => {
      console.log(data.message);
      startPrediction(); // Automatically start prediction
    });

    return () => {
      socket.off("start_prediction"); // Clean up the event listener when component unmounts
    };
  }, []);
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const handleSOSPress = async () => {
    console.log("SOS Clicked");

    try {
      const response = await fetch("http://192.168.29.34:5000/send-call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Call initiated:", result);
      Alert.alert(
        "Alert Sent",
        "A call has been initiated to notify emergency services."
      );
    } catch (error) {
      console.error("Failed to send call alert:", error);
      Alert.alert("Error", "Failed to send call alert. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

      <View style={styles.stopContainer}>
        {isPredicting ? (
          <View style={styles.stopDiv}>
            <Text style={styles.stopAlertTxt}>
              Voice SOS will be Activated In {countdown}s
            </Text>
            {/* <Button
              title="Stop Voice SOS"
              onPress={cancelPrediction}
              style={styles.stopBtn}
            /> */}
            <TouchableOpacity style={styles.stopBtn} onPress={cancelPrediction}>
              <Text style={styles.stopTxt}>Stop Voice SOS</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.stopBtn} onPress={startPrediction}>
            <Text style={styles.stopTxt}>Voice SOS is Inactive</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

      <Text style={styles.title}>Having an Emergency?</Text>
      <Text style={styles.subtitle}>
        Tap the SOS button to alert the emergency services.
      </Text>
      <SOSButton onPress={handleSOSPress} />

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.button}
        >
          <Ionicons name="home" size={24} color="#FF5A5F" />
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Track Me")}
          style={styles.button}
        >
          <Ionicons name="moon" size={24} color="#FF5A5F" />
          <Text style={styles.buttonText}>Track Me</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Service")}
          style={styles.button}
        >
          <Ionicons name="settings-sharp" size={24} color="#FF5A5F" />
          <Text style={styles.buttonText}>Services</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Dialer")}
          style={styles.button}
        >
          <Ionicons name="call" size={24} color="#FF5A5F" />
          <Text style={styles.buttonText}>dialer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Profile")}
          style={styles.button}
        >
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
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 80,
    color: "#333",
    textAlign: "center",
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
  stopContainer: {
    // marginTop: 10,
    marginBottom: 80,
  },
  stopBtn: {
    backgroundColor: "#FF5A5F",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    width: 270,
    marginTop: 10,
    marginLeft: 20,
  },
  stopTxt: {
    fontFamily: "Roboto",
    fontSize: 18,
    color: "white",
  },
  stopAlertTxt: {
    fontSize: 21,
    color: "black",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    fontFamily: "Roboto",
    fontWeight: "bold",
  },
});

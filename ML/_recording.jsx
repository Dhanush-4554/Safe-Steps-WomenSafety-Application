import React, { useEffect, useState, useRef } from 'react';
import { View, Button, Alert, Platform, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import * as Notifications from 'expo-notifications';

export default function HomeScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    (async () => {
      await requestPermissions();
    })();
  }, []);

  const requestPermissions = async () => {
    try {
      const { status: micStatus } = await Audio.requestPermissionsAsync();
      if (micStatus !== 'granted') {
        Alert.alert('Permission required', 'Please grant microphone permission to record audio.');
        return;
      }

      if (Platform.OS === 'android') {
        const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
        if (notificationStatus !== 'granted') {
          Alert.alert('Permission required', 'Please grant background permission to run the app in the background.');
        }
      }
    } catch (error) {
      console.error('Failed to request permissions', error);
      Alert.alert('Error', 'Failed to request necessary permissions.');
    }
  };

  const recordAndSendAudio = async () => {
    let recording = null;

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      console.log('Recording started');

      // Record for 15 seconds
      await new Promise(resolve => setTimeout(resolve, 15000));

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Recording stopped and stored at', uri);

      if (uri) {
        const formData = new FormData();
        formData.append('file', {
          uri,
          type: 'audio/3gp', // Ensure the MIME type is correct
          name: 'file.3gp',
        });

        const response = await fetch('http://192.168.29.163:5000/predict', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Server response:', result); // Log the server response
        Alert.alert('Server Response', JSON.stringify(result)); // Display the server response
      }

      // Wait for 2 seconds before starting the next recording
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Failed to record or upload audio', error);
      Alert.alert('Error', 'Failed to record or upload audio.');
    } finally {
      if (recording) {
        recording = null; // Reset the recording object
      }
    }
  };

  const startRecordingLoop = () => {
    if (!isRecording) {
      setIsRecording(true);
      intervalRef.current = setInterval(recordAndSendAudio, 17000); // Execute every 17 seconds (15 sec recording + 2 sec delay)
    }
  };

  const stopRecordingLoop = () => {
    if (isRecording) {
      clearInterval(intervalRef.current);
      setIsRecording(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title={isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={isRecording ? stopRecordingLoop : startRecordingLoop}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

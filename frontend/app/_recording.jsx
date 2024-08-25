import React, { useEffect, useRef, useState } from 'react';
import { Button, View, Text } from 'react-native';
import { Audio } from 'expo-av';
import axios from 'axios';

const AudioRecorder = () => {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  const recordingRef = useRef(null);

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, [recording]);

  const startRecording = async () => {
    try {
      console.log('Requesting permissions...');
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        setError('Permission to access microphone is required');
        return;
      }

      console.log('Starting recording...');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      recording.setOnRecordingStatusUpdate(updateRecordingStatus);
      recordingRef.current = recording;
      await recording.startAsync();

      setRecording(recording);
      setIsRecording(true);
      setError(null);
    } catch (err) {
      console.error('Failed to start recording', err);
      setError('Failed to start recording');
    }
  };

  const updateRecordingStatus = async (status) => {
    if (status.isDoneRecording) {
      await sendAudioToBackend();
      await recordingRef.current.stopAndUnloadAsync();
      startRecording(); // Restart recording
    }
  };

  const stopRecording = async () => {
    console.log('Stopping recording...');
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    setRecording(null);
  };

  const sendAudioToBackend = async () => {
    try {
      const uri = recording.getURI();
      const formData = new FormData();
      formData.append('file', {
        uri,
        name: 'audio.wav',
        type: 'audio/wav',
      });

      console.log('Sending audio to backend...');
      await axios.post('http://your-backend-url.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Audio sent successfully');
    } catch (err) {
      console.error('Failed to send audio to backend', err);
      setError('Failed to send audio to backend');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{isRecording ? 'Recording...' : 'Press to Record'}</Text>
      <Button
        title={isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={isRecording ? stopRecording : startRecording}
      />
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
    </View>
  );
};

export default AudioRecorder;

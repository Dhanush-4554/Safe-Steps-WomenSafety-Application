import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AudioRecorder from './_recording';
import Login from './auth/login.jsx';

export default function App() {
  return (
    <>
      <Login />
      <StatusBar style="auto" />
    </>
     //<View style={styles.container}>
     //   <Text>Protect Pulse</Text>
       // <StatusBar style="auto" />
     //</View>
      //<AudioRecorder/>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

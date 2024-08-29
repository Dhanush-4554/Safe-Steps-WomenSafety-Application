import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AudioRecorder from './_recording';
import RegisterLayout from './auth/registerLayout';
import Trust1 from './auth/register/trust1';
import Trust2 from './auth/register/trust2';
import Login from './auth/login';
import Otp from './auth/Otp';
import Buttons from './home';

export default function App() {
  return (
    <>
      <Buttons />
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

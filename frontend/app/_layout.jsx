import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import AudioRecorder from "./_recording";

export default function App() {
  return (
    <>
      {/* <View style={styles.container}>
        <Text>Hello world</Text>
        <StatusBar style="auto" />
      </View> */}
      <AudioRecorder />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

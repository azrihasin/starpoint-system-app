import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';

export default function QRScanner({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleQRCodeScanned = ({ type, data }) => {
    console.log(data);
    //setScanned(true);
    navigation.navigate("EventDetails", { eventId: data, showJoinButton: true });
  };

  if (hasPermission === null) {
    return <View style={{ flex: 1, alignItems: "center", justifyContent: 'center' }} ><Text>Requesting camera permission...</Text></View>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1, marginTop: 24 }} >
      <Camera
        onBarCodeScanned={handleQRCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );
}
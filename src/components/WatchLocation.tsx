import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Button,
  PermissionsAndroid,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export default function WatchLocation() {
  const watchPosition = () => {
    try {
      const watchID = Geolocation.watchPosition(
        position => {
          console.log('watchPosition', JSON.stringify(position));
          setPosition(JSON.stringify(position));
        },
        error => {
          console.log(error.message);
          Alert.alert('WatchPosition Error', JSON.stringify(error));
        },
        {enableHighAccuracy: true, timeout: 5000, maximumAge: 0},
      );
      setSubscriptionId(watchID);
    } catch (error) {
      Alert.alert('WatchPosition Error', JSON.stringify(error));
    }
  };

  const checkGPSPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Let us check that running pace',
          message:
            'RunningBeat needs access to your GPS location ' +
            'so we can find you awesome tunes.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the GPS location');
      } else {
        console.log('GPS permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  const clearWatch = () => {
    subscriptionId !== null && Geolocation.clearWatch(subscriptionId);
    console.log('resetting');
    setSubscriptionId(null);
    setPosition(null);
  };

  const [position, setPosition] = useState<string | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<number | null>(null);

  useEffect(() => {
    checkGPSPermission();
    return () => {
      clearWatch();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View>
      <Text>
        <Text style={styles.title}>Last position: </Text>
        {position || 'unknown'}
      </Text>
      {subscriptionId !== null ? (
        <Button title="Clear Watch" onPress={clearWatch} />
      ) : (
        <Button title="Watch Position" onPress={watchPosition} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: '500',
  },
});

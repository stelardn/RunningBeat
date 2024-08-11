import React, { useEffect } from 'react';
import { useSubscription, gql } from '@apollo/client';
import { accelerometer } from 'react-native-sensors';
import { map } from 'rxjs/operators';
import { Text, View } from 'react-native';
import apolloClient from '../services/apolloClient';

const ACCELEROMETER_DATA_SUBSCRIPTION = gql`
  subscription OnAccelerometerData($input: AccelerometerInput!) {
    accelerometerData(input: $input) {
      bpm
      track {
        name
        artist
      }
    }
  }
`;

const ACCELEROMETER_DATA_MUTATION = gql`
  mutation SendAccelerometerData($input: AccelerometerInput!) {
    sendAccelerometerData(input: $input) {
      bpm
      track {
        name
        artist
      }
    }
  }
`

const AccelerometerComponent = () => {
  useEffect(() => {
    const subscription = accelerometer
      .pipe(map(({ x, y, z }) => ({ x, y, z })))
      .subscribe((accelerometerData) => {
        apolloClient.mutate({
          mutation: ACCELEROMETER_DATA_MUTATION,
          variables: { input: accelerometerData },
        });
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const { data, loading } = useSubscription(ACCELEROMETER_DATA_SUBSCRIPTION);

  if (loading) return <Text>Loading...</Text>;

  return (
    <View>
      <Text>Current BPM: {data.accelerometerData.bpm}</Text>
      <Text>Now Playing: {data.accelerometerData.track.name} by {data.accelerometerData.track.artist}</Text>
    </View>
  );
};

export default AccelerometerComponent;

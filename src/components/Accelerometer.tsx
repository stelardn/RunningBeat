import React, {useEffect} from 'react';
import {useSubscription, gql} from '@apollo/client';
import {Text, View} from 'react-native';
import apolloClient from '../services/apolloClient';
import {processAccelerometer} from '../services/usePace';

const ACCELEROMETER_DATA_SUBSCRIPTION = gql`
  subscription OnAccelerometerData($input: AccelerometerInput!) {
    accelerometerData(input: $input) {
      name
      artist
      bpm
    }
  }
`;

const ACCELEROMETER_DATA_MUTATION = gql`
  mutation SendAccelerometerData($x: Float!, $y: Float!, $z: Float!) {
    sendAccelerometerData(x: $x, y: $y, z: $z) {
      title
      artist
      bpm
    }
  }
`;

const AccelerometerComponent = () => {
  useEffect(() => {
    const subscription = processAccelerometer(
      apolloClient,
      ACCELEROMETER_DATA_MUTATION,
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const {data, loading} = useSubscription(ACCELEROMETER_DATA_SUBSCRIPTION);

  if (loading) return <Text>Loading...</Text>;

  return (
    <View>
      <Text>Current BPM: {data.accelerometerData.bpm}</Text>
      <Text>
        Now Playing: {data.accelerometerData.track.name} by{' '}
        {data.accelerometerData.track.artist}
      </Text>
    </View>
  );
};

export default AccelerometerComponent;

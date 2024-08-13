import {
  ApolloClient,
  DocumentNode,
  NormalizedCacheObject,
} from '@apollo/client';
import {accelerometer} from 'react-native-sensors';
import {setUpdateIntervalForType, SensorTypes} from 'react-native-sensors';
import {map} from 'rxjs/operators';

setUpdateIntervalForType(SensorTypes.accelerometer, 5000);

export const processAccelerometer = (
  client: ApolloClient<NormalizedCacheObject>,
  mutation: DocumentNode,
) => {
  return accelerometer
    .pipe(
      map(data => {
        const {x, y, z} = data;
        console.log(data);
        return {x, y, z};
      }),
    )
    .subscribe(async accelerometerData => {
      try {
        const {x, y, z} = accelerometerData;

        return await client.mutate({
          mutation: mutation,
          variables: {x, y, z},
        });
      } catch (error) {
        console.error(error);
      }
    });
};

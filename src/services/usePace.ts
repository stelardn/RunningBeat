import { accelerometer } from 'react-native-sensors'
import { setUpdateIntervalForType, SensorTypes } from "react-native-sensors";


setUpdateIntervalForType(SensorTypes.accelerometer, 100);

accelerometer.pipe()
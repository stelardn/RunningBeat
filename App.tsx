import React from 'react';
import {ApolloProvider} from '@apollo/client';
import apolloClient from './src/services/apolloClient';
import AccelerometerComponent from './src/components/Accelerometer';

const App = () => (
  <ApolloProvider client={apolloClient}>
    <AccelerometerComponent />
  </ApolloProvider>
);

export default App;

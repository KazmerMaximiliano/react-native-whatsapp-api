import * as eva from '@eva-design/eva';
import {ApplicationProvider} from '@ui-kitten/components';
import React from 'react';
import {HomeScreen} from './screens/HomeScreen';

export const App = () => {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <HomeScreen />
    </ApplicationProvider>
  );
};

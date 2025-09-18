/**
 * Professional Trading Journal
 * React Native App Entry Point
 * 
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './package.json';

// Configure global error handling for production
if (!__DEV__) {
  console.disableYellowBox = true;
  console.warn = () => {};
  console.error = () => {};
}

AppRegistry.registerComponent(appName, () => App);
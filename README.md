# Midgar UX Tracker - React Native SDK

UX Tracker SDK from Lazy Lantern for React Native. 

## Requirements
 - `react-native` >= `0.54.x`
 - `react-navigation` `2.x` or `3.x`
 - `react-native-device-info` `2.x`
 
 These dependencies are declared as `peerDependencies` meaning there is only a loose coupling and it shouldn't interfere with the version of the dependencies you are using in your project. If you are currently not using these dependencies in your project, you must declare them in your `package.json` for this module to have its dependencies met.
 
 This module has been tested on Android (API >= 21) and iOS (10 and above).
 
 **So far, we only support apps built with `react-navigation`. Upcoming versions will remove this dependency and work on any type of React Native apps.**
 That means you must follow the installation steps and integrate with `react-navigation`'s `onNavigationStateChange` to feed the SDK with navigation events.
 
 ## Integration
First, add the module to your project:

```bash
npm install midgar-js
```

or

```bash
yarn add midgar-js
```

Then, instantiate the tracker in a high level component, ideally the one where you also instantiate your `react-navigation` AppContainer.

```javascript
import Midgar from 'midgar-js';

Midgar.init(YOUR_APP_ID);
```

Finally, wrap your `AppContainer` component in the `withMidgar` HoC:

```javascript
const AppContainer = withMidgar(createAppContainer(...))
```

That's it! The tracker is ready to work. 

### Notes
 - If you are not using `react-native-device-info` in your project yet, you must follow [instructions](https://www.npmjs.com/package/react-native-device-info) on how to integrate. 
 - `react-native-device-info` requires to be linked to the native projects. This happens automatically when you follow the installation procedure of the package. This means the midgar sdk **will not work on non-ejected Expo apps**.

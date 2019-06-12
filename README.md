# Midgar UX Tracker - React Native SDK

UX Tracker SDK from Lazy Lantern for React Native. 

## Requirements
 - `react-native` >= `0.41`
 - `react-navigation` `2.x` or `3.x`
 - `react-native-device-info` `2.x`
 
 These dependencies are declared as `peerDependencies` meaning there is only a loose coupling and it shouldn't interfere with the version of the dependencies you are using in your project. If you are currently not using these dependencies in your project, you must declare them in your `package.json` for this module to have its dependencies met.
 
 This module has been tested on Android (API >= 21) and iOS (10 and above).
 
 So far, we only support apps built with `react-navigation`. Upcoming versions will remove this dependency and work on any type of React Native apps.
 
 ## Integration
First, add the module to your project:

```$bash
npm install midgar-js
```

or

```$bash
yarn add midgar-js
```

Then, instantiate the tracker in a high level component, ideally the one where you also instantiate your `react-navigation` AppContainer.

```$javascript
const midgarTracker = new Midgar(YOUR_APP_ID).init();
```

Finally, create a method that you pass to the `onNavigationStateChange` props of your `AppContainer`:

```$javascript
 onNavigationStateChange={(prevState, currentState) => { midgarTracker.trackScreen(prevState, currentState); }}
```

That's it! The tracker is ready to work. 

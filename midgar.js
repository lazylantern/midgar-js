import MidgarManager from './manager';

export default class MidgarTracker {
  init(appId, deviceId) {
    try {
      this.manager = new MidgarManager(appId, deviceId);
      this.manager.start();
    } catch (e) {
      console.error(e);
    }
    return this;
  }

  trackScreen(prevState, currentState) {
    try {
      this.manager.trackScreenFromRoute(prevState, currentState);
    } catch (e) {
      console.error(e);
    }
  }

  // track screen with given name
  manuallyTrackScreen(screen) {
    try {
      this.manager.trackScreen(screen);
    } catch (e) {
      console.error(e);
    }
  }

  killSwitch() {
    try {
      this.manager.stop();
    } catch (e) {
      console.error(e);
    }
  }
}

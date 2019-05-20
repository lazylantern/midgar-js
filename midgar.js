import { AppState, Platform } from 'react-native';

class Event {
  constructor(screen, platform, sdk, type, timestamp, deviceId) {
    this.screen = screen;
    this.platform = platform;
    this.type = type;
    this.timestamp = timestamp;
    this.sdk = sdk;
    this.device_id = deviceId;
  }
}

class MidgarApi {
  BASE_URL = 'https://midgar-flask.herokuapp.com/api';

  constructor(appId) {
    this.appId = appId;
  }

  checkAppIsEnabled() {
    return this.postRequest('/apps/kill', {
      app_token: this.appId
    });
  }

  uploadBatch(events) {
    return this.postRequest('/events', {
      app_token: this.appId,
      events
    });
  }

  postRequest(endpoint, params) {
    const url = this.BASE_URL + endpoint;
    const body = JSON.stringify(params);
    const headers = {
      'Content-Type': 'application/json; charset=UTF-8'
    };

    return fetch(
      url,
      {
        headers,
        body,
        method: 'POST'
      }
    );
  }
}

class MidgarManager {
  static MAX_UPLOAD_BATCH_SIZE = 10;

  static UPLOAD_PERIOD_MS = 60 * 1000;

  events = [];

  hasBeenRemotelyEnabled = null;

  constructor(appId, deviceId) {
    this.appId = appId;
    this.deviceId = deviceId;
  }

  start() {
    this.api = new MidgarApi(this.appId);
    this.api.checkAppIsEnabled().then(
      (response) => {
        if (response.ok) {
          this.startMonitoring();
        } else {
          this.stop();
        }
      }
    );
  }

  startMonitoring() {
    this.trackAppStateChanges();
    this.hasBeenRemotelyEnabled = true;
    const self = this;
    this.timerId = setInterval(() => {
      const batch = self.events.splice(0, MidgarManager.MAX_UPLOAD_BATCH_SIZE);
      if (batch.length > 0) {
        self.api.uploadBatch(batch).then(
          (uploadResponse) => {
            if (__DEV__) {
              if (uploadResponse.ok) {
                console.info('Events successfully uploaded');
              } else {
                console.info('Something went wrong. Events got dropped.');
              }
            }
          }
        );
      }
    }, MidgarManager.UPLOAD_PERIOD_MS);
  }

  stop() {
    this.hasBeenRemotelyEnabled = false;
    AppState.removeEventListener('change', this.handleAppStateChanges);
    clearInterval(this.timerId);
    this.events = [];
  }

  trackScreen(screen) {
    if (this.isAllowedToCollectEvents()) {
      this.events.push(this.createEvent(screen, 'impression'));
    }
  }

  trackScreenFromRoute(prevState, currentState) {
    if (!this.isAllowedToCollectEvents()) {
      return false;
    }
    const currentScreen = this.getActiveRouteName(currentState);
    const prevScreen = this.getActiveRouteName(prevState);

    if (prevScreen !== currentScreen) {
      this.trackScreen(this.getActiveRouteName(currentState));
    }

    return true;
  }

  getActiveRouteName(navigationState) {
    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
      return this.getActiveRouteName(route);
    }
    return route.routeName;
  }

  isAllowedToCollectEvents() {
    return this.hasBeenRemotelyEnabled == null || this.hasBeenRemotelyEnabled === true;
  }

  createEvent(screen, type) {
    return new Event(screen, Platform.OS, 'rn', type, new Date().getTime(), this.deviceId);
  }

  trackAppStateChanges() {
    const self = this;
    try {
      AppState.addEventListener('change', (nextAppState) => {
        if (nextAppState === 'background') {
          self.events.push(this.createEvent('', 'background'));
        } else if (nextAppState === 'active') {
          self.events.push(this.createEvent('', 'foreground'));
        }
      });
    } catch (e) {
      console.error(e);
    }
  }
}

export default class MidgarTracker {
  init(appId, deviceId) {
    try {
      this.manager = new MidgarManager(appId);
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

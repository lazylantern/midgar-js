import { AppState, Platform } from 'react-native';
import Event from './models/event';
import MidgarApi from './api';
import Context from './contextBuilder';

function generateSessionId() {
  const chars = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuv0123456789'];
  return [...Array(10)].map(i => chars[Math.random() * chars.length | 0]).join``;
}

export default class MidgarManager {
    static MAX_UPLOAD_BATCH_SIZE = 10;

    static UPLOAD_PERIOD_MS = 60 * 1000; // 1 minute

    static SESSION_MAX_LENGTH_MS = 10 * 60 * 1000; // 10 minutes

    events = [];

    sessionId = null;

    timeOfLastBackgroundEvent = Number.MAX_SAFE_INTEGER

    hasBeenRemotelyEnabled = null;

    constructor(appId, deviceId) {
      this.appId = appId;
      this.deviceId = deviceId;
    }

    start() {
      this.api = new MidgarApi(this.appId);
      this.trackAppStateChanges();
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
      this.hasBeenRemotelyEnabled = true;
      const self = this;
      this.timerId = setInterval(() => {
        this.processBatch(self);
      }, MidgarManager.UPLOAD_PERIOD_MS);
    }

    processBatch() {
      const batch = this.events.splice(0, MidgarManager.MAX_UPLOAD_BATCH_SIZE);
      if (batch.length > 0) {
        this.api.uploadBatch(batch).then(
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
    }

    stop() {
      this.hasBeenRemotelyEnabled = false;
      AppState.removeEventListener('change', this.handleAppStateChanges);
      clearInterval(this.timerId);
      this.events = [];
    }

    checkSessionIdValidity() {
      return new Date().getTime() - this.timeOfLastBackgroundEvent < this.SESSION_MAX_LENGTH_MS;
    }

    getSessionId() {
      if (this.sessionId == null || !this.checkSessionIdValidity()) {
        this.sessionId = generateSessionId();
      }

      return this.sessionId;
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
      return new Event(screen, Platform.OS, 'rn', type, new Date().getTime(), this.deviceId, this.getSessionId(), Context);
    }

    trackAppStateChanges() {
      const self = this;
      try {
        AppState.addEventListener('change', (nextAppState) => {
          if (nextAppState === 'background') {
            self.events.push(this.createEvent('', 'background'));
            self.timeOfLastBackgroundEvent = new Date().getTime();
            if (self.isAllowedToCollectEvents()) {
              // Flush queue when we go to background as the timer will stop
              self.processBatch();
            }
          } else if (nextAppState === 'active') {
            self.events.push(this.createEvent('', 'foreground'));
          }
        });
      } catch (e) {
        console.error(e);
      }
    }
}
